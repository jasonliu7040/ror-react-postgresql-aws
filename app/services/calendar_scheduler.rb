require 'new_relic/agent/method_tracer'

#Used to generate a Calendar output for use in json or ical formats
# Would be nice to document the params we expect here for json, or maybe we don't for ics
class CalendarScheduler
  include BookThatAppUtils

  def initialize(account, params, product_ids)
    @account = account
    @params = params
    @product_ids = product_ids.flatten
  end

#public methods should se the @start and @finish if you add more maybe the third one will be the tie breaker but can't add to initialize yet, too different.
  def in_ics_format
    @start = Time.zone.now
    @finish = @start + 1.month
    @calendar = Icalendar::Calendar.new
    iterate_calendar_events
    @calendar_output = @calendar.to_ical
  end

  def in_json_format
    set_times # need proper dates here
    if @start.blank? || @finish.blank?
      {:json => {:error => "The start and end params must be real dates"}, status: 404 }
    else
      results = filter_products
      {:json =>
           {:schedule => results,
            :blackouts => @blackouts.map { |bout| bout.to_calendar_hash }},
       :callback => @params[:callback]}
    end
  end

  def in_html_format
    set_times
    if @start.blank? || @finish.blank?
      raise 'start and/or finish params missing'
    else
      return filter_products, @blackouts.map { |bout| bout.to_calendar_hash }
    end
  end

  def iterate_calendar_events
    results = filter_products
    results.each do |the_booking|
      @calendar.event do |the_event_e|
        the_event_e.dtstart = Icalendar::Values::DateTime.new(the_booking[:start])
        the_event_e.dtend =  Icalendar::Values::DateTime.new(the_booking[:end])
        the_event_e.summary = the_booking[:title]
      end
    end
    @calendar.publish
  end

  def set_times
    begin
      @start = @params.has_key?(:start) ? Time.parse(@params[:start]) : Time.now
      if @params.has_key?(:finish)
        @finish = Time.parse(@params[:finish])
      elsif @params.has_key?(:end) # 'end' deprecated
        @finish = Time.parse(@params[:end])
      else
        @finish = @start + 6.month
      end
    rescue
      @start = ""
      @finish = ""
    end
  end

  def filter_products
    @blackouts ||= handle_blackouts

    # find the set of products we are dealing with
    products = @account.products.includes([:variants, :locations, :resources, schedule: :recurring_items]).where(:hidden => false)

    # filter by external product ids
    products = products.where(:external_id => @product_ids) if @product_ids.present?

    # filter by location
    location =  @params[:location]
    products = products.joins(:locations).where("locations.id = #{location.to_i}") if location.present?

    # filter by resource
    resource =  @params[:resource]
    products = products.joins(:resources).where("resources.id = #{resource.to_i}") if resource.present?

    # this is the set of products we are looking at
    product_map = products.index_by(&:id)

    #
    # find availability for the products
    # TODO: take into account resource bookings
    #
    # get booking_count for each product, start, finish - e.g:
    # {[18806, 2015-05-02 10:00:00 UTC, 2015-05-02 11:00:00 UTC]=>22}
    #
    booking_item_sums = @account.booking_items.where(product_id: product_map.keys).where('finish > ? and start < ?', @start, @finish).group(:product_id).group(:start).group(:finish).sum(:quantity)

    #
    # convert to hash: product_id => array[BookingSummary])
    #
    product_bookings = {}
    booking_item_sums.each do |row|
      product_id = row[0][0]
      bookings = product_bookings[product_id] || []
      bookings << BookingSummary.new({product_id: product_id, start: row[0][1], finish: row[0][2], sum: row[1]})
      product_bookings[product_id] = bookings
    end

    results = []
    product_map.each do |product_id, product|
      variant = product.variants.first

      if @params[:variant].present?
        variant = product.variants.find_by_external_id(@params[:variant])
        return unless variant # protect against invalid variant being passed as param
      end

      iterate_occurrences(variant, @start, @finish).each_with_index do |occurrence, index|
        occurrence_start = occurrence[:start]
        occurrence_finish = occurrence[:finish]

        # skip this occurrence if blacked out
        next if @blackouts.any? {|blackout| blackout.overlaps?(occurrence_start, occurrence_finish) && (blackout.product_id.nil? || blackout.product_id == product.id)}

        results << {
            id: "#{product_id}-#{index}", # TODO: replace with occurrence_id when occurrences are stored in DB
            start: get_time(occurrence_start, @params[:format]),
            end: get_time(occurrence_finish, @params[:format]),
            url: "/products/#{product.product_handle}?start=#{occurrence_start.strftime('%FT%T')}",
            allDay: variant.all_day?,
            bookingCount: overlapping_booking_count(occurrence_start, occurrence_finish, product_bookings[product_id] || [])
        }.merge(product.calendar_properties)
      end
    end

    results.flatten
  end

  def handle_blackouts
    # convert external ids to bta ids
    bta_product_ids = @account.products.where(:external_id => @product_ids).pluck(:id)
    blackouts = @account.all_blackouts(@start, @finish, bta_product_ids)

    # filter blackouts list to either global or product specific ones
    blackouts = blackouts.select do |blackout|
      match = false
      if blackout.product_id.nil? # global product blackout
        match = true
      else
        if blackout.variant_id.nil? # match if the blackout isn't specific to a variant
          match = true
        else # check variant matches if variant supplied
          if @params.has_key?(:variant)
            variant = @account.variants.find_by_external_id(@params[:variant].to_i)
            match = blackout.variant_id == variant.id if variant
          end
        end
      end

      match
    end

    blackouts
  end

  def iterate_occurrences(variant, start, finish)
    product = variant.product
    return [] if !product.scheduled? || product.schedule.blank?

    isch = product.icecube_schedule
    if isch.present? && isch.rrules.present? # use ice_cube schedule duration if configured
      duration = isch.duration
    else
      dc = product.duration_calculator
      duration = dc.duration(variant)
    end

    product.schedule.occurrences_between_for_variant(start, finish, variant, duration)
  end

  def overlapping_booking_count(start, finish, booking_summaries)
    count = 0
    booking_summaries.each do |booking_summary|
      count += booking_summary.sum if booking_summary.overlaps?(start, finish)
    end
    count
  end

  def get_time(the_time, format)
    format == "ics" ? the_time : datetime_array(the_time)
  end
end

class BookingSummary
  include Virtus.model

  attribute :product_id, Integer
  attribute :start, DateTime
  attribute :finish, DateTime
  attribute :sum, Integer

  def overlaps?(start_date, finish_date)
    (start - finish_date) * (start_date - finish) >= 0
  end
end

CalendarScheduler.class_eval do
  include ::NewRelic::Agent::MethodTracer

  %w(filter_products handle_blackouts).each do |m|
    Rack::MiniProfiler.profile_method CalendarScheduler, m
    add_method_tracer :calculate, "Service/CalendarScheduler##{m}" # new relic
  end
end