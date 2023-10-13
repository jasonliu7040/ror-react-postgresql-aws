include ActionView::Helpers::DateHelper

class SendReminderMail < ActionMailer::Base
  def reminder_email(booking, template, reminder_trigger = nil)
    reminder_trigger ||= ReminderTriggerEvent.new
    reminder_trigger.booking_start ||= booking.start
    reminder_trigger.booking_finish ||= booking.finish

    if booking.email.blank?
      Rails.logger.info 'booking.email is blank'
      return
    end

    Rollbar.scope!({:booking => {:id => booking.id, :shop => booking.shop.subdomain}})

    shop = booking.shop
    return unless shop # make sure shop not uninstalled

    headers['X-SMTPAPI'] = JSON.generate({'unique_args' => {'shop' => shop.subdomain, 'booking' => booking.id}, 'category' => 'reminder'}).to_s # sendgrid tracking

    if template.attach_reminder?
      template.body = template.body + "<p>{{attachment['event_reminder.ics']}}</p>"
      attach_ical_event(booking)
    end

    if template.attach_ticket?
      template.body = template.body + "<p>{{attachment['ticket.pdf']}}</p>"
      attach_ticket(booking)
    end

    external = shop.external_shop
    return unless external # ensure shop still exists (if it gets suspended we don't get notified)

    fields = MailFields.new(template, booking, external)

    begin
      mail(subject: fields.subject, to: fields.to, cc: fields.cc, bcc: fields.bcc, from: fields.from, reply_to: fields.from) do |format|
        text = template.render({'booking' => booking, 'shop' => external, 'reminder_trigger' => reminder_trigger, 'attachments' => attachments})

        format.text { render :text => text }
        format.html do
          html_text = %{
            <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
            <html>
              <head>
                <meta content="text/html; charset=UTF-8" http-equiv="Content-Type" />
              </head>
              <body>
                #{text}
              </body>
            </html>
          }

          render :text => html_text
        end
      end

      Rails.logger.info "[#{shop.subdomain}/bookings/#{booking.id}] reminder email [subject: #{fields.subject}, to: #{fields.to}, cc: #{fields.cc}, bcc: #{fields.bcc}]"
    rescue Net::SMTPSyntaxError => smtpse
      Rails.logger.info "[#{shop.subdomain}/reminders/#{self.booking_id}] Email address dodgy"
    end
  end

  def attach_ical_event(booking)
    @calendar = Icalendar::Calendar.new
    @calendar.add_event booking.ical
    @calendar.publish
    @calendar_output = @calendar.to_ical

    attachments['event_reminder.ics'] = {:mime_type => 'text/calendar', :content => @calendar_output}
  end

  def attach_ticket(booking)
    kit = PDFKit.new(booking.render_ticket)
    attachments['ticket.pdf'] = {:mime_type => 'application/pdf', :content => kit.to_pdf}
  end
end
