# -*- coding: utf-8 -*-
require 'test_helper'

class OrdersControllerTest < ActionController::TestCase
#   setup do
#     set_shopify_session
#   end
#
#   def order_params(prod = "1", the_var_id= "1")
#     {"order" => {"id" => "", "items_attributes" => {"0" => {"product_id" => prod, "variant_id" => the_var_id, "all_day" => "1", "start" => "#{Date.today + 10}", "finish" => "#{Date.today + 11}", "booking_names_attributes" => {"0" => {"id" => "", "name" => "jill jilll", "email" => "jil@jill.com", "_destroy" => "false"}}}}, "order_name" => "", "sku" => "", "hotel" => "", "notes" => "book name jil jill", "status" => "1", "email" => "jilll@jill.com", "phone" => "905-555-1212", "number_in_party" => "1"}}
#   end
#
#   test "index page" do
#     get :index
#     assert_response :redirect
#   end
#
#   test "show page redirects to edit" do
#     get :show, :id => Booking.last.id
#     assert_response :redirect
#   end
#
#   test "new page displays properly" do
#     get :new
#     assert_response :success
#   end
#
#   test "pass all 3 params into new" do
#     get :new, {:all_day => true, :start => DateTime.now, :finish => DateTime.now >> 1}
#     assert_response :success
#   end
#
#   test "edit page displays properly" do
#     get :edit, :id => Booking.last.id
#     assert_response :success
#   end
#
#   test "edit page displays properly if somehow product gets deleted too" do
#     book = Booking.last
#     Product.find(book.product_id).delete
#     get :edit, :id => book.id
#     assert_response :success
#   end
#
#   test "edit page with bogus numbers resuced" do
#     get :edit, :id => 82819182999
#     assert_response :redirect
#   end
#   test "rollbar 265 is fixed" do
#     r = Booking.first
#     Product.find(r.product_id).delete
#     get :edit, {id: r.id}
#     assert_response :success
#   end
#
#   test "creating a booking works" do
#     assert_difference "Order.count" do
#       post :create, order_params
#     end
#   end
#
#   test "creating a booking doesn't work" do
#     assert_no_difference "Order.count" do
#       post :create, order_params(19999)
#     end
#   end
#
#   test "rollbar 273 passes" do
#     cleaned_up_params = order_params
#     cleaned_up_params["order"]["number_in_party"] = nil
#     post :create, cleaned_up_params
#   end
#
#   test "updating an existing booking works" do
#     put :update, {"booking" => {"id" => "5", "start" => "#{Date.today + 23}", "finish" => "#{Date.today + 24}"}}
#     assert_equal 23.day.from_now.midnight.utc, Booking.find(5).start
#   end
#
# #test blackouts here
# # test "updating an existing booking doesn't works" do
# #   put :update, {"booking"=>{"id"=>"5"}}
# #   #assert_equal 23.day.from_now.midnight.utc, Booking.find(5).start
# # end
#
#   test "updating an existing booking with delete works" do
#     put :update, {:delete => true, "booking" => {"id" => "5", "start" => "#{Date.today + 23}", "finish" => "#{Date.today + 24}"}}
#     assert_response :redirect
#   end
#
#   test "update with reminder just renders edit" do
#     put :update, {:reminder => true, "booking" => {"id" => "5", "start" => "#{Date.today + 23}", "finish" => "#{Date.today + 24}"}}
#     assert_response :success #not sure how to ensure render triggered not redirect maybe?
#   end
#
#   test "email_activity is mocked out and works" do
#     get :email_activity, {:id => 5}
#     assert_response :success
#   end
#
#   test "reminders doesn't go out without an id" do
#     get :reminder
#     assert_response 400
#   end
#
#   test "reminders doesn't go out with a bogus id" do
#     get :reminder, :id => 69
#     assert_response 404
#   end
#
#   test "reminders send successfully" do
#     mock_out :get, "shop.xml"
#     get :reminder, :id => 5
#     assert_response :success
#   end
#
#   test "get sms and send successfully" do
#     get :sms, {:id => 5, :format => :js}
#     assert_response :success
#   end
#
#   test "doesn't send sms successfully" do
#     get :sms, {:format => :js}
#     assert_response 400
#   end
#
#   test "get sms and send successfully" do
#     get :sms, {:id => 50, :format => :js}
#     assert_response 404
#   end
#
#   test "gets ticket successfully" do
#     get :ticket, :id => 5
#     assert_response :success
#   end
#
#   test "gets ticket in pdf format successfully" do
#     get :ticket, {:pp => "disable", :id => 5, :format => :pdf}
#     assert_response :success
#   end
#
#   test "gets ticket unsuccessfully" do
#     get :ticket, :id => 51
#     assert_response :redirect
#   end
end
