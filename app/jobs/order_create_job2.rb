# Create a booking from a Shopify order
#
# Order -> Line Items becomes Booking -> Booking Items
#
class OrderCreateJob2 < Struct.new(:shop_id, :shopify_order_id)
  include BookThatAppUtils

  def perform
    log_exception(true) do
      @shop = Shop.where(id: self.shop_id).first
      unless @shop.present?
        Rails.logger.warn "[?/orders/#{self.shopify_order_id}] Shop not found"
        return
      end
      ::NewRelic::Agent.add_custom_attributes(:account => @shop.subdomain)

      @parser = @shop.datetime_parser

      @sorder = @shop.external_order(self.shopify_order_id)
      unless @sorder
        Rails.logger.warn "[#{@shop.subdomain}/orders/#{self.shopify_order_id}] Order not found"
        return # order no longer exists?
      end
      ::NewRelic::Agent.add_custom_attributes(:order => @sorder.id)

      #this should be nil so it never triggers, unless we're retrying an existing Booking.
      unless existing_order.blank?
        Rails.logger.warn "[#{@shop.subdomain}/orders/#{self.shopify_order_id}] Duplicate job for order"
        return
      end

      # ignore Point of Sale system/Mobile orders since they don't have line item properties to store booking dates
      if ['pos', 'mobile', 'api'].include?(@sorder.source_name)
        Rails.logger.info "[#{@shop.subdomain}/orders/#{shopify_order_id}] Source is #{@sorder.source_name}"
        return
      end

      attributes = @sorder.note_attributes || []

      bookings_created = []

      # create booking line items corresponding to each order line item
      @sorder.line_items.each do |item|
        # see if the variant in the line item has been configured and is not ignored
        product = Product.find_by_shop_id_and_external_id(@shop.id, item.product_id)
        next if product.nil?

        variant = Variant.find_by_product_id_and_external_id(product.id, item.variant_id)
        next if variant.nil? || variant.ignore?

        # how many units?
        units = determine_units(item) * variant.unit_multiplier

        props = item.properties || [] # booking details come through via line item properties
        props = props + attributes # falls back to use cart attributes if they exist

        start_time, finish_time = extract_times(props, variant)
        if start_time.nil?
          # @booking.status = BookingStatus::INCOMPLETE
          Rails.logger.info "[#{@shop.subdomain}/orders/#{shopify_order_id}/#{item.id}] Line item missing start date"
          next # skip to the next line item
        else
          # Rails.logger.info "[#{@shop.subdomain}/orders/#{shopify_order_id}/#{item.id}] start: #{start_time} finish: #{finish_time}"
        end

        # create a new booking the first time through or when the shop doesn't want to consolidate bookings
        if @booking.nil? || !@shop.consolidate_bookings?
          @booking = build_booking(@sorder, attributes)
          bookings_created << @booking
        end

        booking_item = @booking.booking_items.build({
                                                        :start => start_time.getutc(),
                                                        :finish => finish_time.getutc(),
                                                        :product => product,
                                                        :variant => variant,
                                                        :quantity => units,
                                                        :line_item_id => item.id
                                                    })

        assign_first_available_resource(booking_item)
        assign_location(booking_item)

        add_attendees(@booking, props)
        add_hotel(@booking, props)
        add_note(@booking, props)

        add_bookings_for_course(product, variant, bookings_created)

        # aloha golf customization - multiple products (max 3) under 1 product
        add_sneaky_booking(bookings_created, props, 2, units, item.id)
        add_sneaky_booking(bookings_created, props, 3, units, item.id)
      end

      Booking.transaction do
        bookings_created.each do |booking|
          # if no name specified on any of the line items then use the order customer details
          if booking.booking_names.empty?
            build_booking_name_from_customer(booking)
          end

          copy_contact_details_from_order(booking)

          # only save the booking if at least one booking item lines was added - effectively ignores orders with non-bta products
          unless booking.booking_items.empty?
            if booking.save(:validate => false)
              Rails.logger.info "[#{@shop.subdomain}/orders/#{self.shopify_order_id}] Booking #{booking.id} created"
            else
              Rails.logger.error "[#{@shop.subdomain}/orders/#{self.shopify_order_id}] Booking could not be created: #{booking.errors.inspect}"
            end
          end
        end
      end
    end
  end

  private

  def add_bookings_for_course(product, variant, bookings_created)
    if product.profile == ProductProfiles::COURSE
      init_booking = bookings_created.pop

      product.terms.each do |term|
        occurrences = term.occurrences
        occurrences.each do |occurence|
          course_booking = init_booking.dup
          course_booking_item = init_booking.booking_items.first.dup
          course_booking_item.start = occurence[:start].getutc()
          course_booking_item.finish = variant.advance_default_duration(course_booking_item.start).getutc()
          course_booking.booking_items << course_booking_item
          bookings_created << course_booking
        end
      end

      @booking = nil
    end
  end

  def determine_units(item)
    units = item.quantity

    if @shop.settings.quantity_range == 'yes' # if date_range updates quantity then treat it as 1 unit
      units = 1
    end

    props = item.properties
    unit_qty_prop = prop(props, 'Units') || prop(props, 'booking-units') || prop(props, 'bta-unit-quantity') || prop(props, 'booking-party') # booking-party deprecated
    if unit_qty_prop # use unit quantity if supplied
      units = unit_qty_prop.value.to_i
    end

    units
  end

  def copy_contact_details_from_order(booking)
    booking.phone = @sorder.respond_to?(:billing_address) ? @sorder.billing_address.phone : ''

    if @sorder.respond_to?(:customer)
      booking.customer_id = @sorder.customer.id
    else
      booking.customer_id = ''
    end

    contact = booking.booking_names.first
    if contact
      booking.name = contact.name
      booking.email = contact.email.blank? ? @sorder.email : contact.email
    end
  end

  def build_booking(sorder, attributes)
    booking = @shop.bookings.build({
                                       :order_id => sorder.id,
                                       :order_name => sorder.name || '',
                                       :status => BookingStatus::status(sorder.financial_status)
                                   })

    # look at cart attributes for booking level properties
    add_attendees(booking, attributes)
    add_hotel(booking, attributes)
    add_note(booking, attributes)

    booking
  end

  def build_booking_name(booking, name, email)
    return if name.blank?

    booking.booking_names.build({
        :name => name.titleize,
        :email => email
    }) unless booking.booking_names.any? {|bn| bn.name == name && bn.email.downcase == email.downcase}
  end

  def build_booking_name_from_customer(booking)
    if @sorder.respond_to?(:customer)
      scustomer = @sorder.customer
      build_booking_name(booking, "#{scustomer.first_name} #{scustomer.last_name}", scustomer.email)
    end
  end

  def existing_order
    existing_booking = Event.exists?(:shop_id => shop_id, :order_id => shopify_order_id)
    if existing_booking
      Rails.logger.info "[#{@shop.subdomain}/orders/#{shopify_order_id}] Booking with order id #{shopify_order_id} already exists"
      existing_booking # returns true
    end
  end

  def extract_times(props, variant)
    @parser.parse_datetimes(props, variant)
  end

  def assign_first_available_resource(booking_item)
    count = booking_item.product.resources.count
    if count > 0
      # randomly order resources using sample
      resources = booking_item.product.resources.sample(count)

      # find first available resource
      found = false
      resources.each do |resource|
        if resource.available?(booking_item.start, booking_item.finish)
          found = true
          booking_item.resource_allocations.build({:resource => resource})
          Rails.logger.info "[#{@shop.subdomain}/orders/#{self.shopify_order_id}] Assigned resource '#{resource.name}' to booking item #{booking_item.id}"
          break
        end
      end

      Rails.logger.warn "[#{@shop.subdomain}/orders/#{self.shopify_order_id}] No resource was available" unless found
    end
  end

  def assign_location(booking_item)
    # for now we just assign the only location if there is one. later we will check if location is provided in the order.
    if booking_item.product.locations.size == 1
      booking_item.location = booking_item.product.locations.first
    end
  end

  def add_attendees(booking, props)
    if prop(props, 'booking-name').present?
      build_booking_name(booking, prop_value(props, 'booking-name'), prop_value(props, 'booking-email'))

      # look for other booking-name attributes
      props.select{|prop| prop.name.starts_with? 'booking-name-' }.each_with_index do |prop, index|
        offset = index + 2
        build_booking_name(booking, prop_value(props, "booking-name-#{offset}"), prop_value(props, "booking-email-#{offset}"))
      end
    end
  end

  def add_note(booking, props)
    note = prop_value(props, 'booking-note')
    if note
      if booking.notes.blank?
        booking.notes = note
      else
        booking.notes = "#{booking.notes}\n#{note}"
      end
    end
  end

  def add_hotel(booking, props)
    hotel = prop_value(props, 'booking-hotel') || prop_value(props, 'booking-hotel')
    if hotel
      if booking.hotel.blank?
        booking.hotel = hotel
      else
        booking.hotel = "#{booking.hotel}, #{hotel}"
      end
    end
  end

  # Aloha!
  def add_sneaky_booking(bookings, props, index, qty, line_item_id)
    product_prop = prop(props, "booking-product-#{index}", true)
    return if product_prop.nil?
    return if product_prop.value.nil?

    parts = product_prop.value.split('|')
    return if parts.empty?

    split = parts.last.split(':')

    shopify_product_id = split.first.to_i
    product = Product.find_by_external_id(shopify_product_id)

    shopify_variant_id = split.last.to_i
    variant = Variant.find_by_external_id(shopify_variant_id)

    Rails.logger.info "[#{@shop.subdomain}/orders/#{self.shopify_order_id}] adding sneaky booking: shopify product: #{shopify_product_id}, shopify variant: #{shopify_variant_id}, bta product found: #{!product.nil?}, bta variant found: #{!variant.nil?}"

    return if product.nil? # product hasn't been defined
    return if variant.nil? # protect against test webhooks that don't pass a variant id or variants we don't care about

    start_prop = prop(props, "booking-start-#{index}") || prop(props, "booking-start")
    time_prop = prop(props, "booking-time-#{index}") || prop(props, "booking-time")

    start = @parser.parse(start_prop.value)
    start = set_time start, time_prop.value

    aloha_booking = build_booking(@sorder, props)

    aloha_booking.booking_items.build({
                                          :start => start,
                                          :finish => variant.advance_default_duration(start),
                                          :product => product,
                                          :variant => variant,
                                          :quantity => qty,
                                          :line_item_id => line_item_id,
                                          :location => product.locations.first
                                      })

    bookings << aloha_booking
  end
end
