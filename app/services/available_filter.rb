class AvailableFilter
  def initialize(products, blackouts)
    @products = products
    @blackouts = blackouts
  end

  # get products that are available - only valid if calculate has been run first
  def filter
    result = []

    @products.each do |p|
      if p[:scheduled] && p[:schedule].empty?
        next
      end

      booked_out = false
      bookings = p[:bookings]
      bookings.each do |b|
        if p[:capacity_type] == 0
          if b[:numberInParty] >= p[:capacity]
            booked_out = true
          end
        else
          # todo look at variant capacities
          #oc = product.option_capacities.select {|oc| oc.matches?(variant)}.first # find option_capacity config that matches this variant
          #capacity = oc.capacity unless oc.nil?
          #bookings = bookings.select{|booking| oc.matches?(booking.variant)}
        end
      end

      if booked_out
        next
      end

      # todo blackouts

      result << p
    end

    result
  end
end
