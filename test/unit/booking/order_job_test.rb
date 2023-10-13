# require 'test_helper'
require File.expand_path("../../../test_helper", __FILE__)

class OrderJobTest < ActiveSupport::TestCase
  def setup_shop_order_job(order_id = 1, shop_name = "test")
    @shop = shops(shop_name.to_sym)
    @order_id = order_id
    mock_out(:get, "orders/#{order_id}.xml", shop_name)
    mock_out(:get, "products/27763452.xml")
  end

  test "create line item property booking" do
    setup_shop_order_job 3

    mock_session do
      assert_not_nil ShopifyAPI::Order.find(@order_id), "mock order file doesn't exist"

      assert_difference "Booking.count" do
        ::OrderCreateJob2.new(@shop.id, @order_id).perform
      end

      booking = Booking.find_by_order_id(@order_id)
      assert_not_nil booking, "no booking created with order id #{@order_id}"
      assert_not_empty booking.booking_items, "no booking items created"
      assert_not_empty booking.booking_names "no booking names created"
    end
  end

  test "illegal shop does not create a booking" do
    assert_no_difference "Booking.count" do
      ::OrderCreateJob2.new(6474637, 444).perform
    end
  end

  test "POS or Mobile source type from Shopify does not create a booking" do
    setup_shop_order_job 544
    assert_no_difference "Booking.count" do
      ::OrderCreateJob2.new(@shop.id, @order_id).perform
    end
  end

  test "Order with ignored variant does not create a booking" do
    setup_shop_order_job 544
    mock_out(:get, "variants/65985862.xml")
    mock_out(:post, "variants/65985862/metafields.xml")
    FakeWeb.register_uri(:post, "https://#{@shop.subdomain}.myshopify.com/admin/products/27763452/metafields.xml", {:body => "",  :status => ["200", "Ok"]})

    variant = Variant.find_by_external_id(65985862)
    variant.ignore = true
    variant.save
    variant.reload

    assert_no_difference "Booking.count" do
      ::OrderCreateJob2.new(@shop.id, @order_id).perform
    end
  end

  test "An existing booking on the system does not create a booking" do
    setup_shop_order_job 123132311
    assert_no_difference "Booking.count" do
      ::OrderCreateJob2.new(@shop.id, @order_id).perform
    end
  end

  test "Deleted order does not create a booking" do
    FakeWeb.register_uri(:get, "https://test.myshopify.com/admin/orders/545.xml", {:body => "Post not found",  :status => ["404", "Not Found"]})
    assert_no_difference "Booking.count" do
      ::OrderCreateJob2.new(1, 545).perform
    end
  end

  test "A booking gets created just like the good old days" do
    setup_shop_order_job 444
    mock_session do
      assert_difference "Booking.count" do
        ::OrderCreateJob2.new(@shop.id, @order_id).perform
      end
    end

    booking = Booking.find_by_order_id(@order_id)

    parsed_date = Chronic.parse('2012-10-08', {:now => ActiveSupport::TimeZone.new(@shop.timezone).now})
    assert_equal parsed_date, booking.start, "wrong start date for booking.start"
    assert_equal 2, booking.booking_names.count

    booking_name = booking.booking_names.first
    assert_equal 'Guy One', booking_name.name, 'wrong booking name'

    booking_name = booking.booking_names.last
    assert_equal 'Gal Two', booking_name.name, 'wrong booking name'
  end

  test "inproper input from finish gets triggered" do
    setup_shop_order_job 446
    mock_session do
      assert_difference "Booking.count" do
        ::OrderCreateJob2.new(@shop.id, @order_id).perform
      end
    end
  end

  # test "3 different types in one order trigger a Booking, a .incomplete and Nothing(not a part of the system)" do
  #   setup_shop_order_job 447
  #   mock_session do
  #     assert_difference "Booking.count", 2 do
  #       OrderCreateJob2.new(@shop.id, @order_id).perform
  #     end
  #   end
  # end

  # test "same as above just for incomplete status" do
  #   setup_shop_order_job 447
  #   mock_session do
  #     assert_difference "Booking.incomplete.count" do
  #       OrderCreateJob2.new(@shop.id, @order_id).perform
  #     end
  #   end
  # end

  # test "DJ can change a Reservation into a Booking" do
  #   setup_shop_order_job 1212 # remember that all cart tokens must match the event if you change order numberhere or in xml
  #   mock_session do
  #     assert_difference "Reservation.count", -1  do
  #      OrderCreateJob2.new(@shop.id, @order_id).perform
  #     end
  #   end
  # end

  # test "create order not booking" do
  #   setup_shop_order_job 3
  #   mock_session do
  #     OrderCreateJob.new(@shop.id, @order_id).perform
  #     assert_not_nil ShopifyAPI::Order.find(@order_id), "mock order find failed"
  #     booking = Order.find_by_order_id(@order_id)
  #     assert_not_nil booking, "no booking created"
  #   end
  # end


  test "rollbar 180 split for nil" do
    setup_shop_order_job 152152
    mock_session do
      OrderCreateJob2.new(@shop.id, @order_id).perform
      assert_equal Booking.where(:order_id => @order_id).count, 2, "2 bookings should have been created"
    end
  end

  test "consolidated booking" do
    setup_shop_order_job 152153, 'hawaii' # 2 line items, hawaii shop has consolidate_bookings = false
    mock_session do
      OrderCreateJob2.new(@shop.id, @order_id).perform
      assert_equal 2, Booking.where(:order_id => @order_id).count, "2 bookings should have been created"
    end
  end

  test "ticket 6291: order with multiple products with different dates" do
    #
    # multi product, each line item has different dates
    #
    # line item 1: March 1 - March 7
    # line item 2: March 5 - March 9
    #
    setup_shop_order_job 152154 # 2 line items
    mock_session do
      OrderCreateJob2.new(@shop.id, @order_id).perform

      booking = Booking.find_by_order_id(@order_id)
      assert_equal 2, booking.booking_items.count, "2 booking items should have been created"

      bi_1 = booking.booking_items.first
      assert_equal bi_1.start, DateTime.new(2016,3,1,0,0,0)
      assert_equal bi_1.finish, DateTime.new(2016,3,7,0,0,0)

      bi_2 = booking.booking_items.last
      assert_equal bi_2.start, DateTime.new(2016,3,5,0,0,0)
      assert_equal bi_2.finish, DateTime.new(2016,3,9,0,0,0)

      assert_equal booking.start, DateTime.new(2016,3,1,0,0,0)
      assert_equal booking.finish, DateTime.new(2016,3,9,0,0,0)
    end
  end

  test "resource is allocated" do
    setup_shop_order_job 152155 # 1 line item where the product capacity type == 2
    mock_session do
      OrderCreateJob2.new(@shop.id, @order_id).perform
      booking = Booking.find_by_order_id(@order_id)
      assert_not_nil booking, "booking wasn't created"
      booking_item = booking.booking_items.first
      assert_not_nil booking_item, "booking item wasn't created"
      assert_equal 1, booking_item.resources.count, "1 resource should have been assigned"
      assert_equal booking_item.resources.first, resources(:four)
    end
  end

  test "ticket 7025: invalid finish date when finish-time property exists" do
    setup_shop_order_job 7025

    mock_session do
      OrderCreateJob2.new(@shop.id, @order_id).perform
    end

    booking = Booking.find_by_order_id(7025)

    assert_not_nil booking, "booking wasn't created"
    assert_equal DateTime.new(2015, 7, 30, 6, 0, 0), booking.start, "wrong start date for booking.start"
    assert_equal DateTime.new(2015, 7, 31, 12, 0, 0), booking.finish, "wrong start date for booking.finish"
  end

  test "booking dates correct when order has start date/time and finish date/time properties" do
    setup_shop_order_job 7026

    mock_session do
      ::OrderCreateJob2.new(@shop.id, @order_id).perform
    end

    booking = Booking.find_by_order_id(7026)

    assert_not_nil booking, "booking wasn't created"
    assert_equal DateTime.new(2016, 3, 17, 7, 0, 0), booking.start, "wrong datetime for booking.start"
    assert_equal DateTime.new(2016, 3, 17, 11, 0, 0), booking.finish, "wrong datetme for booking.finish"
  end

  test "ticket 9015: booking with 'Service Date' as the line item property name" do
    setup_shop_order_job 7027

    mock_session do
      OrderCreateJob2.new(@shop.id, @order_id).perform
    end

    booking = Booking.find_by_order_id(7027)

    assert_not_nil booking, "booking wasn't created"
    assert_equal DateTime.new(2016, 3, 17, 0, 0, 0), booking.start, "wrong datetime for booking.start"
  end
end
