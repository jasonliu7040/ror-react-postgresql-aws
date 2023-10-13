class Api::V1::AvailabilityController < Api::V1::BaseController
  def index
    Rails.logger.info params.inspect
    checker = AvailabilityChecker.new(@shop, Cart.new(params))
    render(json: ActiveModel::ArraySerializer.new(checker.check_availability))
  end
end

class Availability
  include Virtus.model
  attribute :variant_id, Integer
  attribute :code, Integer
  attribute :message, String
  attribute :available, Integer, default: 0
end

class AvailabilityChecker
  def initialize(shop, cart)
    @shop = shop
    @cart = cart
  end

  def check_availability
    results = []

    @cart.items.each do |item|
      external_id = item[:variant_id]
      variant = Variant.find_by_external_id(external_id)
      next unless variant

      properties = map_properties(item)
      dtp = @shop.datetime_parser
      start, finish = dtp.parse_datetimes(properties, variant)

      # blacked out?
      if blacked_out?(variant, start, finish)
        results << Availability.new({variant_id: external_id, code: 100, message: 'Blackout in effect'})
        next
      end

      # booked out?
      available = variant.capacity - booking_count(variant, start, finish)
      if available <= 0
        results << Availability.new({variant_id: external_id, code: 110, message: 'Fully booked'})
        next
      end

      results << Availability.new({variant_id: external_id, code: 0, message: 'Available', available: available})
    end

    results
  end

  def blacked_out?(variant, start, finish)
    @shop.blackouts.overlapping(start, finish).any? do |blackout|
      blackout.product_id == nil || blackout.product_id == variant.product_id && blackout.variant_id.nil? || blackout.variant_id == variant.id
    end
  end

  def booking_count(variant, start, finish)
    @shop.booking_items.where(variant_id: variant.id).overlapping(start, finish).sum(:quantity)
  end

  def map_properties(item)
    result = []

    (item[:properties] + @cart[:cart_attributes]).each do |prop|
      # converts HashWithIndifferentAccess to key/value pair structure
      result << Property.new(name: prop.keys.first, value: prop.values.first)
    end

    result
  end
end

class CartItem
  include Virtus.model
  attribute :id, Integer
  attribute :properties, Array[Hash[Symbol => String]]
  attribute :quantity, Integer
  attribute :variant_id, Integer
end

class Cart
  include Virtus.model
  attribute :token, String
  attribute :note, String
  attribute :cart_attributes, Array[Hash[Symbol => String]]
  attribute :items, Array[CartItem]
end

class Property
  include Virtus.model
  attribute :name, String
  attribute :value, String
end
