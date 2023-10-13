class BookingItem < ActiveRecord::Base
  include BookThatAppUtils
  include Interval

  belongs_to :shop # de-normalized - could go via booking but this lets us query without having to join on the booking table
  belongs_to :booking, :inverse_of => :booking_items, :counter_cache => true, :touch => true # touch to update booking updated_at which is used as cache key and sync dates
  belongs_to :product, -> { with_deleted }, inverse_of: :booking_items, counter_cache: true
  belongs_to :variant, -> { with_deleted }, inverse_of: :booking_items, counter_cache: true
  belongs_to :location, inverse_of: :booking_items
  has_many :resource_allocations, :dependent => :destroy
  has_many :resources, through: :resource_allocations
  accepts_nested_attributes_for :resource_allocations, :allow_destroy => true, :reject_if => :all_blank
  accepts_nested_attributes_for :resources

  validates_presence_of [:shop, :start, :finish, :product, :variant, :quantity]
  # validates_uniqueness_of [:product, :variant, :start], :scope => :booking_id # generating NoMethodError (undefined method `text?' for nil:NilClass)
  validates :quantity, :numericality => {:greater_than => 0}

  before_validation :swap_dates
  before_create :add_lag
  before_save :capture_product_properties, :adjust_all_day
  after_commit :sync_booking_dates, :if => :persisted?

  def swap_dates
    if self.start && self.finish
      self.start, self.finish = self.finish, self.start if self.start > self.finish
    end
  end

  def add_lag
    lag_time = product.lag_time
    if lag_time
      self.finish = self.finish.advance(minutes: lag_time)
      self.lag_added = lag_time # keeps track of what the lag_time was when the booking was created
    else
      self.lag_added = 0
    end
  end

  def capture_product_properties
    # external ids are stored on this model to make queries faster (i.e they are denormalized)
    self.external_product_id = product.external_id
    self.external_variant_id = variant.external_id
    self.sku = self.variant.sku
    self.price = self.variant.price
  end

  def adjust_all_day
    if self.variant.all_day?
      self.start = self.start.beginning_of_day
      self.finish = self.finish.end_of_day
    end
  end

  def to_liquid
    {
        'id' => id,
        'start' => start,
        'finish' => finish,
        'product' => product,
        'variant' => variant,
        'quantity' => quantity,
        'sku' => sku,
        'location' => location,
        'resources' => resources.map(&:to_liquid)
    }
  end

  # override getter methods for access to soft deleted paranoia attributes (https://github.com/radar/paranoia/issues/109)
  def product
    Product.unscoped { super }
  end

  def variant
    Variant.unscoped { super }
  end

  def sync_booking_dates
    if (previous_changes.keys & ['start', 'finish']).any?
      booking.sync_booking_dates
    end
  end

  def to_calendar_hash
    result = {
        :id => "booking-item-#{id}",
        :url => "/bookings/#{booking.id}/edit",
        :event_type => "booking-item",
        :status => booking.status,
        :product_id => product_id,
        :start => datetime_array(start),
        :end => datetime_array(finish),
        :all_day => variant.all_day?,
        :title => "#{product.product_title}/#{variant.title}",
        :order_id => booking.order_id,
        :name => booking.name,
        :email => booking.email,
        :quantity => quantity,
        :resource_id => calendar_resource_id,
        :className => booking.status == BookingStatus::CONFIRMED ? 'booking-confirmed' : 'booking-pending'
    }

    result[:order_name] = booking.order_name if booking.order_name
    result[:backgroundColor] = product.background_color
    result[:borderColor] = product.border_color
    result[:textColor] = product.text_color

    result
  end

  def calendar_resource_id
    "P#{product_id}:L#{location_id}"
  end
end
