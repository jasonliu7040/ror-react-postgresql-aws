# require File.expand_path("../../../test_helper", __FILE__)
require 'test_helper'

class BookingTest2 < ActiveSupport::TestCase
  def get_new_booking(noww = "")
    now = noww.blank? ? Time.now : noww
    b = shops(:test).bookings.build
    b.booking_items.build({:start => now + 7.days, :finish => now + 7.days + 1.hour, :product => products(:product2), :variant => variants(:variant1)})
    b
  end

  test "should not save booking without required fields" do
    b = Booking.new
    assert !b.save
  end

  test "should be able to save valid booking" do
    b = shops(:test).bookings.build
    b.booking_items.build({:start => Time.now, :finish => Time.now + 1.hour, :product => products(:product2), :variant => variants(:variant1)})
    assert b.save, "save new booking failed"
    assert_not_nil b.start, "start date should have been set"
    assert_not_nil b.finish, "finish date should have been set"
    assert_not_nil b.product_summary, "should have saved a product summary"

    bi = b.booking_items.first
    assert_not_nil bi, "should have at least 1 child booking_item"
    assert_not_nil bi.external_product_id, "external_product_id should not be nil"
    assert_not_nil bi.external_variant_id, "external_variant_id should not be nil"

  end

  test "should swap dates if start after finish" do
    b = shops(:test).bookings.build
    b.booking_items.build({:start => Time.now.end_of_month, :finish => Time.now.beginning_of_month, :product => products(:product2), :variant => variants(:variant1)})
    saved = b.save
    assert saved, "could not save new valid booking"
    assert b.start < b.finish, "start and finish dates should have been swapped"
  end

  test "should adjust start and finish times if all day" do
    now = Time.now

    all_day_variant = variants(:variant1)
    assert all_day_variant.all_day, 'variant1 needs to be an all_day one for this test to work'

    b = shops(:test).bookings.build
    b.booking_items.build({:start => now + 7.days, :finish => now + 7.days + 1.hour, :product => products(:product2), :variant => all_day_variant})
    assert b.save, "save new booking failed"

    assert b.start.hour == 0 && b.start.min == 0, "start time should be at the beginning of the day for an all day booking"
    assert b.finish.hour == 23 && b.finish.min == 59, "finish time should be at the end of the day for an all day booking"
  end

  test "current bookings should have one booking item" do
    booking = get_new_booking
    booking.save
    booking.reload
    assert booking.booking_items.present?
  end

  test "can identify as active (or not incomplete at least)" do
    booking = events(:new_incomplete_product_one)
    refute booking.is_active?
  end

  test "changing contact name updates booking_names (test sync_booking_name method)" do
    booking = get_new_booking
    booking.name = 'Test'
    booking.save
    booking.reload
    assert booking.booking_names.size == 1, 'Should be 1 booking name record after save'

    booking.name = 'Updated'
    booking.save
    booking.reload
    assert booking.booking_names.first.name == 'Updated', 'Booking name should be updated when booking name changes'
  end
end
