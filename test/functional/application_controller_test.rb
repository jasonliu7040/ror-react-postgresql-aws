require 'test_helper'

class NotificationsControllerTest < ActionController::TestCase
  test "get index with fake subdomain" do
    @request.host = "fakesubdomain.bookthatapp.dev"
    get :index
    assert_redirected_to "http://www.bookthatapp.dev/"
  end

  test "logged in user to test can't see admin.bta.dev" do
    @shop = shops(:test)
    @request.host = "hawaii.bookthatapp.dev"
    @request.session[:shopify] = ShopifyAPI::Session.new("test.bookthatapp.dev")
    get :index
    assert_redirected_to "http://www.bookthatapp.dev/"
  end

  test "logged in user to test can be used as an admin" do
    set_shopify_session :legros
    @request.host = "test.bookthatapp.dev"
    get :index
    assert_response :success
  end

  test "make a route that throws errors to test this stuff?" do
    skip "somehow find response and see what 'code' they want"
    # set_shopify_session
    # get :throw, ce: true
    # assert_redirected_to "/"
  end
end

class ProductsControllerTest < ActionController::TestCase
  test "users whom aren't logged in and try to get to a valid route works by redirecting them" do
    @request.host = "test.bookthatapp.dev"
    session[:shopify] = ""
    get :edit, {id: products(:product1).id}
    assert_redirected_to "http://www.bookthatapp.dev/"
  end
end
