class SmsSender

  FROM = "+13217326105"

  def self.reminder_sms(booking, template, reminder_trigger = nil)
    reminder_trigger ||= ReminderTriggerEvent.new
    reminder_trigger.booking_start ||= booking.start
    reminder_trigger.booking_finish ||= booking.finish

    shop = booking.shop
    raise 'Template channel is not SMS' unless template.channel == TemplateChannel::SMS
    message = template.render({"shop" => shop.external_shop, "booking" => booking, "reminder_trigger" => reminder_trigger})
    begin
      unless Rails.env.test?
        if booking.phone.present?
          sms = $twilio.account.sms.messages.create(:body => message, :to => booking.phone, :from => FROM)
          Rails.logger.info "[#{shop.subdomain}/bookings/#{booking.id}] sent reminder sms to #{booking.phone}"
        else
          Rails.logger.info "[#{shop.subdomain}/bookings/#{booking.id}] didn't send reminder sms because phone was not set"
        end
      end
    rescue Twilio::REST::RequestError => e
      Rails.logger.info "[#{shop.subdomain}/reminders/#{booking.id}] failed: #{e.message}"
    end
  end

end