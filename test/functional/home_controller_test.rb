require 'test_helper'

class HomeControllerTest < ActionController::TestCase
  test "should get index" do
    get :index
    assert_response :success
  end

  test "should have a login to www even on a different subdomain" do
    @request.host = "meh.bookthatapp.dev"
    get :index
    assert_select "a", :attributes => {"href" => "http://www.bookthatapp.dev/login"}
  end

end
