class Variant < ActiveRecord::Base
  acts_as_paranoid

  include BookThatAppUtils
  include ShopifyAPI::PriceConversion
  include IceCube

  belongs_to :product, -> { with_deleted }, counter_cache: true, touch: true

  has_many :bookings
  has_many :booking_items, :inverse_of => :variant
  has_many :items
  has_many :oneoff_schedules, :dependent => :destroy
  has_many :blackouts, :dependent => :destroy

  validates_presence_of :duration, :duration_units unless lambda { |v| $flipper[:duration_v2].enabled?(current_account) }
  validates :duration, :party_size, :numericality => true unless lambda { |v| $flipper[:duration_v2].enabled?(current_account) }

  after_commit :sync_metafields, :only => [:create, :update]
  after_destroy :remove_metafields

  alias_attribute :unit_multiplier, :party_size
  attr_accessor :schedule

  def initialize(args = {}, options = {})
    if args[:settings_yaml].blank?
      super(args)
    else
      s = IceCube::Schedule.from_yaml(args[:settings_yaml])
      super({:settings_yaml => s.to_yaml}.merge(args))
    end
  end

  def schedule_json
    schedule.to_json
  end

  def schedule
    unless settings_yaml.blank?
      begin
        IceCube::Schedule.from_yaml(settings_yaml)
      rescue Exception => e
        logger.error "Error loading schedule yaml: #{self.settings_yaml}"
        logger.error e.message + "\n " + e.backtrace.join("\n ")
        IceCube::Schedule.new(Time.now.utc)
      end
    else
      IceCube::Schedule.new(Time.now.utc)
    end
  end

  def advance_default_duration(start)
    mins = duration_minutes

    if all_day == 1
      days = mins.div(1440)
      days -= 1 if product.range_count_basis == 1 # count days

      advanced = start.advance(:days => days).end_of_day
    else
      advanced = start.advance(:minutes => mins)
    end

    advanced
  end

  def duration_minutes
    duration_calculator.duration_minutes(self)
  end

  def duration_seconds
    duration_calculator.duration(self)
  end

  def duration_calculator
    product.duration_calculator
  end

  def capacity
    if product # may have been deleted in which case this is nil. once rails 4.x can use :with_deleted on belongs_to
      if product.capacity_type == 0
        product.capacity
      else
        oc = option_capacity
        if oc
          oc.capacity
        else
          0
        end
      end
    else
      0
    end
  end

  def option_capacity
    product.matching_option_capacity(self)
  end
  #TODO: pretty sure we don't need shop id here.
  # if we do, pull it from even getting here without the valid shop id in the first place.
  def variant_bookings(start, finish)
    if product.capacity_type == 0
      product.bookings.active.select{|booking| booking.overlaps?(start, finish)}
    else
      bookings.active.select{|booking| booking.overlaps?(start, finish)}
    end
  end

  def booking_count(start, finish)
    variant_bookings(start, finish).inject(0){|sum, booking| sum + booking.number_in_party}
  end

  def shop
    product.shop
  end

  def metafield_config
    dc = product.duration_calculator

    {
        :id => id,
        :start_time => start_time.to_i,
        :finish_time => finish_time.to_i,
        :duration => dc.duration_minutes(self),
        :capacity => capacity,
        :ignored => ignore,
        :units => unit_multiplier
    }.to_query
  end

  def sync_metafields
    # update metafields only if there is a change that impacts them
    attrs = ["start_time", "finish_time", "duration", "duration_units", "capacity", "ignore", "party_size"]
    if (previous_changes.keys & attrs).any?
      logger.info "[#{self.shop.subdomain}/products/#{self.product.external_id}/variants/#{self.external_id}] Scheduled variant metafields sync"
      resync_metafields
    end
  end

  def resync_metafields
    Delayed::Job.enqueue MetafieldConfigJob.new(shop.id, "variants", external_id, metafield_config()), :priority => 10

    # check if earlier version - using config property instead now
    if shop.created_at < Time.zone.parse("2013-09-28")
      Delayed::Job.enqueue VariantLegacyMetafieldSyncJob.new(shop.id, id, external_id), :priority => 10
    end
  end

  def remove_metafields
    # variants are currently only destroyed via ProductSyncJob when a variant is removed in the shop so there is no need
    # to remove the metafields. I'll leave these lines commented out as a reminder for when you can delete variants on
    # the BTA side.
    # Delayed::Job.enqueue MetafieldConfigDeleteJob.new(shop.id, 'variants', external_id), :priority => 10
    # logger.info "[#{shop.subdomain}/products/#{product.external_id}/variants/#{external_id}] Scheduled variant metafield config deletion"
  end

  def external_variant
    product.shop.external_variant(self.external_id)
  end

  def hidden
    self.deleted?
  end

  def to_liquid
    the_price = price.nil? ? 0.0 : (price * 100).round
    the_compare = compare_at_price.nil? ? 0.0 : (compare_at_price * 100).round
    {
        'id'                 => external_id,
        'title'              => title,
        'option1'            => option1,
        'option2'            => option2,
        'option3'            => option3,
        'price'              => the_price,
        'compare_at_price'   => the_compare,
        'sku'                => sku
    }
  end
end
