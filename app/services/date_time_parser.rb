class DateTimeParser
  attr_reader :zone, :has_time

  include BookThatAppUtils

  def initialize(shop, date_format = shop.settings.df)
    @shop = shop
    @has_time = false
    @zone = ActiveSupport::TimeZone.new(shop.timezone)
    @date_format = date_format ? date_format : ""
  end

  def parse_datetimes(props, variant)
    start_time = start_time(props, variant)

    if start_time
      finish_time = finish_time(props, variant, start_time)
    end

    return start_time, finish_time
  end

  # converts @date_str to DateTime
  def parse(date_str)
    # Rails.logger.info "|DateTimeParser| #{@shop.subdomain}: #{@zone}; format: #{@date_format}; parse: #{date_str}"

    return @zone.now if date_str.blank?

    begin
      # check if date_str is an ISO 8601 formatted date
      begin
        result = DateTime.strptime(date_str, '%Y-%m-%dT%H:%M')
        @has_time = true
        return result
      rescue ArgumentError # fall through
        @has_time = false
      end

      # '05/05/2014' && '%d/%m/%Y'
      if (date_str.length == 10) && (@date_format.length == 8)
        df = @date_format.sub('yy', '%Y') # change human friendly date format specifier to Rails friendly one
        df = df.sub('dd', '%d')
        df = df.sub('mm', '%m')
        return DateTime.strptime(date_str, df)
      else
        # creates a new time object to utc retaining dd, mm, yyyy, hh, mm
        #return Time.at(@zone.parse(date_str).utc + @zone.utc_offset) # screws up when DST in effect
        return DateTime.parse(date_str)
      end
    rescue ArgumentError # fall back to Chronic
      parsed = Chronic.parse(date_str, {:now => @zone.now})
      return parsed.nil? ? @zone.now : parsed # default to today if Chronic couldn't make sense of it
    end
  end

  # checks if during parse a time was also found
  def has_time?
    @has_time
  end

private
  def start_time(props, variant)
    start_prop = prop(props, "booking-#{variant.external_id}-start", true) ||
        prop(props, 'booking-start') ||
        prop(props, 'date', true) ||
        prop(props, 'start', true) ||
        prop(props, 'booking', true) ||
        prop(props, 'event') ||
        prop(props, 'from', true) ||
        prop(props, 'delivery', true) ||
        prop(props, 'service date', true) || # TODO: when start date property is user defined removed this and set up lawntechservices to use this
        prop(props, 'día') # TODO: same as above - need to map property name to logical name in BTA admin

    if start_prop
      start = parse(start_prop.value)

      time_prop =
          prop(props, 'start-time') ||
          prop(props, 'booking-time', true) ||
          prop(props, 'time', true) ||
          prop(props, 'hora')

      if time_prop
        start = set_time(start, time_prop.value)
      else
        if !variant.all_day? && !has_time? # time passed as part of the date (e.g. ISO 8601)
          var_start_time = variant.start_time
          start.change(:hour => var_start_time ? var_start_time.hour : 0, :min => var_start_time ? var_start_time.min : 0)
        else
          start
        end
      end
    end

    start
  end

  def finish_time(props, variant, start)
    # by default add duration configured for the variant
    finish = variant.advance_default_duration(start)

    # but overide if a finish datetime was provided
    finish_prop = prop(props, 'booking-finish') ||
        prop(props, 'booking-end') ||
        prop(props, 'to', true) ||
        prop(props, 'finish', true) ||
        prop(props, 'return', true)

    if finish_prop
      finish = parse(finish_prop.value)

      time_prop = prop(props, 'finish-time')
      finish = set_time(finish, time_prop.value) if time_prop
    end

    finish
  end
end
