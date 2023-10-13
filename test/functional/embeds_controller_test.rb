require 'test_helper'

class EmbedsControllerTest < ActionController::TestCase
  setup do
    set_shopify_session
    mock_out :get, 'shop.xml'
    # filez = Rails.root.join("test/shopify_mock_fixtures/shop.xml")
    # FakeWeb.register_uri(:get, "https://test.myshopify.com/admin/shop.xml", :body => File.read(filez))
  end

  test "should get new" do
    get :new
    assert_response :success
  end

  test "should create an embed?" do
    assert_difference('Booking.count') do
      post :create, {
          items: [{variant:"2", time: "12:30", quantity: "1", product: "1", date: "28/09/2015"}],
          customers: [{phone: "4163059290", lastname:"Firefox", firstname: "After", email: "philip@ingraminternet.com"}]
      }
    end

    assert_response 200

    booking = BookingName.find_by_email("philip@ingraminternet.com").booking

    assert_equal(1, booking.booking_items.size, 'Should be 1 booking item created')
    assert_equal(1, booking.booking_names.size, 'Should be 1 booking name created')

    item = booking.booking_items.first

    assert_equal(DateTime.new(2015,9,28,12,30), item.start, 'Booking should start at 12:30')
  end
end
