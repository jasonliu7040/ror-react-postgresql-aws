require 'test_helper'

class LoginControllerTest < ActionController::TestCase
  test "remove this controller when safe to do so" do
    skip "remove login controller as sessions controller has all the routes and login controller isn't in the routes. Can't' test in dev, so need to in production first."
  end
  # test "logout works" do
  #   set_shopify_session
  #   get :logout
  #   assert_redirected_to controller: "login", action: "index"
  # end
end
