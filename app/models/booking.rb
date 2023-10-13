require 'icalendar/tzinfo'

include BookThatAppUtils
class Booking < Event
  include Reminderable
  belongs_to :shop, counter_cache: true

  # allow for comma separated list of email addresses
  validates :email,
            :format => { :with => /(\A([\w\.%\+\-]+)@([\w\-]+\.)+([\w]{2,})(,\s*([\w\.%\+\-]+)@([\w\-]+\.)+([\w]{2,}))*\z)/i },
            :allow_blank => true

  # booking_items - one per variant
  has_many :booking_items, :autosave => true, :inverse_of => :booking, :dependent => :destroy do
    def build(*args)
      item = super
      item.shop = proxy_association.owner.shop
      item
    end
  end
  accepts_nested_attributes_for :booking_items, reject_if: lambda {|attributes| attributes['product_id'].blank?}, :allow_destroy => true
  validate :must_have_booking_items, :unless => Proc.new {|b| b.status == BookingStatus::INCOMPLETE }

  has_many :products, through: :booking_items # new code
  has_many :resources, through: :booking_items
  has_many :locations, through: :booking_items

  has_many :booking_names, :dependent => :destroy, :inverse_of => :booking
  accepts_nested_attributes_for :booking_names, :reject_if => lambda {|attributes| attributes['name'].blank?}, :allow_destroy => true

  has_many :email_events, inverse_of: :booking, dependent: :destroy

  # scope :most_recent, -> (limit) { order("created_at desc").limit(limit) }
  scope :incomplete, -> { where(:status => BookingStatus::INCOMPLETE) }
  scope :active, -> { where("status != ?", BookingStatus::INCOMPLETE) }
  scope :count_by_month, -> (date){ where('created_at >=? AND created_at <=?', date, Time.now).
        select('count(*) cnt, DATE_FORMAT(created_at, "%Y-%m-01") as beginning_of_month').
        group('beginning_of_month').order('beginning_of_month desc')
  }

  before_create :default_finish_date, :create_default_booking_name
  before_save :format_order_name, :sync_booking_name, :lookup_order_id, :save_product_summary
  after_create :send_shop_note_if_incomplete
  before_update :convert_from_incomplete

  attr_accessor :line_item_number

  # def must_have_booking_names
  #   errors.add(:base, 'Must have at least one person') if booking_names.all?(&:marked_for_destruction?)
  # end

  def must_have_booking_items
    # http://stackoverflow.com/questions/5144527/nested-models-and-parent-validation
    if booking_items.empty? or booking_items.all? {|bi| bi.marked_for_destruction? }
      errors.add(:base, 'Must have at least one booking item')
    end
  end

  def ical
    cal = Icalendar::Calendar.new

    as_tz = ActiveSupport::TimeZone.new(shop.timezone)
    tzinfo = as_tz.tzinfo
    # timezone = tzinfo.ical_timezone start
    # cal.add_timezone timezone

    event = cal.event do |e|
      e.dtstart = ical_date(start, tzinfo.identifier)
      e.dtend = ical_date(finish, tzinfo.identifier)
      e.summary = product_summary
      e.uid = "BTA-BOOKING-#{id}"

      # RB 2145: make sure shop still exists
      external_shop = shop.external_shop
      if external_shop
        customer_email = external_shop.customer_email
        e.organizer = Icalendar::Values::CalAddress.new("mailto:#{customer_email}", cn:"#{external_shop.name}") if customer_email
      end

      if locations.size == 1
        location = locations.first
        e.location = location.address
      end
    end

    event
  end

  def ical_date(dt, tzid)
    # all_day? ? Icalendar::Values::Date.new(dt, tzid: tzid) : Icalendar::Values::DateTime.new(dt, tzid: tzid)
    all_day? ? Icalendar::Values::Date.new(dt) : Icalendar::Values::DateTime.new(dt)
  end

  def store_owner_ical
    event = ical

    description = ''
    unless booking_names.empty?
      description += 'Booking for:'
      booking_names.each do |customer|
        description += "\n#{customer.name}"
      end
    end

    description += "\n\nNotes:\n#{self.notes}" unless notes.blank?

    event.description = description

    event
  end

  # check for blackouts
  def blacked_out?
    # blackouts = Blackout.where("((start between :start and :finish) or (finish between :start and :finish)) and shop_id=:shop and (product_id is null or product_id=:product)", {:start => start, :finish => finish, :shop => shop.id, :product => product.id})
    # blackouts.size > 0
  end

  def is_active?
    status != BookingStatus::INCOMPLETE
  end

  def send_shop_note_if_incomplete
    if self.status == BookingStatus::INCOMPLETE
      shop.notifier("START DATE NEEDED", {:actionable => true, :noteable_id => self.id, :noteable_type => "Event"})
    else
      # the_message = "[#{shop.subdomain}/orders/#{order_id}/#{line_item_number}] Booking (#{id}) created: '#{product.product_handle} - #{variant.title}' (#{product.external_id}/#{variant.external_id})"
      # the_message += " @ #{start.iso8601} - #{finish.iso8601}" if start.present?
      # Rails.logger.info the_message
      # shop.notifier(the_message, {:actionable => false})
    end
  end

  def format_order_name
    self.order_name = add_pound_sign_or_return_blank(self.order_name)
  end

  # provide a default first booking_name based on booking contact name
  def create_default_booking_name
    booking_names.build({
      :name => name.titleize,
      :email => email
    }) if booking_names.empty? && name.present?
  end

  def sync_booking_name
    if changed.include? "name"
      booking_names.select { |contact| contact.name == name_was }.each do |contact|
        contact.name = name
        contact.save
      end
    end
  end

  def save_product_summary
    item = self.booking_items.first
    if item
      unless item.product.nil? or item.variant.nil?
        title = "#{item.product.product_title}"
        title += "/#{item.variant.title}" unless item.variant.title.downcase == 'default title'

        if self.booking_items_count > 1
          title += " (+ #{self.booking_items_count - 1} more)"
        end
      else
        title = '<Product or variant not found>'
      end
    end
    self.product_summary = title
  end

  #idea is that we have a booking and don't know the real financial status. Rather than a state that will always be active 95% of the time, we just go out and get the financial_status of that order again.
  def convert_from_incomplete
    if self.status == BookingStatus::INCOMPLETE
      if changed.include? "start" #had this on two lines kicked false...
        if changes["start"][1].present?
          the_order = self.shop.external_order(self.order_id)
          self.status = BookingStatus::status(the_order.financial_status) if the_order.present?
        end
      end
    end
  end

  def product_title
    item = self.booking_items.first
    if item
      unless item.product.nil? or item.variant.nil?
        title = "#{item.product.product_title}"
        title += "/#{item.variant.title}" unless item.variant.title.downcase == 'default title'

        if self.booking_items_count > 1
          title += " (+ #{self.booking_items_count - 1} more)"
        end

        title
      else
        '<Product or variant not found>'
      end
    end
  end

  def datetime_range
    booking_items.collect{|bi| [bi.start, bi.finish]}.flatten.minmax
  end

  def sync_booking_dates
    range = datetime_range

    if (start != range.first) || (finish != range.last)
      update_attribute(:start, range.first)
      update_attribute(:finish, range.last)
    end
  end

  # shop.bookings.where(booking_items_count: 0).where('status != 5 and start is not null and finish is not null').each{|b|b.convert_booking_item}
  def convert_booking_item
    if booking_items.empty? && status != BookingStatus::INCOMPLETE
      # take care of deleted products and variants
      product = Product.with_deleted.find(product_id) if product.nil?
      variant = Variant.with_deleted.find(variant_id) if variant.nil?
      finish = self.finish.advance(:minutes => -1 * product.lag_time) # lag time already added so remove it and booking_item callback will add it again

      item = booking_items.build({:shop => shop, :start => start, :finish => finish, :product => product, :variant => variant, :quantity => number_in_party})

      if item.save(:validate => false)
        return item
      end
    end
    nil
  end

  def previous_booking
    self.class.where("shop_id = ? AND start < ?", shop.id, start).order("start desc").first
  end

  def next_booking
    self.class.where("shop_id = ? AND start > ?", shop.id, start).order("start asc").first
  end

  def render_ticket
    shop.template('ticket').render({'shop' => shop.external_shop, 'booking' => self})
  end

  def lookup_order_id
    if order_name.present? && order_id.blank?
      shop.external do
        search = ShopifyAPI::Order.find(:all, :params => { :name => "#{order_name}" })
        self.order_id = search.first.id if search.any?
      end
    end
  end

  # get the order this booking corresponds to
  def external_order
    shop.external_order(order_id)
  end

  def to_liquid
    {
        'id' => id,
        'name' => name,
        'order_name' => order_name,
        'contact_phone' => phone,
        'contact_email' => email,
        'start' => start,
        'finish' => finish,
        'hotel' => hotel,
        'items' => booking_items.map(&:to_liquid),
        'contacts' => booking_names.map(&:to_liquid),
        'ticket_url' => "http://#{shop.subdomain}.#{DOMAIN}/bookings/#{id}/ticket.pdf",
        'notes' => notes,
        'product' => booking_items.first.product, # legacy
        'variant' => booking_items.first.variant, # legacy
        'party_size' => booking_items.first.quantity, # legacy
        'sku' => booking_items.first.sku, # legacy
        'email' => email, # legacy
        'end' => finish, # legacy
        'location_emails' => location_emails
    }
  end

  def to_calendar_hash
    bi = booking_items.first

    result = {
        :id => "booking-#{self.id}",
        :event_type => "booking",
        :status => status,
        :product_id => bi.product_id,
        :start => datetime_array(start),
        :end => datetime_array(finish),
        :all_day => all_day,
        :title => product_title,
        :order_id => order_id,
        :name => name,
        :email => email,
        :numberInParty => bi.quantity,
        :className => status == BookingStatus::CONFIRMED ? 'booking-confirmed' : 'booking-pending'
    }

    result[:order_name] = order_name if order_name

    product = bi.product
    if product
      result[:backgroundColor] = product.background_color
      result[:borderColor] = product.border_color
      result[:textColor] = product.text_color
    end

    result
  end

  def location_emails
    locations.map(&:email).compact.reject{|email| email.empty?}.uniq
  end

end
