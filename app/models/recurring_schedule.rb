class RecurringSchedule < ScheduleItem
  def occurrences(start, finish)
    ice_schedule = icecube_schedule
    return [] if ice_schedule.blank? || ice_schedule.rrules.empty? # not a recurring schedule

    duration = ice_schedule.duration
    occurrences = ice_schedule.occurrences_between(start, finish)

    result = []
    occurrences.each do |occurrence| # next_occurrences
      if occurrence >= start
        result << {
            start: occurrence.start_time,
            finish: occurrence.end_time,
            duration: duration
        }
      end
    end
    result
  end

  def icecube_schedule
    unless schedule_yaml.blank?
      begin
        IceCube::Schedule.from_yaml(schedule_yaml)
      rescue Exception => e
        logger.error "Error loading schedule yaml: #{self.schedule_yaml}"
        logger.error e.message + "\n " + e.backtrace.join("\n ")
        IceCube::Schedule.new(Date.today.to_time.utc)
      end
    end
  end

  def schedule_ical=(schedule)
    start_date = schedule[:startDateTime].to_datetime.strftime('%Y%m%dT%H%M%S%z') if schedule[:startDateTime].present?
    start_date = "DTSTART:#{start_date};\n" if start_date.present?
    rule = "RRULE:#{schedule[:recurrencePattern]}" if schedule[:recurrencePattern].present?
    until_date = /(?<=UNTIL=).+[0-9TZ:]/.match(rule) if rule.present?
    if until_date.present?
      rule[until_date.end(0)]='Z'
    end

    ical = start_date.to_s  + rule.to_s
    icecube_schedule = IceCube::Schedule.from_ical(ical)
    self.schedule_yaml = icecube_schedule.to_yaml
  end

  # just hook because we don't have permitted parms for product
  def title=(args)
  end

end
