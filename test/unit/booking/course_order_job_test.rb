require 'test_helper'
#require File.expand_path("../../../test_helper", __FILE__)

class CourseOrderJobTest < ActiveSupport::TestCase
  def setup_shop_order_job(order_id = 5, shop_name = "test")
    @shop = shops(shop_name.to_sym)
    @order_id = order_id
    mock_out(:get, "orders/#{order_id}.xml", shop_name)
  end

  test "create additional bookings for courses" do
    setup_shop_order_job

    mock_session do
      assert_not_nil ShopifyAPI::Order.find(@order_id), "mock order file doesn't exist"

      assert_difference "Booking.count", 5 do
        OrderCreateJob2.new(@shop.id, @order_id).perform
      end

      bookings = Booking.where(order_id: @order_id)
      assert_equal 5, bookings.count
      assert_equal 1, bookings.to_a[0].booking_items.size
      assert_equal 1, bookings.to_a[1].booking_items.size
      assert_equal 1, bookings.to_a[2].booking_items.size
      assert_equal 1, bookings.to_a[3].booking_items.size
      assert_equal 1, bookings.to_a[4].booking_items.size

      starts = []
      bookings.each do |booking|
        starts << booking.booking_items.first.start.getutc()
      end
      expected_starts = [ Time.utc(2016, 01, 03, 11, 23),
                          Time.utc(2016, 01, 04, 11, 23),
                          Time.utc(2016, 01, 18, 9, 00),
                          Time.utc(2016, 01, 19, 9, 00),
                          Time.utc(2016, 01, 20, 9, 00)
      ]
      assert_equal expected_starts.sort, starts.sort
    end
  end


  test "order with non courses product doesn't create additional bookings" do
    setup_shop_order_job 444

    mock_session do
      assert_not_nil ShopifyAPI::Order.find(@order_id), "mock order file doesn't exist"

      assert_difference "Booking.count", 1 do
        OrderCreateJob2.new(@shop.id, @order_id).perform
      end

      bookings = Booking.where(order_id: @order_id)
      assert_equal 1, bookings.count
    end
  end


  test "creates additional items, it doesnt depend on booking-start" do
    setup_shop_order_job 55

    mock_session do
      assert_not_nil ShopifyAPI::Order.find(@order_id), "mock order file doesn't exist"

      assert_difference "Booking.count", 5 do
        OrderCreateJob2.new(@shop.id, @order_id).perform
      end

      bookings = Booking.where(order_id: @order_id)

      starts = []
      bookings.each do |booking|
        starts << booking.booking_items.first.start.getutc()
      end
      expected_starts = [ Time.utc(2016, 01, 03, 11, 23),
                          Time.utc(2016, 01, 04, 11, 23),
                          Time.utc(2016, 01, 18, 9, 00),
                          Time.utc(2016, 01, 19, 9, 00),
                          Time.utc(2016, 01, 20, 9, 00)
      ]
      assert_equal expected_starts.sort, starts.sort
    end
  end


end
