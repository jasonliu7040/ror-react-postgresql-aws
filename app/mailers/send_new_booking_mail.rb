include ActionView::Helpers::DateHelper
#
# Handles mail notifications for New Booking emails. Processed on a background queue via NewBookingJob.
#
class SendNewBookingMail < ActionMailer::Base
  #
  # Sent to customer to confirm a booking
  #
  def booking_confirmation(booking)
    shop = booking.shop
    template = shop.template("new_booking_confirmation")
    @external = shop.external_shop

    from = from(shop)
    attach_ics(booking, template)

    headers['X-SMTPAPI'] = JSON.generate({"unique_args" => {"shop" => shop.subdomain, "booking" => booking.id}, "category" => "new booking"}).to_s

    Rails.logger.info "[#{shop.subdomain}/bookings/#{booking.id}] sent booking confirmation email to #{booking.email}"

    text = template.render({"booking" => booking, "shop" => shop, "attachments" => attachments})

    mail(:subject => subject(booking, template.subject),
         :to => booking.email,
         :cc => template.cc,
         :from => from,
         :reply_to => from) do |format|

      format.text { render :text => text }
      format.html { render :text => text }
    end
  end

  #
  # Sent to store owner to notify about a new booking
  #
  def booking_notification(booking)
    shop = booking.shop
    template = shop.template("new_booking_notification")
    @external = shop.external_shop

    headers['X-SMTPAPI'] = JSON.generate({"unique_args" => {"shop" => shop.subdomain, "booking" => booking.id}, "category" => "new booking"}).to_s

    to = @external.email

    Rails.logger.info "[#{shop.subdomain}/bookings/#{booking.id}] sent booking notification email to #{to}"

    text = template.render({"booking" => booking, "shop" => shop})

    mail(:subject => subject(booking, template.subject),
         :to => to,
         :cc => template.cc,
         :from => 'info@bookthatapp.com') do |format|
      format.text { render :text => text }
      format.html { render :text => text }
    end
  end

private
  def from(shop)
    @external.customer_email.nil? ? @external.email : @external.customer_email
  end

  def attach_ics(booking, template)
    template.body = template.body + "<p>{{attachment['booking_confirmation.ics']}}</p>"
    @calendar = Icalendar::Calendar.new
    event = booking.ical

    shop = booking.shop.external_shop
    if customer_email = shop.customer_email
      event.organizer = Icalendar::Values::CalAddress.new("mailto:#{customer_email}", cn: "#{shop.name}")
    end
    @calendar.add_event event
    @calendar.publish
    @calendar_output = @calendar.to_ical
    attachments['booking_confirmation.ics'] = {:mime_type => 'text/calendar', :content => @calendar_output}
  end

  def subject(booking, template)
    Liquid::Template.parse(template.blank? ? "Booking Confirmation" : template).render({"booking" => booking})
  end
end
