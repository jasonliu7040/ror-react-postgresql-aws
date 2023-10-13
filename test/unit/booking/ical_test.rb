require 'test_helper'

class IcalTest < ActiveSupport::TestCase
  setup do
    mock_out :get, 'shop.xml'
  end

  test 'all day ical' do
    booking = events(:ical_allday_event)
    ical = booking.ical.to_ical

    event = Icalendar::Event.parse(ical).first

    shop = shops(:test)

    assert_equal Icalendar::Values::Date, event.dtstart.class, 'All day event should have start as a date only'
    assert_equal Icalendar::Values::Date, event.dtend.class, 'All day event should have finish as a date only'

    assert_equal booking.start.strftime('%Y-%m-%d'), event.dtstart.iso8601, 'Event start date should match booking start date'
    assert_equal booking.finish.strftime('%Y-%m-%d'), event.dtend.iso8601, 'Event finish date should match booking finish date'

    external_shop = shop.external_shop
    assert_equal "mailto:#{external_shop.customer_email}", event.organizer.to_s, 'Event organizer should be shop customer email address'
  end

  test 'intra day ical' do
    booking = events(:ical_event)
    ical = booking.ical.to_ical

    event = Icalendar::Event.parse(ical).first

    assert_equal Icalendar::Values::DateTime, event.dtstart.class, 'All day event should have start as a date only'
    assert_equal Icalendar::Values::DateTime, event.dtend.class, 'All day event should have finish as a date only'

    assert_equal  booking.start.hour, event.dtstart.hour, 'Event start hour should match booking start hour'
    assert_equal  booking.start.min, event.dtstart.min, 'Event start minute should match booking start minute'
    assert_equal  booking.start.sec, event.dtstart.sec, 'Event start second should match booking start second'

    # assert event.dtstart.iso8601.end_with? '+10:00', 'Event start time should include utc_offset'
  end
end
