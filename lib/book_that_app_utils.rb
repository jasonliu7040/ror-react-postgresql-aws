module BookThatAppUtils
  def add_pound_sign_or_return_blank(the_order_name)
    unless the_order_name.present? && the_order_name[0, 1] == '#' || the_order_name.blank?
      the_order_name.insert 0, '#'
    end
    the_order_name
  end

  def date_from_ymd(ymd, backup_date_on_error = "")
    begin
      DateTime.parse(ymd)
      # split = ymd.split('-')
      # Time.local(split[0].to_i, split[1].to_i, split[2].to_i, 0, 0, 0)
    rescue
      backup_date_on_error
    end
  end

  def date_to_ymd(date)
    date = date.to_datetime if date.is_a?(String)
    date.strftime('%F')
  end

  def time_array(time)
    [time.hour, time.min, time.sec] unless time.nil?
  end

  def datetime_array(time)
    [time.year, time.month, time.day, time.hour, time.min, time.sec] unless time.nil?
  end

  def log_exception(throw = false, &block)
    begin
      block.call(self)
    rescue => e
      if (e.respond_to? :response) && (e.response.code.present?) && (e.response.code.to_s == '429')  # api limit reached
        Rails.logger.info "#{e.message}"
      else
        Rails.logger.error "Error: #{e.message}"
        Rails.logger.error("\n\n#{e.class} (#{e.message}):\n    " + e.backtrace.join("\n    ") + "\n\n")
        ExceptionNotifier.notify_exception(e)
        Rollbar.notifier.log('error', e)
      end
      raise e if throw
    end
  end

  def log_and_raise(&block)
    log_exception(true, &block)
  end

  def log_exception_and_throw_again(&block)
    log_exception(true, &block)
  end

  def prop(props, name, exact = false)
    compare_name = name.downcase

    selected = props.select do |p|
      prop_name = p.name.downcase

      if exact
        prop_name == compare_name
      else
        prop_name.include?(compare_name)
      end
    end

    if selected.size > 0
      selected.first
    else
      nil
    end
  end

  def prop_value(item, name)
    prop = prop(item, name)
    prop.nil? ? '' : prop.value
  end

  def set_time(time, value)
    # remove hyphens and grab first value ('9am - 1pm' => '9am')
    sanitized_value = value.gsub(/-/, ' ').split.first

    # converts '09:00' or '2 pm' to current date set at the time parsed
    parsed_time = Chronic.parse(sanitized_value)

    time.change(:hour => parsed_time.hour, :min => parsed_time.min) if parsed_time
  end
end
