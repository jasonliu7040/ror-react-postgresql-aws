require 'test_helper'

class OrdersControllerTest < ActionController::TestCase
  setup do
    set_shopify_session
  end

  test "should get index" do
    skip "you pasted the bookings controller in there, but we need a 'view' that mimics eventsController"
    # get :index
    # assert_response :success
  end

  # test "should not get index if logged out" do
  #   sign_out_shopify
  #   get :index
  #   assert_response :redirect
  # end

  # test "should get new" do
  #   get :new
  #   assert_response :success
  # end

  # test "should get show" do
  #   get :show, {:id => events(:order_all_four).id}
  #   assert_response :success
  # end

end
