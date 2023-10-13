# -*- coding: utf-8 -*-
require 'test_helper'
require 'time'

class SessionsControllerTest < ActionController::TestCase
  def do_the_show(shopname = "newshop")
    mock_shop_for_session
    mock_new_session_routes
    mock_post_shop_metafields("newshop")
    request.env["omniauth.auth"] = {"credentials" => {"token" => "mcukcuckcuck"}}
    get :show, {shop: "#{shopname}.myshopify.com"}
  end
  test "gets new" do
    get :new
    assert_response :success
  end
  test "passes rollbar 215" do
    post :new, {
      "shop" => "butler&taylor",
      "utf8" => "",
      "controller" => "sessions",
      "action" => "create",
      "commit" => "Sign In"
    }
    assert_redirected_to "/auth/shopify?shop=butler-taylor.myshopify.com"
  end
  test "something shows for show when nothing is passed" do
    get :show
    assert_redirected_to :login
  end
  test "successful show" do
    do_the_show
    assert_redirected_to "http://newshop.test.host/events#guider=first"
  end
  test "can log out" do
    delete :destroy
    assert_redirected_to login_url(subdomain: "www")
  end
  test 'new shop gets added' do
    assert_difference "Shop.count" do
      do_the_show
    end
  end
end
