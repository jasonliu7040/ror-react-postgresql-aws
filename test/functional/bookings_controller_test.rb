require 'test_helper'

class BookingsControllerTest < ActionController::TestCase
  setup do
    mock_out :get, 'shop.xml'
    set_shopify_session
  end

  test 'index page' do
    get :index
    assert_response :redirect
  end

  test 'new page displays properly' do
    get :new
    assert_response :success
  end

  test 'pass all 3 params into new' do
    get :new, {:all_day => true, :start => DateTime.now, :finish => DateTime.now >> 1}
    assert_response :success
  end

  test 'edit page displays properly' do
    get :edit, :id => Booking.last.id
    assert_response :success
  end

  test 'edit page displays properly if somehow product gets deleted too' do
    booking = events(:class_with_enrollments_booking)
    item = booking.booking_items.first
    Product.find(item.product_id).delete
    get :edit, :id => Booking.last.id
    assert_response :success
  end

  test 'edit page with bogus numbers resuced' do
    get :edit, :id => 82819182999
    assert_response :redirect
  end

  test 'creating a booking works' do
    # this endpoint is invoked because an order name is supplied and it is trying to find the corresponding order id
    FakeWeb.register_uri(:get, 'https://test.myshopify.com/admin/orders.xml?name=%231001', {})

    assert_difference "Booking.count" do
      post :create,
           {"booking"=>
                {"id"=>"", "order_name"=>"1001", "status"=>"2", "email"=>"testing_customer@nothere.com", "phone"=>"", "number_in_party"=>"1",
                 "booking_names_attributes"=>
                     {"1407804571448"=>
                          {"id"=>"", "name"=>"Testing User", "email"=>"test@test.com", "_destroy"=>"false"}
                     },
                 "booking_items_attributes"=>
                     {"1407804571449"=>
                          {"id"=>"", "shop_id"=>"1", "start"=>"#{Date.today + 10}", "finish"=>"#{Date.today + 11}", "product_id"=>"1", "variant_id"=>"1", "quantity"=> "1", "_destroy"=>"false"}
                     }
                }, "ga_client_id"=>"977038110.1406590004", "commit"=>"Save"}
    end
  end

  test 'creating a booking doesnt work' do
    assert_no_difference "Booking.count" do
      # missing booking item lines
      post :create,
           {"booking"=>
                {"id"=>"", "all_day"=>"1", "start"=>"#{Date.today + 10}", "finish"=>"#{Date.today + 11}", "order_name"=>"", "sku"=>"", "hotel"=>"", "notes"=>"", "status"=>"2", "name" => "test customer", "email"=>"testing_customer@nothere.com", "phone"=>"", "number_in_party"=>"1"}, "ga_client_id"=>"977038110.1406590004", "commit"=>"Save"
           }
    end
  end

  test 'destroying a booking works' do
    booking = events(:shop_one_prod_one)
    assert_difference('Booking.count', -1) do
      put :update, {id: booking.id, booking: {id: booking.id}, delete: true}
    end
    assert_redirected_to events_path
  end

  test 'email_activity is mocked out and works' do
    get :email_activity, {:id => 5}
    assert_response :success
  end

  # test 'reminders doesnt go out without an id' do
  #   get :reminder
  #   assert_response 400
  # end
  #
  test 'reminders successfully' do
    get :reminder, :id => 5
    assert_response :success
  end

  test 'get sms and send successfully' do
    get :sms, {:id => 5, :format => :js}
    assert_response :success
  end

  test 'get sms and send successfully' do
    get :sms, {:id => 50, :format => :js}
    assert_response 404
  end

  test 'gets ticket successfully' do
    get :ticket, :id => 5
    assert_response :success
  end

  test 'gets ticket in pdf format successfully' do
    get :ticket, {:pp => "disable", :id => 5, :format => :pdf}
    assert_response :success
  end

  test 'gets ticket unsuccessfully' do
    get :ticket, :id => 51
    assert_response :redirect
  end
end
