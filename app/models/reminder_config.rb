class ReminderConfig < ActiveRecord::Base

  belongs_to :shop, inverse_of: :reminder_configs
  belongs_to :template, :class_name => "LiquidTemplate", foreign_key: "liquid_template_id", inverse_of: :reminder_configs

  scope :before_event_starts, -> { where(trigger_type: TriggerType::BEFORE_START) }
  scope :before_event_ends, -> { where(trigger_type: TriggerType::BEFORE_END) }
  scope :after_event_starts, -> { where(trigger_type: TriggerType::AFTER_START) }
  scope :after_event_ends, -> { where(trigger_type: TriggerType::AFTER_END) }

  def bookings_for_time(current_time)
    before_event_time_range = time_range_for_before(current_time)
    after_event_time_range = time_range_for_after(current_time)
    bookings = []

    case trigger_type
      when TriggerType::BEFORE_START
        time_range = before_event_time_range
        time_key = ReminderTriggerEvent::START
      when TriggerType::BEFORE_END
        time_range = before_event_time_range
        time_key = ReminderTriggerEvent::FINISH
      when TriggerType::AFTER_START
        time_range = after_event_time_range
        time_key = ReminderTriggerEvent::START
      when TriggerType::AFTER_END
        time_range = after_event_time_range
        time_key = ReminderTriggerEvent::FINISH
      else
        raise 'There is no such trigger type'
    end

    bookings = shop.bookings_in_time_range(time_range, time_key) if shop.present?
    return bookings, time_range, time_key
  end

  def time_range_for_before(current_time)
    reminder_time = duration.minutes || 15.minutes
    shop_start_time = current_time + reminder_time
    time_range(shop_start_time)
  end

  def time_range_for_after(current_time)
    reminder_time = duration.minutes || 15.minutes
    shop_start_time = current_time - reminder_time
    time_range(shop_start_time)
  end

  private

  def time_range(start_time)
    beginning_job_time = Time.at(start_time.to_i - start_time.sec - start_time.min % 15 * 60)
    ending_job_time = (beginning_job_time + 15.minutes) - 1.second
    return beginning_job_time..ending_job_time
  end

end
