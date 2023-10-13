class RecurringScheduleSerializer < ActiveModel::Serializer
  attributes :id,
             :schedule_id,
             :schedule_ical,
             :title

  def schedule_ical
    ical_schedule = object.icecube_schedule
    return nil if ical_schedule.blank?
    ical_schedule = ical_schedule.to_ical
    start_date = /(?<=DTSTART:).*/.match(ical_schedule).to_s
    if start_date.blank?
      start_date_str = /(?<=DTSTART;).*/.match(ical_schedule).to_s
      str = start_date_str.split(':')
      start_date = str[1]
    end

    begin
      start_date = start_date.to_datetime.strftime("%FT%R") if start_date.present?
    rescue ArgumentError => e
      start_date = ''
    end

    rrule = /(?<=RRULE:).*/.match(ical_schedule).to_s
    rule = ''
    rrule.split(';').each do |r|
      (name, value) = r.split('=')
      value.strip!
      case name
        when 'UNTIL'
          date = value.to_datetime.strftime("%Y%m%d")
          rule += name + '=' + date + ';'
        else
          rule += name + '=' + value + ';'
      end
    end
    rule = rule[0..-2] # remove last ';'

    {
        startDateTime: start_date,
        timeZone: {
            offset: '+00:00'
        },
        recurrencePattern: rule
    }
  end


  def title
    object.icecube_schedule.to_s
  end
end