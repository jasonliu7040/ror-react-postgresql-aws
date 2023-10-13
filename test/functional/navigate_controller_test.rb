require 'test_helper'

class NavigateControllerTest < ActionController::TestCase
  setup do
    @request.host = "www.bookthatapp.dev"
    @request.session[:shopify] = ShopifyAPI::Session.new(@request.host)
  end
  test "should not get bookings" do
    @request.host = "next.bookthatapp.dev"
    @request.session[:shopify] = ShopifyAPI::Session.new(@request.host)

    get :bookings
    assert_response 503 # :success
  end

  test "should assign action items" do
    @request.host = "next.bookthatapp.dev"
    @request.session[:shopify] = ShopifyAPI::Session.new(@request.host)

    get :products, {id: 363166581, shop: "test.myshopify.com"}
    assert_response 503
  end

  test "should redirect to the calendar page when asked to view a bookings that doesn't exist" do
    get :bookings, {id: -1, shop: "test.myshopify.com"}
    assert_redirected_to "http://test.lvh.me/events" # :success
  end

  test "should get products edit url on redirect" do
    get :products, {id: 1, shop: "test.myshopify.com"}
    assert_redirected_to "http://test.lvh.me/products/1/edit"
  end

  test "should get products url if no real product" do
    get :products, {id: 112123, shop: "test.myshopify.com"}
    assert_redirected_to "http://test.lvh.me/products"
  end

  test "should get bookings as the url for a correct external order" do
    get :bookings, {id: 123132311, shop: "test.myshopify.com"}
    assert_redirected_to "http://test.lvh.me/bookings/1/edit" # :success
  end
end
