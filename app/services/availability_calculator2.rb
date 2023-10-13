require 'new_relic/agent/method_tracer'

class AvailabilityCalculator2
  include BookThatAppUtils

  attr_reader :products, :blackouts, :calculated

  def initialize(shop, start, finish, bta_product_ids = [])
    raise Exception.new('Nil shop') if shop.nil?
    raise Exception.new('Nil start date') if start.nil?
    raise Exception.new('Nil finish date') if finish.nil?

    @shop = shop
    @product_ids = bta_product_ids
    @start = start
    @finish = finish
    @calculated = false
  end

  def calculate
    # gather model for all product ids
    @booking_items = lookup_booking_items
    @capacities = lookup_capacities
    @products = lookup_products
    @schedules = lookup_schedules
    @variants = lookup_variants
    @resource_constraints = lookup_resource_constraints
    @product_resources = lookup_product_resources

    # map results for each product
    products = @products.map do |product|
      {
        :id => product.external_id,
        :handle => product.product_handle,
        :title => product.product_title,
        :capacity => product.capacity,
        :capacity_type => product.capacity_type,
        :variant_capacities => map_capacities(product),
        :option_capacities => map_options(product),
        :variants => map_variants(product),
        :scheduled => product.scheduled,
        :schedule => map_schedule(product),
        :bookings => map_booking_items(product),
        :lag => product.lag_time,
        :resources => map_resources(product)
      }
    end

    blackouts = lookup_blackouts.map do |blackout|
      {
          :start => datetime_array(blackout.start),
          :end => datetime_array(blackout.finish),
          :all_day => blackout.all_day,
          :handle => blackout.product.nil? ? "" : blackout.product.product_handle,
          :variantId => blackout.variant.nil? ? "" : blackout.variant.external_id
      }
    end

    resource_allocations = lookup_resource_allocations.map do |allocation|
      {
          :resource => allocation.resource_id,
          :product => allocation.booking_item.external_product_id,
          :variant => allocation.booking_item.external_variant_id,
          :start => datetime_array(allocation.booking_item.start),
          :end => datetime_array(allocation.booking_item.finish),
          :buid => allocation.booking_item.id
      }
    end

    @calculated = true

    return products, blackouts, resource_allocations
  end

  def has_capacity?(variant, quantity)
    raise raise(RuntimeError, "AvailabilityCalculator::calculate must be invoked before AvailabilityCalculator::has_capacity? can be called", caller) if @calculated == false

    # grab existing booking items for the product
    items = @booking_items[variant.product_id] || []

    # filter by variant if capacity type is based on variants
    product = variant.product
    product = Product.with_deleted.find(variant.product_id) if product.nil? # in case product was deleted

    if product.capacity_type == 1
      items = items.select{|item| item.variant.id == variant.id}
    end

    # determine capacity
    capacity = product.capacity # default to product based capacity

    if product.capacity_type == 1 # variant based availability
      product_option_capacities = @capacities[variant.product_id] || [] # grab option capcities configured for this product

      # filter for this variant
      variant_capacity = product_option_capacities.select {|oc| oc.matches?(variant)}
      if variant_capacity.present?
        oc = variant_capacity.first
        capacity = oc.capacity unless oc.nil?
      else
        Rails.logger.warn "Could not find a matching option capacity for variant: #{variant.id}"
      end
    end

    booking_count = items.inject(0) {|sum, item| sum + item.quantity}

    (booking_count + quantity) <= capacity
  end

  protected
  def lookup_booking_items
    query = BookingItem.where('shop_id = ? and finish > ? and start < ?', @shop.id, @start, @finish)

    # also filter by external product id if provided
    unless @product_ids.empty?
      query = query.where('product_id IN (?)', @product_ids)
    end

    query.group_by {|item| item.product_id }
  end

  def lookup_capacities
    # query = OptionCapacity.joins(:product).where('products.shop_id = ? and products.id IN (?)', @shop.id, @product_ids)
    query = OptionCapacity.where(:product_id => @product_ids)
    # puts query.to_sql
    query.group_by {|oc| oc.product_id}
  end

  def lookup_products
    Product.includes([:variants]).where(:shop_id => @shop.id, :id => @product_ids).all
  end

  def lookup_blackouts
    if @product_ids.empty?
      Blackout.includes([:product, :variant]).where(['shop_id = ? and (finish > ? and start < ?)', @shop.id, @start, @finish])
    else
      @shop.all_blackouts(@start, @finish, @product_ids)
    end
  end

  def lookup_schedules
    OneoffSchedule.for_products(@product_ids).where({:start => @start..@finish}).select([ 'schedules.schedulable_id as product_id', 'schedule_items.id as id', :start, :duration]).group_by { |s| s.product_id }
  end

  def lookup_variants
    @shop.variants.where({:product_id => @product_ids}).group_by {|v| v.product_id}
  end

  # find in scope constraints (filtered by products if any)
  def lookup_resource_constraints
    query = ResourceConstraint.joins(:resource).where(:resources => {:shop_id => @shop.id})

    # also filter by external product id if provided
    unless @product_ids.empty?
      query = query.where(:product_id => @product_ids)
    end

    query
  end

  # finds any resource allocations within the query date range for resources mapped to products in scope
  def lookup_resource_allocations
    resource_ids = @resource_constraints.map{|rc| rc.resource_id}.uniq
    ResourceAllocation.joins(:booking_item).includes(:booking_item).where(:resource_id => resource_ids).where('finish > ? and start < ?', @start, @finish)
  end

  def lookup_product_resources
    # get all resources for this account and put them in a hash for later lookup
    resource_hash = {}.tap{|h| @shop.resources.each{|r| h[r.id] = r}}

    # map resources to products
    @resource_constraints.group_by {|r| r.product_id}.inject({}) do |h, (k, v)|
      resources = v.each.map do |rc|
        resource_hash[rc.resource_id] # lookup resource
      end

      h[k] = resources
      h
    end
  end

  def map_schedule(product)
    variants = @variants[product.id]
    variant = @variants[product.id].first if variants

    if variant.nil?
      Rails.logger.info "[AvailabilityCalculator] No variant found"
      return []
    end

    result = []
    duration = variant.duration_seconds
    schedules = @schedules[product.id]
    if schedules
      schedules.each do |schedule|
        result << {
            :start => datetime_array(schedule.start),
            :duration => duration
        }
      end
    end

    ice_schedule = product.icecube_schedule
    duration = ice_schedule.duration

    # There is a bug in IceCube::occurrences_between when you pass in a start date as a future date
    # it returns 0 occurrences. Use occurrences(finish) instead and skip everything before start.

    if @start > Time.now
      occurrences = ice_schedule.occurrences_between(Time.now, @finish.to_time)
    else
      occurrences = ice_schedule.occurrences_between(@start.to_time, @finish.to_time)

    end

    occurrences.each do |occurrence|
      if occurrence >= @start
        result << {
            :start => datetime_array(occurrence),
            :duration => duration
          }
      end
    end

    result.uniq
  end

  def map_capacities(product)
    result = []

    if product.capacity_type == 1 # variant based capacities
      poc = @capacities[product.id] # reference option_capacities for this product
      if poc
        poc.map do |oc|
          product.matching_variants(oc).each do |v|
            result << {:id => v.external_id, :capacity => oc.capacity}
          end
        end
      end
    end

    result
  end

  def map_options(product)
    result = []

    if product.capacity_type == 1 # variant based capacities
      poc = @capacities[product.id] # reference option_capacities for this product
      if poc
        poc.map do |oc|
          result << {:option1 => oc.option1, :option2 => oc.option2, :option3 => oc.option3, :capacity => oc.capacity}
        end
      end
    end

    result
  end

  def map_variants(product)
    result = []

    variants = @variants[product.id]
    return result if variants.nil?

    dc = product.duration_calculator

    variants.each do |v|
      duration = dc.duration_minutes(v)

      occurrences = []

      if product.profile == 'appt'
        occurrences = v.schedule.occurrences_between(@start.to_time, @finish.to_time).map do |occurrence|
          {:start => datetime_array(occurrence), :duration => duration}
        end unless v.schedule.rrules.empty?
      end

      result << {
          :id => v.external_id,
          :duration => duration,
          :startTime => time_array(v.start_time),
          :finishTime => time_array(v.finish_time),
          :partySize => v.party_size,
          :option1 => v.option1,
          :option2 => v.option2,
          :option3 => v.option3,
          :schedule => occurrences,
          :allDay => v.all_day?
      }
    end

    result
  end

  def map_booking_items(product)
    result = []

    product_booking_items = @booking_items[product.id]

    result = product_booking_items.map do |item|
      resources = []
      item.resources.each do |resource|
        resources << {
            :id => resource.id #,
            # :allocation => resource.allocation,
        }
      end

      {
        :start => datetime_array(item.start),
        :end => datetime_array(item.finish),
        # :all_day => item.variant.all_day,
        :quantity => item.quantity,
        :variant => item.external_variant_id,
        :allDay => item.variant.all_day?,
        :resources => resources,
        :buid => item.id, # booking unique id
        :booking_id => item.booking_id
      }
    end if product_booking_items

    result
  end

  def map_resources(product)
    resources = @product_resources[product.id] || []

    resources.map do |resource|
      {
          :id => resource.id,
          :name => resource.name #,
          # :type => resource.type
      }
    end
  end
end

AvailabilityCalculator2.class_eval do
  include ::NewRelic::Agent::MethodTracer

  %w(lookup_booking_items lookup_capacities lookup_products lookup_schedules lookup_variants lookup_resource_constraints lookup_product_resources map_capacities map_options map_variants map_schedule map_booking_items map_resources lookup_blackouts lookup_resource_allocations).each do |m|
    Rack::MiniProfiler.profile_method AvailabilityCalculator2, m
    add_method_tracer :calculate, "Service/AvailabilityCalculator2##{m}" # new relic
  end
end