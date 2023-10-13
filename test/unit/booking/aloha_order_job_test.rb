# require File.expand_path("../../../test_helper", __FILE__)
require 'test_helper'

class AlohaOrderJobTest < ActiveSupport::TestCase
  def setup_shop_order_job(order_id = 1, shop_name = 'hawaii')
    @shop = shops(shop_name.to_sym)
    @order_id = order_id
    mock_out(:get, "orders/#{order_id}.xml", shop_name)
  end

  test "aloha 1" do
    setup_shop_order_job 2

    hawaii_mock_session do
      assert_not_nil ShopifyAPI::Order.find(@order_id), "mock order find failed"

      OrderCreateJob2.new(@shop.id, @order_id).perform

      booking = Booking.find_by_order_id(@order_id)
      assert_not_nil booking, "aloha booking wasn't created"
      assert_equal "Scott Jacobs", booking.name, "wrong name for booking"
      assert_equal 1, booking.number_in_party, "wrong party size for booking"
      assert_equal '', booking.hotel, 'hotel should be empty'
      #Dates: finish=Sun Dec 29 11:24:00 UTC 2013&start=Sun Dec 29 11:12:00 UTC 2013&all_day=false
      assert_equal DateTime.new(2013, 12, 29, 11, 12, 0), booking.start, "wrong datetime for booking.start"
      assert_equal DateTime.new(2013, 12, 29, 11, 24, 0), booking.finish, "wrong datetime for booking.finish"
    end
  end

  test 'aloha multi product' do
    setup_shop_order_job 152792680

    hawaii_mock_session do
      OrderCreateJob2.new(@shop.id, @order_id).perform

      bookings = Booking.where(:order_id => @order_id)
      assert_not_empty bookings, "no bookings were created"

      # should also be bookings for the other products
      assert_equal 3, bookings.count, "expected 3 bookings"

      # ticket 6719 - name missing on subsequent bookings
      bookings.each_with_index do |booking, ndx|
        assert_not_nil booking.name, "booking name #{ndx} missing"
        assert_equal 1, booking.booking_names.count, 'should be only 1 booking name created'
      end

      booking_item = BookingItem.find_by_external_product_id_and_external_variant_id(27763452, 65985862)
      assert_not_nil booking_item, "booking item wasn't created"
    end
  end
end
