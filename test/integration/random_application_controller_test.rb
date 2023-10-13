require 'test_helper'

class RandomApplicationControllerTest < ActionDispatch::IntegrationTest
  fixtures :all

  test "gets 404 page" do
    get "/ramndom"
    assert_response 404
  end
end
