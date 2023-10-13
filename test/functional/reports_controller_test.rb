require 'test_helper'

class ReportsControllerTest < ActionController::TestCase
  setup do
    set_shopify_session
  end

  test "should get runsheet" do
    get :runsheet
    assert_response :success
  end

  test "should get runsheet pdf successfully" do
    skip "add back after green and not slow"
    get :runsheet, format: :pdf
    assert_response :success
  end

  test "should succeed with start, finish and order name" do
    book = events(:an_hour_out)
    get :runsheet, {:start => book.start.to_s, :finish => book.finish.to_s, order_name: "#{book.order_name}", :date_type => "start"}
    assert_response :success
    assert_not_empty assigns(:bookings)
  end

  test "should give us back less bookings" do
    book = events(:an_hour_out)
    get :runsheet, {"start"=>book.start, "finish"=>"", "date_type"=>"start", "products"=>"", "variants"=>"", "order_name"=>book.order_name, "name"=>"", "order_by"=>"start", "order_type"=>"ASC"}
    assert_response :success
  end

  # TODO figure out pdf formats one of these times.
  # test "sends pdf" do
  #   book = events(:an_hour_out)
  #   get :runsheet, {:start => book.start.to_s, :finish => book.finish.to_s, order_name: book.order_name, :date_type => "finish", :format => :pdf}
  #   assert_response :success

  # end

  test "can get enrollment with no params" do
    get :enrollments
    assert_response :success
  end

  test "can get enrollments with start param and product ids" do
    # html format
    get :enrollments, {start: DateTime.now.to_s, prouducts: [15]}
    assert_response :success

    # pdf format
    get :enrollments, {start: DateTime.now.to_s, prouducts: [15], format: :pdf}
    assert_response :success

    # xls format
    get :enrollments, {start: DateTime.now.to_s, prouducts: [15], format: :xls}
    assert_response :success
  end

  test "should be output of bookings which means handles work" do
    skip ("just stopped working 11-15-2014")
    # prod = products(:hook_product)
    # get :enrollment, {start: Booking.find(6).start, handle: prod.product_handle}
    # assert_response :success
    # assert_not_empty assigns(:bookings)
  end
end
