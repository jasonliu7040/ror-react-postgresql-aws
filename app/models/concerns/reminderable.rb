require 'active_support/concern'
module Reminderable

  extend ActiveSupport::Concern

  def send_reminder(template, reminder_trigger)
    case template.channel
      when TemplateChannel::EMAIL
        send_email(template, reminder_trigger)
      when TemplateChannel::SMS
        send_sms(template, reminder_trigger)
      else
        raise 'Can not send reminder for this channel'
    end
  end

  private

  def send_sms(template, reminder_trigger)
    log_and_raise do
      SmsSender.reminder_sms(self, template, reminder_trigger)
    end
  end

  def send_email(template, reminder_trigger)
    log_and_raise do
      SendReminderMail.reminder_email(self, template, reminder_trigger).deliver_now
    end
  end
end