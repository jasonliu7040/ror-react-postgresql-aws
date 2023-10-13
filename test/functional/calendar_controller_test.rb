require 'test_helper'

class CalendarControllerTest < ActionController::TestCase
  test "should 404 for www requests" do
    get :index
    assert_response :not_found
  end

  test "should get index" do
    @request.host = "test.bookthatapp.dev"
    get :index
    assert_response :success
  end

  test "ical shows up in schedule" do
    @request.host = "test.bookthatapp.dev"
    mock_out :get, "shop.xml"
    get :index, {:format => :ics}
    assert_response :success
    assert assigns(:calendar_output).present?
  end
end
