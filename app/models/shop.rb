class Shop < ActiveRecord::Base
  include BookThatAppUtils

  validates_presence_of :site, :subdomain

  # The reason that we use the subdomain as the unique identifier for a Shop, instead of
  # using the ActiveResource site value, is that the site value could change. If a shop were
  # to revoke access to your application and re-install it at a later date, it would get
  # a new password for your app and its site would change. It's subdomain however is
  # immutable and makes a better key for Shops.
  validates_uniqueness_of :subdomain
  validates_exclusion_of :subdomain, :in => %w(admin, www, shopify, conciergify, support, info, help, api, status)

  has_many :events
  has_many :event_dates, dependent: :destroy
  has_many :bookings, dependent: :destroy
  has_many :booking_items # booking destroys these
  has_many :incomplete_bookings, dependent: :destroy
  has_many :products, dependent: :destroy
  has_many :variants, through: :products
  has_many :product_imports, dependent: :destroy
  has_many :locations, dependent: :destroy
  accepts_nested_attributes_for :locations, :reject_if => lambda {|n| n[:name].blank? }, :allow_destroy => true
  has_many :templates, dependent: :destroy, :class_name => "LiquidTemplate"
  has_many :shop_notes, dependent: :destroy
  has_many :blackouts, dependent: :destroy
  has_many :users, dependent: :destroy
  has_many :resources, dependent: :destroy
  has_many :resource_groups, dependent: :destroy
  has_many :seasons, as: :hourable, dependent: :destroy
  has_many :email_events, inverse_of: :shop, dependent: :destroy
  has_many :reminder_configs, inverse_of: :shop, dependent: :destroy
  accepts_nested_attributes_for :reminder_configs, reject_if: :all_blank, :allow_destroy => true
  has_many :reports

  before_create :default_settings #, :generate_authentication_token
  after_create :install, :create_default_reminder

  # delegate :appointments, :classes: :products # sti

  def tz
    tz = ActiveSupport::TimeZone.new(timezone)
    if tz.nil?
      Rails.logger.warn "TimeZone for #{subdomain} not found: #{timezone}. Defaulting to UTC."
      tz = ActiveSupport::TimeZone.new('Etc/UTC')
    end
    tz
  end

  def tzinfo
    tz.tzinfo
  end

  def local_time
    tz.now
  end

  def settings=(options)
    unless options.nil?
      old = settings
      self.settings_yaml = OpenStruct.new(
        :wizard => options['wizard'] || 'inactive',
        :quantity_range => options['quantity_range'] || old.quantity_range,
        :message_booked_out => options['message_booked_out'] || old.message_booked_out,
        :message_blacked_out => options['message_blacked_out'] || old.message_blacked_out,
        :message_unscheduled => options['message_unscheduled'] || old.message_unscheduled,
        :message_unavailable => options['message_unavailable'] || old.message_unavailable,
        :message_closed => options['message_closed'] || old.message_closed,
        :df => options['df'] || old.df,
        :region => options['region'] || old.region,
        :theme => options['theme'] || old.theme
      ).to_yaml
    end
  end

  #when you want a shop to get a note about an action, like a successful job, pass in the_message you want them to see.
  # if it's something for a shop to do and is therefore actionable, pass true in is_actionable.
  def notifier(the_message = "",  info_hash = {})
    shopnotes_hash = {:message => the_message, :actionable => info_hash[:actionable], :shop_id => id, :noteable_id => info_hash[:noteable_id], :noteable_type => info_hash[:noteable_type] }
    ActiveSupport::Notifications.instrument("shopnotes.notifier", shopnotes_hash
                                            )
  end

  def settings
    if self.settings_yaml.blank?
      h = Hash.new
      h["wizard"] = "inactive"
      h["quantity_range"] = "no"
      h["message_booked_out"] = "Booked Out"
      h["message_blacked_out"] = "Blacked Out"
      h["message_unscheduled"] = "Unscheduled"
      h["message_unavailable"] = "Unavailable"
      h["message_closed"] = "Closed"
      h["df"] = "mm/dd/yy"
      h["region"] = ""
      h["theme"] = "smoothness"
      h
    else
      YAML::load(self.settings_yaml)
    end
  end

  def settings_json
    ActiveSupport::JSON.encode(settings.marshal_dump).html_safe
  end

  def template(name)
    template = templates.find_by_name(name.to_s.gsub(/[_-]/, ' ').capitalize)

    # if template doesn't exist create it
    unless template
      template = LiquidTemplate.new
      template.name = name.to_s.gsub(/[_-]/, ' ').split.map(&:capitalize).join(' ')
      template.body = File.read("#{Rails.root}/db/templates/#{name}.liquid")
      template.shop = self
      template.save
    end

    template
  end

  def install
    Delayed::Job.enqueue ShopInstallJob.new(id)
  end

  def create_default_reminder
    template = LiquidTemplate.create(
        shop: self,
        body: File.read("#{Rails.root}/db/templates/reminder.liquid"),
        name: 'Booking Reminder',
        category: TemplateCategory::REMINDER,
        channel: TemplateChannel::EMAIL,
        subject: 'Booking Reminder'
    )
    ReminderConfig.create(
        trigger_type: TriggerType::BEFORE_START,
        liquid_template_id: template.id,
        shop: self
    )
  end

  def resync_timezone
    external do
      store = ShopifyAPI::Shop.current
      self.timezone = store.timezone[12..store.timezone.length]
      self.save
    end
  end

  def resync_products
    products.each {|p| p.resync}
  end

  def resync_booking_date_ranges
    bookings.where('events.start > ?', DateTime.now).each do |b|
      minmax = b.booking_items.collect{|bi| [bi.start, bi.finish]}.flatten.minmax
      bookings.find(b.id).sync_booking_dates if minmax[0] != b.start || minmax[1] != b.finish
    end
  end

  def datetime_parser
    DateTimeParser.new(self)
  end

  def lookup_product_availability(start, finish, the_query)
    the_products = products.search_products(the_query)
    # cache key for a shop's products is the count (accounts for inserts/deletes) and updated_at (accounts for changes in capacity)
    product_ids = the_products.map(&:external_id)
    lookup_availability(start,finish, product_ids)
  end

  def lookup_availability(start, finish, product_ids)
    bta_product_ids = products
                      .where(:external_id => product_ids.flatten)
                      .pluck(:id)
    calc = AvailabilityCalculator2.new(self, start, finish, bta_product_ids)
    calc.calculate()

    # cache_key = availability_cache_key(product_ids, start, finish)
    #
    # Rails.cache.fetch(cache_key, :expires_in => Rails.env.production? ? 1.month : 1.minute) do
    #   # new availability calculator uses bta product ids
    #   bta_product_ids = products.where(:external_id => product_ids).pluck(:id)
    #   calc = AvailabilityCalculator2.new(self, start, finish, bta_product_ids)
    #   calc.calculate()
    # end
  end

  # these keys represent anything that can change that would change how availability is calculated - count (accounts for inserts/deletes) and max(updated_at) accounts for edit changes
  def availability_cache_key(product_ids, start, finish)
    products_cache_key = products.where(:external_id => product_ids).pluck_all("COUNT(*)", "MAX(updated_at)").flatten.first.values.map(&:to_i).join('-')
    events_cache_key = events.where(:external_product_id => product_ids + [nil]).pluck_all("COUNT(*)", "MAX(updated_at)").flatten.first.values.map(&:to_i).join('-')
    event_dates_cache_key = event_dates.where(:external_product_id => product_ids + [nil]).where('finish > ? and start < ?', start, finish).pluck_all("COUNT(*)", "MAX(updated_at)").flatten.first.values.map(&:to_i).join('-')
    constraints_cache_key = ResourceConstraint.joins(:resource).where(:resources => {:shop_id => id}).pluck_all("COUNT(*)", "MAX(resource_constraints.updated_at)").flatten.first.values.map(&:to_i).join('-')
    allocations_cache_key = ResourceAllocation.joins(:resource).where(:resources => {:shop_id => id}).pluck_all("COUNT(*)", "MAX(resource_allocations.updated_at)").flatten.first.values.map(&:to_i).join('-')
    cache_key = [self.updated_at, start, finish, product_ids, products_cache_key, events_cache_key, event_dates_cache_key, constraints_cache_key, allocations_cache_key]
  end

  #use this and fix something is mucked up with blank prod ids
  def empty_products_all_blackouts(start, finish)
    newstyle = blackouts.between(start,finish) #
    old = events.old_blackouts(start, finish)
    #does this send double nils? no because each one is different
    newstyle + old
  end

  def generate_shop_calendar_code
    hmac_sha1(subdomain, subdomain + id.to_s)
  end

  def compare_calendar_code(the_code)
    the_code == generate_shop_calendar_code
  end

  def hmac_sha1(data, secret)
    OpenSSL::HMAC.hexdigest(OpenSSL::Digest.new('sha1'), secret.encode("ASCII"), data.encode("ASCII"))
  end

  # product_ids is an array of BTA product ids
  def all_blackouts(start, finish, product_ids = [])
    # TODO: get rid of EventDate
    newstyle = blackouts.includes([:product, :variant]).where('event_dates.finish > ? and event_dates.start < ?', start, finish)
    newstyle = newstyle.where(:product_id => product_ids + [nil]) unless product_ids.empty?

    old = Event.where(:type => "OldBlackout").where(:shop_id => self.id).where('events.finish > ? and events.start < ?', start, finish)
    old = old.includes(:product).where(:product_id => product_ids + [nil]) unless product_ids.empty?

    newstyle.all + old.all
  end

  def has_class_profile_products?
    products.exists?(:profile => 'class')
  end

  def select_date_format
    df = settings.df || 'mm/dd/yy'
    df.sub('mm', '%m').sub('dd', '%d').sub('yy', '%Y')
  end

  def reset_variant_durations
    products.each do |p|
      p.reset_variant_durations
    end
  end

  def external(&block)
    ::NewRelic::Agent.add_custom_attributes(:account => subdomain)
    old_ar_site = ShopifyAPI::Base.site
    begin
      session = ShopifyAPI::Session.new("https://#{subdomain}.myshopify.com", oauth_token)
      ShopifyAPI::Base.activate_session(session)
      block.call(self)
    rescue ActiveResource::UnauthorizedAccess => ua # catches 401 'Unauthorized'
      Rails.logger.warn "Shop #{subdomain} is not authorized: #{ua.inspect}"
      nil
    rescue ActiveResource::ClientError => ce # catches 402 'Payment Required'
      Rails.logger.warn "Shop #{subdomain} is not accessible: #{ce.inspect}"
      nil
    ensure
      ShopifyAPI::Base.site = old_ar_site || nil
    end
  end

  def external_shop
    external do
      Rails.cache.fetch("shops/#{subdomain}", :expires_in => external_cache_expiry_time) {
        begin
          ShopifyAPI::Shop.current
        rescue Errno::ECONNRESET => e # Shopify down
          logger.error "Shopify down: #{subdomain}"
          nil
        rescue ActiveResource::ResourceNotFound
          nil
        end
     }
    end
  end

  def external_product_count
    external do
      Rails.cache.fetch("#{subdomain}/product/count", :expires_in => external_cache_expiry_time) { ShopifyAPI::Product.count() }
    end
  end

  def external_products(page, page_size)
    external do
      Rails.cache.fetch("#{subdomain}/products/page/#{page}", :expires_in => external_cache_expiry_time) {
        ShopifyAPI::Product.find(:all, :params => {:limit => page_size, :page => page})
      }
    end
  end

  def all_external_products()
    external do
      Rails.cache.fetch("#{subdomain}/products", :expires_in => external_cache_expiry_time) {
        products = []
        the_limit = Rails.env.test? ? 6 : 250
        ShopifyAPI::Product.find_each(limit: the_limit) do |product|
          products << product
        end
        products
      }
    end
  end

  def external_product(id)
    external do
      Rails.cache.fetch("#{subdomain}/product/#{id}", :expires_in => external_cache_expiry_time) {
        begin
          ShopifyAPI::Product.find(id)
        rescue ActiveResource::ResourceNotFound
          nil
        end
      }
    end
  end

  def external_product_by_handle(handle)
    external do
      begin
        ShopifyAPI::Product.all(:params => {:handle => handle}).first
      rescue ActiveResource::ResourceNotFound
        nil
      end
    end
  end

  def remove_metafields
    all_external_products.each do |sproduct|
      product = products.find_by_external_id(sproduct.id)
      if product.nil?
        sproduct.metafields.each do |field|
          if field.namespace == "bookthatapp"
            ShopifyAPI::Metafield.delete(field.id)
          end
        end
      end
    end
  end

  def external_order(id)
    raise(ArgumentError, ":id can not be nil") if id.nil?

    external do
      Rails.cache.fetch("#{subdomain}/order/#{id}", :expires_in => external_cache_expiry_time) {
        begin
          ShopifyAPI::Order.find(id)
        rescue ActiveResource::ResourceNotFound
          nil
        end
      }
    end
  end

  # get orders since a certain date. Note: this only gets up to a max of 250 orders.
  def external_orders_since(min_date)
    external do
      ShopifyAPI::Order.find(:all, :params => {:status => 'any', :created_at_min => min_date })
    end
  end

  # import a single order
  def import_order(order_id)
    booking = bookings.where(:order_id => order_id).first
    if booking
      puts "Booking already exists for order #{order_id}: #{booking.id}"
    else
      Delayed::Job.enqueue OrderCreateJob2.new(id, order_id)
    end
  end

  #
  # batch import orders from a start date
  #
  # start is ISO 8601 formatted date (UTC) - e.g. '2016-04-27'
  #
  def import_orders_since(start)
    external do
      query_params = {:created_at_min => start, :status => 'any'}
      Rails.logger.info "#{subdomain}: #{ShopifyAPI::Order.count(:params => query_params)} orders found to import"
      ShopifyAPI::Order.find_each(query_params) do |sorder|
        if bookings.exists?(order_id: sorder.id)
          Rails.logger.info "#{subdomain}: #{sorder.id}/#{sorder.name} booking exists"
        else
          Delayed::Job.enqueue OrderCreateJob2.new(id, sorder.id)
          Rails.logger.info "#{subdomain}: #{sorder.id}/#{sorder.name} import job queued"
        end
      end
    end
  end

  def build_new_product_from_external_id(the_external_id)
    build_new_product_from_external(external_product(the_external_id))
  end

  def build_new_product_from_external(shopify_product)
    if shopify_product
      product = products.build
      product.build_from_external(shopify_product)
      shopify_product_variants = shopify_product.variants
      product.import_variants(shopify_product_variants)
      return product, shopify_product_variants
    end
  end

  def external_variant(id)
    external do
      Rails.cache.fetch("#{subdomain}/variant/#{id}", :expires_in => external_cache_expiry_time) {
        begin
          ShopifyAPI::Variant.find(id)
        rescue ActiveResource::ResourceNotFound
          nil
        end
      }
    end
     # handle_call_to_shopify("variant", ShopifyAPI::Variant)

  end

  def to_liquid
    bta = "//#{subdomain}.bookthatapp#{Rails.env.development? ? '.dev:3002' : '.com'}"
    {
        'subdomain' => subdomain,
        'bookthatapp' => bta
    }
  end

  def get_calendar_show_info
    timeage = DateTime.now
    @bookings =  events.includes([:product]).where("start >= ?", timeage).all
    @orders =  event_dates.includes([:product, :event]).where("start >= ?", timeage).all
    @bookings + @orders
  end

  def product_hash(params, start, finish)
    found, blackouts = lookup_product_availability(start, finish, params["q"])

    result = AvailableFilter2.new(found, blackouts).filter.map do |r|
      products.select{|p| p.external_id == r[:id]}.first
    end.sort!{|a, b| a.product_title.downcase <=> b.product_title.downcase}

    assigns = {
      "shop" => self,
      "products" => result,
      "path" => params[:path_prefix] || '/apps/bookthatapp',
      "form" => {"start" => (start.to_i * 1000), "finish" => (finish.to_i * 1000)}
    }
  end

  def days_since_joining
    (Date.today - created_at.to_date).to_i
  end

  def flipper_id
    subdomain
  end

  def bookings_in_time_range(time_range, time_key)
    bookings.joins(:booking_items).
        where("booking_items.#{time_key} BETWEEN :start AND :finish ", start: time_range.first, finish: time_range.last).
        select('events.*, booking_items.start as item_start, booking_items.finish as item_finish')
  end

private
  def handle_call_to_shopify(type_name, ext_class)
    external do
      begin
        ext_class.find(id)
      rescue ActiveResource::ResourceNotFound
        nil
      end
    end
  end

  def default_settings
    h = Hash.new
    h["wizard"] = "inactive"
    h["quantity_range"] = "no"
    h["message_booked_out"] = "Booked Out"
    h["message_blacked_out"] = "Blacked Out"
    h["message_unscheduled"] = "Unscheduled"
    h["message_unavailable"] = "Unavailable"
    h["message_closed"] = "Closed"
    h["df"] = "mm/dd/yy"
    h["region"] = ""
    h["theme"] = "smoothness"
    self.settings = h
    self.opening_hours= "{\"seasons\":[{\"name\":\"All Year\",\"id\":\"all-year\",\"start\":\"2013-01-01\",\"finish\":\"2013-12-31\",\"days\":[{\"day\":0,\"hours\":[]},{\"day\":1,\"hours\":[{\"from\":{\"hour\":\"9\",\"minute\":\"0\"},\"to\":{\"hour\":\"17\",\"minute\":\"0\"}}]},{\"day\":2,\"hours\":[{\"from\":{\"hour\":\"9\",\"minute\":\"0\"},\"to\":{\"hour\":\"17\",\"minute\":\"0\"}}]},{\"day\":3,\"hours\":[{\"from\":{\"hour\":\"9\",\"minute\":\"0\"},\"to\":{\"hour\":\"17\",\"minute\":\"0\"}}]},{\"day\":4,\"hours\":[{\"from\":{\"hour\":\"9\",\"minute\":\"0\"},\"to\":{\"hour\":\"17\",\"minute\":\"0\"}}]},{\"day\":5,\"hours\":[{\"from\":{\"hour\":\"9\",\"minute\":\"0\"},\"to\":{\"hour\":\"17\",\"minute\":\"0\"}}]},{\"day\":6,\"hours\":[]}]}]}"
  end

  #
  # defer for now. may need for api. see https://labs.kollegorna.se/blog/2015/04/build-an-api-now/
  #
  # def generate_authentication_token
  #   loop do
  #     self.authentication_token = SecureRandom.base64(64)
  #     break unless Shop.find_by(authentication_token: authentication_token)
  #   end
  # end

  def deprecated
    "No Longer exists"
  end

  def external_cache_expiry_time
    Rails.env.development? ? 30.seconds : 10.minutes
  end
end
