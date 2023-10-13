class TriggerType < Dictionarable
  BEFORE_START = 'before_start'
  AFTER_START = 'after_start'
  BEFORE_END = 'before_end'
  AFTER_END = 'after_end'


  def self.values
    {
        BEFORE_START => 'Before the event starts',
        AFTER_START => 'After the event starts',
        BEFORE_END => 'Before the event ends',
        AFTER_END => 'After the event ends'
    }
  end

end

class ReminderTriggerEvent
  START = :start
  FINISH = :finish
  MANUAL = :manual

  attr_accessor :trigger_type, :time_range, :booking_start, :booking_finish

  def initialize(trigger_type = nil, time_range = nil)
    @trigger_type = trigger_type || MANUAL
    @time_range = time_range
  end

  def to_liquid
    {
        'trigger_type' => trigger_type,
        'time_range' => time_range,
        'booking_start' => booking_start,
        'booking_finish' => booking_finish
    }
  end
end

class ReminderTriggerEventDrop < Liquid::Drop
  def initialize(item, trigger)
    @trigger_type = trigger['trigger_type']
    @time_range = trigger['time_range']
    @item = item
  end

  def cover
    if @trigger_type == ReminderTriggerEvent::MANUAL
      true
    else
      @time_range.cover?(@item[@trigger_type.to_s])
    end
  end
end

class RemindersService
  def initialize(time = Time.now)
    @time = time
  end

  def send_reminders(config)
    if config.template.shop_id != config.shop_id
      raise 'Shop Ids for config and template are not equal'
    end

    bookings_for_reminder(config).each do |obj|
      obj[:booking].send_reminder(config.template, obj[:reminder_trigger])
    end
  end


  def send_reminder_for_bookings(bookings, template, reminder_trigger = ReminderTriggerEvent.new)
    bookings.each do |booking|
      booking.send_reminder(template, reminder_trigger)
    end
  end

  private

  def bookings_for_reminder(config)
    bookings_reminders = bookings_for_config(config)
    booking_ids = []
    bookings = []

    bookings_reminders.each do |obj|
      unless booking_ids.include? obj[:booking].id
        booking_ids.push(obj[:booking].id)
        bookings.push(obj)
      end
    end

    bookings
  end

  def bookings_for_config(config)
    matched_bookings = []
    bookings, time_range, time_key = config.bookings_for_time(@time)
    bookings.each do |booking|

      booking_covered = time_range.cover?(booking[time_key])
      reminder_trigger =  ReminderTriggerEvent.new(time_key, time_range)
      if booking_covered
        reminder_trigger.booking_start = booking.start
        reminder_trigger.booking_finish = booking.finish
      else
        reminder_trigger.booking_start = booking['item_start']
        reminder_trigger.booking_finish = booking['item_finish']
      end

      matched_bookings.push({ booking: booking,
                              reminder_trigger: reminder_trigger })
    end

    matched_bookings
  end
end