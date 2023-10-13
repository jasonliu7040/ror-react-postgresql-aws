require 'test_helper'
class NotifierTest < ActionMailer::TestCase
  setup do
    @shop = shops(:test)
    mock_out :get, 'shop.xml'
  end

  test 'signup email works yeah' do
    assert_difference 'ActionMailer::Base.deliveries.count' do
      email = Notifier.signup_email(@shop).deliver_now
    end
  end

  test 'install email works' do
    assert_difference 'ActionMailer::Base.deliveries.count' do
      Notifier.install_email(@shop).deliver_now
    end
  end

  test 'missing date email works' do
    assert_difference 'ActionMailer::Base.deliveries.count' do
      Notifier.uninstall_email(@shop).deliver_now
    end
  end

  test 'reminder email works' do
    template = @shop.template('reminder')
    template.cc = 'info@shopifyconcierge.com'
    template.attach_ticket = true
    template.save

    assert_difference 'ActionMailer::Base.deliveries.count' do
      booking = events(:gav)
      SendReminderMail.reminder_email(booking, template).deliver_now
    end

    email = ActionMailer::Base.deliveries.last
    assert_equal 'gavin@shopifyconcierge.com', email.to[0]
    assert_equal 'info@shopifyconcierge.com', email.cc[0]
    assert_equal 2, email.attachments.count # 2 attachments - ical and ticket since attach_ticket == true
    assert_equal 'event_reminder.ics', email.attachments[0].filename
    assert_equal 'ticket.pdf', email.attachments[1].filename
  end

  test 'reminder email with location addresses in to line works' do
    template = @shop.template('reminder')
    template.to = '{{ booking.location_emails }}'
    template.save

    booking = events(:gav)
    SendReminderMail.reminder_email(booking, template).deliver_now

    email = ActionMailer::Base.deliveries.last
    assert_equal 'support@shopifyconcierge.com', email.to[0]
  end

  test 'booking confirmation email works' do
    assert_difference 'ActionMailer::Base.deliveries.count' do
      SendNewBookingMail.booking_confirmation(@shop.bookings.active.first).deliver_now
    end

    confirmation_email = ActionMailer::Base.deliveries.last

    assert_equal 'Booking Confirmation', confirmation_email.subject
    assert_equal 'gavin@shopifyconcierge.com', confirmation_email.to[0]
    assert_match(/confirmation/, confirmation_email.body.parts[0].to_s)
  end

  test 'booking notification email works' do
    assert_difference 'ActionMailer::Base.deliveries.count' do
      SendNewBookingMail.booking_notification(@shop.bookings.active.first).deliver_now
    end
  end
end
