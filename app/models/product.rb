class ProductProfiles < Dictionarable
  APPOINTMENT = 'appt'
  CLASS = 'class'
  COURSE = 'course'
  TOUR_ACTIVITY = 'activity'
  PRODUCT = 'product'

  def self.values
    {
        APPOINTMENT => 'Appointment',
        COURSE => 'Course',
        CLASS => 'Class',
        TOUR_ACTIVITY => 'Tour/Activity',
        PRODUCT => 'Product'
    }
  end

end

class Product < ActiveRecord::Base
  # self.inheritance_column = 'profile'
  #
  # scope :appointments, -> { where(profile: 'Appointment') }
  # scope :equipment, -> { where(profile: 'Equipment') }

  acts_as_paranoid

  include IceCube
  include BookThatAppUtils

  #serialize :schedule, Hash

  belongs_to :shop

  validates_presence_of :shop, :external_id, :capacity
  #validates_uniqueness_of :product_handle
  validates :capacity, :numericality => {:greater_than_or_equal_to => 0, :only_integer => true}
  validates :lead_time, :numericality => {:greater_than_or_equal_to => 0}
  validates :min_duration, :numericality => {:greater_than_or_equal_to => 0}
  validates :max_duration, :numericality => {:greater_than_or_equal_to => :min_duration}

  has_many :reservations
  has_many :bookings
  has_many :booking_items, :inverse_of => :product
  has_many :items
  has_many :blackouts, :dependent => :destroy

  has_many :product_locations, :dependent => :destroy
  has_many :locations, :through => :product_locations
  accepts_nested_attributes_for :product_locations, :allow_destroy => true, :reject_if => lambda {|rc| rc[:location_id].blank?}

  has_many :variants, :dependent => :destroy
  accepts_nested_attributes_for :variants, :reject_if => lambda {|a| a[:title].blank?}, :allow_destroy => true

  has_many :option_capacities, :dependent => :destroy
  accepts_nested_attributes_for :option_capacities, :allow_destroy => true

  has_many :resource_constraints, :dependent => :destroy
  has_many :resources, through: :resource_constraints
  accepts_nested_attributes_for :resource_constraints, :allow_destroy => true, :reject_if => lambda {|rc| rc[:resource_id].blank?}

  has_one :schedule, as: :schedulable, :dependent => :destroy
  accepts_nested_attributes_for :schedule, :reject_if => :all_blank, :allow_destroy => true

  has_many :schedule_items, through: :schedule
  accepts_nested_attributes_for :schedule_items, :reject_if => :all_blank, :allow_destroy => true

  has_many :option_durations, :dependent => :destroy
  accepts_nested_attributes_for :option_durations, :reject_if => lambda {|d| d[:low_range] == 0 && d[:high_range] == 0}, :allow_destroy => true

  has_many :terms, :dependent => :destroy
  accepts_nested_attributes_for :terms, reject_if: :all_blank, :allow_destroy => true

  # TODO remove it
  has_many :oneoff_schedules, :dependent => :destroy
  accepts_nested_attributes_for :oneoff_schedules, :allow_destroy => true

  has_many :recurring_schedules, :dependent => :destroy
  accepts_nested_attributes_for :recurring_schedules, :allow_destroy => true


  before_save :check_product_profile
  before_create :default_fields
  before_save :update_duration_options
  after_save :flush_schedule_cache
  after_commit :sync_metafields, :only => [:create, :update]
  after_destroy :remove_metafields
  after_restore :restored

  scope :by_external_ids, lambda {|prod_id, var_id| includes(:variants).where("products.external_id" => prod_id, "variants.external_id" => var_id)}

  def default_fields
    if self.schedule.blank?
      schedule = self.build_schedule
      schedule.recurring_items.new({
        schedule_yaml: IceCube::Schedule.new(Time.now.utc).to_yaml
      })
    end
  end

  def build_from_external(sproduct)
    self.external_id = sproduct.id
    self.product_handle = sproduct.handle
    self.product_title = sproduct.title
    self.product_image_url = sproduct.images.first.src unless sproduct.images.empty?
    self.hidden = sproduct.published_at.nil?
    self.excerpt = sproduct.body_html
    self.capacity_type = 0 # product
    self.capacity = 1
    self.last_sync = Time.now.utc
    self.scheduled = false
    self.profile = 'product'
    self.capacity_option1 = sproduct.options[0].name if sproduct.options[0]
    self.capacity_option2 = sproduct.options[1].name if sproduct.options[1]
    self.capacity_option3 = sproduct.options[2].name if sproduct.options[2]
  end
  #just in case we do use the search method in real search later
  # TODO: Check if this is supposed to return ONE or many, when passing a fixture
  # it is returning many
  def self.search_products(the_query)
    if the_query.present?
      where("product_title like ?", "%#{the_query}%").where(hidden: false)
    else
      self.all
    end
  end

  def ical(start, finish)
    the_event_e = Icalendar::Event.new
    the_event_e.dtstart = Icalendar::Values::DateTime.new(start)
    the_event_e.dtend =  Icalendar::Values::DateTime.new(finish)
    the_event_e.summary = product_title
    the_event_e
  end

  def settings=(options)
    settings_yaml = OpenStruct.new().to_yaml
  end

  def settings
    settings_yaml ? YAML::load(self.settings_yaml) : OpenStruct.new()
  end

  def icecube_schedule
    isc = if schedule.present? && schedule.recurring_items.present?
            schedule.recurring_items.first.icecube_schedule
          end
    isc ||= IceCube::Schedule.new(Date.today.to_time.utc)

    isc
  end

#EventDate count for the start..finish and compare to quantity available.
#  def allowable_dates(start_date, finish_date, the_variant)
    #get from params; sanitize and return bool based on if date_range.present?

    # calculator = shop.availability_calculator(start_date, finish_date, [id])
    # calculator.calculate()
    # capacity = calculator.has_capacity?(the_variant, 1) #quantity to test after
    # errors.add(:product, "over capacity and is booked to capacity on the dates specified.") unless capacity


 # end

  def import_variants(the_variants)
    variants.delete_all
    the_variants.each do |shopify_variant|
      build_variant(shopify_variant)
    end
  end

  def import_variants_no_delete
    shopify_product = external_product
    shopify_product.variants.each do |shopify_variant|
      create_a_variant(shopify_variant)
    end
  end

  def external_product
    shop.external_product(self.external_id)
  end

  # TODO: make this private and incorporate one offs
  def schedule_json
    icecube_schedule.to_json
  end

  #
  # If counting by days (instead of nights) then subtract 1 from the period duration
  #
  def adjust_period_for_range_basis(period_duration)
    if period_duration > 1 && range_count_basis == 1 # count by day
      period_duration - 1
    else
      period_duration
    end
  end

  def metafield_config
    {
        :id => id,
        :lead_time => lead_time,
        :lag_time => lag_time,
        :mindate => mindate,
        :range_min => adjust_period_for_range_basis(min_duration),
        :range_max => adjust_period_for_range_basis(max_duration),
        :count_nights => range_count_basis == 0,
        :capacity_type => capacity_type,
        :duration_type => duration_type,
        :duration => duration,
        :duration_option_position => duration_option_position,
        :duration_option_range_variant => duration_option_range_variant,
        :durations => option_durations.collect {|od| {value: od.value, duration: od.duration, low: od.low_range, high: od.high_range} }.to_json,
        :locations => locations.collect{|location| {id: location.id, name: location.name}}.to_json,
        :resources => resources.collect{|resource| {id: resource.id, name: resource.name}}.to_json
    }.to_query
  end

  def sync_metafields
    return unless self.shop # if shop is being destroyed via uninstall don't sync

    # conditionally updates metafields if something
    # that impacts the config has changed
    attrs = %w(lead_time lag_time mindate min_duration max_duration range_count_basis duration_type duration duration_option_position duration_range)
    if (previous_changes.keys & attrs).any?
      resync_metafields
    elsif (previous_changes.keys & %w(capacity capacity_type)).any?
      resync # also resyncs metafields for each variant
    end

    legacy_sync_metafields
  end

  def legacy_sync_metafields
    # check if earlier version - using config property instead now
    if self.shop.created_at < Time.zone.parse('2013-07-27') # earlier versions
      shop.external do
        product = external_product
        if product
          product.add_metafield(ShopifyAPI::Metafield.new({:namespace => 'bookthatapp', :key => 'product_id', :value => id, :value_type => 'integer'}))
          product.add_metafield(ShopifyAPI::Metafield.new({:namespace => 'bookthatapp', :key => 'lead_time', :value => mindate, :value_type => 'integer'}))
        end
      end
    end
  end

  def resync
    resync_metafields
    resync_variants
  end

  def resync_metafields
    Delayed::Job.enqueue MetafieldConfigJob.new(shop.id, 'products', external_id, metafield_config()), :priority => 10
  end

  def resync_variants
    variants.each do |v|
      v.resync_metafields
    end
  end

  def remove_metafields
    Delayed::Job.enqueue MetafieldConfigDeleteJob.new(shop.id, 'products', external_id), :priority => 10
  end

  def max_duration_minutes
    max = 0
    variants_including_deleted.each do |v|
      max = v.duration_minutes if v.duration_minutes > max
    end
    max
  end

  def matching_variants(oc)
    variants_including_deleted.select do |variant|
      matches(variant, oc)
    end
  end

  def matching_option_capacity(variant)
    oc = option_capacities.select do |oc|
      matches(variant, oc)
    end
    oc.first unless oc.empty?
  end

  def matches(variant, oc)
    result = !oc.option1.nil?
    result = result && oc.option1 == variant.option1 unless capacity_option1.nil?
    result = result && oc.option2 == variant.option2 unless capacity_option2.nil?
    result = result && oc.option3 == variant.option3 unless capacity_option3.nil?
    #logger.info "matching variant [#{variant.option1}/#{variant.option2}/#{variant.option3}] against oc [#{oc.option1}/#{oc.option2}/#{oc.option3}]: #{result}"
    result
  end

  def capacities
    if capacity_type == 0
      capacity.to_s
    else
      max = 0
      min = 9999
      option_capacities.each do |oc|
        max = (oc.capacity > max) ? oc.capacity : max
        min = (oc.capacity < min) ? oc.capacity : min
      end

      if max == min
        max.to_s
      else
        "#{min} - #{max}"
      end
    end
  end

  def create_a_variant(shopify_variant)
    dtitle = shopify_variant.title.gsub('-', ' ')
    variants.create({
      :external_id => shopify_variant.id,
      :title => shopify_variant.title,
      :price => shopify_variant.price,
      :compare_at_price => shopify_variant.compare_at_price,
      :sku => shopify_variant.sku,
      :option1 => shopify_variant.option1,
      :option2 => shopify_variant.option2,
      :option3 => shopify_variant.option3,
      :duration_units => derive_duration_units(dtitle),
      :duration => derive_duration(dtitle) || 1,
      :all_day => 0,
      :start_time => Time.now.utc.change({:hour => 9}),
      :finish_time => Time.now.utc.change({:hour => 17}),
      :party_size => 1,
      :last_sync => Time.now.utc
    }) if shopify_variant
  end

  def build_variant(shopify_variant)
    dtitle = shopify_variant.title.gsub('-', ' ')
    variants.build({
      :external_id => shopify_variant.id,
      :title => shopify_variant.title,
      :price => shopify_variant.price,
      :compare_at_price => shopify_variant.compare_at_price,
      :sku => shopify_variant.sku,
      :option1 => shopify_variant.option1,
      :option2 => shopify_variant.option2,
      :option3 => shopify_variant.option3,
      :duration_units => derive_duration_units(dtitle),
      :duration => derive_duration(dtitle) || 1,
      :all_day => 0,
      :start_time => Time.now.utc.change({:hour => 9}),
      :finish_time => Time.now.utc.change({:hour => 17}),
      :party_size => 1,
      :last_sync => Time.now.utc
    }) if shopify_variant
  end

  def variants_including_deleted
    variants.with_deleted
  end

  def price_range
    prices = variants_including_deleted.collect(&:price).collect(&:to_f)
    format =  "%0.2f"
    if prices.min != prices.max
      "#{format % prices.min} - #{format % prices.max}"
    else
      format % prices.min
    end
  end

  def price_min
    variant = variants_including_deleted.min_by {|v| v.price.nil? ? 0 : v.price}
    if variant && variant.price
      (variant.price * 100).round
    else
      0.0
    end
  end

  def price_max
    variant = variants_including_deleted.max_by {|v| v.price.nil? ? 0 : v.price}
    if variant && variant.price
      (variant.price * 100).round
    else
      0.0
    end
  end

  def image_url
    if product_image_url.nil?
      ""
    else
      file = product_image_url.split('/').last
      if file
        url = file.split('?').first
        "/products/#{url}"
      else
        ""
      end
    end
  end

  def gather_resource_schedule_dates(the_blackouts, info_hash)
    # get all resources and their schedules
    all_schedules_from_all_resources(info_hash) # you should return empty array too, dang it.
    #possibly iterate through them
  end

  def all_schedules_from_all_resources(info_hash)
    resources.all_schedules_between(info_hash[:start], info_hash[:finish], info_hash)
  end

  # def cached_scheduled_occurrences(start, finish)
  #   key = "/products/#{id}/schedule/#{start.to_i}:#{finish.to_i}"
  #   occurrences = Rails.cache.fetch(key, :expires_in => 1.month, :compress => true) do
  #     scheduled_occurrences(start, finish)
  #   end
  #   occurrences
  # end

  def flush_schedule_cache
    shop.notifier("Product Updated: #{product_title.present? ? product_title : id}", {:actionable => false, :noteable_id => id, :noteable_type => "Product"})
    if (['schedule_yaml'] & changed).any?
      # delete any cached schedules for this product
      Rails.cache.delete_matched("/products/#{id}/schedule")
    end
  end

  def reset_variant_durations
    variants.each do |v|
      title = v.title.gsub('-', ' ')
      duration = derive_duration(title)
      if duration
        v.duration = duration
        v.duration_units = derive_duration_units(title)
        v.save
      end
    end
  end

  def to_liquid
    {
        'id'                      => external_id,
        'title'                   => product_title,
        'handle'                  => product_handle,
        'type'                    => type,
        'price'                   => price_range,
        'price_min'               => price_min,
        'price_max'               => price_max,
        'url'                     => "/products/#{product_handle}",
        'location'                => locations.first, # <= should be removed but existing templates are using it
        'locations'               => locations,
        'images'                  => [image_url],
        'featured_image'          => image_url
    }
  end

  def add_adhoc_occurrence(occurrence)
    schedule.oneoff_items.build({:start => occurrence})
  end

  def previous_product
    self.class.where("shop_id = ? AND product_title < ?", shop.id, product_title).order("product_title desc").first
  end

  def next_product
    self.class.where("shop_id = ? AND product_title > ?", shop.id, product_title).order("product_title asc").first
  end

  def duration_calculator
    @duration_calculator ||= DurationCalculator.new(self)
  end

  def calendar_properties
    {
        handle: product_handle,
        title: product_title,
        capacity: capacity,
        image: product_image_url,
        backgroundColor: background_color,
        borderColor: border_color,
        textColor: text_color,
        locations: locations.as_json(only: [:id, :name]),
        resources: resources.as_json(only: [:id, :name])
    }
  end

  def calendar_resource_id
    "P#{id}:L"
  end

  def default_times
    case self.profile
      when ProductProfiles::APPOINTMENT
        begin
          opening_hours = JSON.parse(shop.opening_hours)
          season = opening_hours['seasons'].find{|s| s['start'].to_date <= Time.now && s['finish'].to_date >= Time.now} if opening_hours['seasons'].present?
          if season.present?

            wday = Time.now.wday
            while (time = season['days'][wday]['hours']).blank?
              wday += 1
            end
            start, finish = '', ''
            if time.present?
              start = Time.now.change(hour: time.first['from']['hour'], min: time.first['from']['minute']).strftime("%Y-%m-%d %H:%M")
              finish = Time.now.change(hour: time.first['to']['hour'], min: time.first['to']['minute']).strftime("%Y-%m-%d %H:%M")
            end
          end
          { start: start, finish: finish, available: [] }
        rescue Exception
          { start: nil, finish: nil, available: [] }
        end
      else
        { start: nil, finish: nil, available: [] }
    end
  end

  private
  def restored
    Product.reset_counters(id, :variants)
    resync
  end

  def derive_duration(title)
    title.split.each do |dur|
      return dur.to_i if dur !~ /\D/
    end
    nil
  end

  def derive_duration_units(title)
    title.match(/minute/i) ? 0 : title.match(/hour/i) ? 1 : title.match(/week/i) ? 3 : title.match(/month/i) ? 4 : 2
  end

  # returns true if a product is booked out (or blacked out) between 2 dates
  def booked_out?(start, finish)
    # find bookings and blackouts for this date range
    blackouts = shop.all_blackouts(start, finish, [self.id])
    bookings = BookingItem.where('shop_id = ? and finish > ? and start < ? and product_id = ?', shop.id, start, finish, self.id)

    return false if products.empty? && blackouts.empty? # no bookings or blackouts found so it must be available

    # find out if it is booked or blacked out for any day in the date range
    start.step(finish, 1).each do |date|
      # any blackouts in effect?
      return true if blackouts.select{|b| b.overlaps?(date.begining_of_day, date.end_of_day)}

      # reference product hash
      ph = products.first
      bookings = ph[:bookings]

      # sum quantity
      total = bookings.inject(0){|sum, booking| sum + booking[:quantity]}

      # it is booked out if total is more than capacity
      total >= capacity
    end
  end

  def external
    shop.external_product external_id
  end

  def update_duration_options
    if changes.include?('duration_option')
      option_durations.where('option_external_id != ?', duration_option_external_id).destroy_all
    end
  end

  def check_product_profile
    if self.profile == ProductProfiles::COURSE

    end
  end



  def shopify_url
    "http://#{shop.subdomain}.myshopify.com/products/#{product_handle}"
  end

end
