require 'icalendar/tzinfo'

# Used to process the public (index) calendar of all schedules. Show route with their unique code as the id will allow them to see their private bookings.
class CalendarController < ApplicationController
  skip_before_filter :check_plan_and_require_account
  before_filter :current_account, :check_account_exists

  def index
    respond_to do |format|
      format.html
      format.ics do
        @start = Time.zone.now - 1.week
        @finish = @start + 2.months

        # find product ids for any bookings in the timeframe
        product_ids = @account.booking_items.where('finish > ? and start < ?', @start, @finish).uniq.pluck(:product_id)

        # get bookings
        calculator = AvailabilityCalculator2.new(@account, @start, @finish, product_ids)
        products, blackouts = calculator.calculate()

        # build calendar of events
        @calendar = Icalendar::Calendar.new
        @calendar.add_timezone @account.tzinfo.ical_timezone(@start)

        blackouts.each do |blackout|
          @calendar.event do |event|
            event.dtstart = datetime(blackout[:start])
            event.dtend =  datetime(blackout[:end])
            event.summary = 'Blackout'
          end
        end

        # collect the booking ids from the availability results
        booking_ids = []
        products.each do |product|
          booking_ids += product[:bookings].collect{|b|b[:booking_id]}
        end

        # query the bookings again!
        Booking.where(id: booking_ids).each do |booking|
          # @calendar.add_event(booking.store_owner_ical)
          @calendar.add_event(booking.ical)
        end

        @calendar.publish

        @calendar_output = @calendar.to_ical
      end
    end
  end

  def show
    if @account.compare_calendar_code(params[:id] || "")
      respond_to do |format|
        format.html
        format.ics {handle_ics_response}
      end
    else
      redirect_to '/'
    end
  end

  private

  def handle_ics_response
    current_account
    @calendar_output = request[:action] == "index" ? index_response : show_response
  end

  def index_response
    the_cal = CalendarScheduler.new(@account, params, [])
    the_cal.in_ics_format
  end

  def show_response
    result = @account.get_calendar_show_info
    @calendar = Icalendar::Calendar.new
    result.each do |the_booking|
      @calendar.add_event the_booking.ical
    end
    @calendar.publish
    @calendar.to_ical
  end

  def check_account_exists
    not_found unless @account
  end

  def datetime(arr)
    if arr.is_a?(Array)
      dt = DateTime.new(arr[0], arr[1], arr[2], arr[3], arr[4], arr[5])
    else
      dt = arr
    end

    Icalendar::Values::DateTime.new(dt, 'tzid' => @account.timezone)
  end
end
