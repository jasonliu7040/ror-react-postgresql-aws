class BookingItemSerializer < ActiveModel::Serializer
  attributes :id, :shop_id, :booking_id, :start, :finish, :quantity, :product_id, :variant_id, :location_id, :resource_allocations,
             :variants, :locations, :resources

  def start
    format_datetime(object.start)
  end

  def finish
    format_datetime(object.finish)
  end

  def resource_allocations
    object.resource_allocations.empty? ? { id: nil, resource_id: nil } : { id: object.resource_allocations.first.id, resource_id: object.resource_allocations.first.resource_id }
  end

  def format_datetime(dt)
    dt.strftime("%Y-%m-%d %H:%M")
  end

  def variants
    object.product.variants.with_deleted.collect{ |v| v.as_json(:only => [:id, :external_id, :title, :all_day], :methods => [:metafield_config, :hidden]) }
  end

  def resources
    object.product.resources.collect { |r| r.as_json(:only => [:id, :name]) }
  end

  def locations
    object.product.locations.collect { |l| l.as_json(:only => [:id, :name]) }
  end

end
