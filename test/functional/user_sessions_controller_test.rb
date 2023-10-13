require 'test_helper'
class Users::SessionsControllerTest < ActionController::TestCase
  setup do
    @shop = shops(:test)
    @request.host = "#{@shop.subdomain}.bookthatapp.dev"
    @request.env["devise.mapping"] = Devise.mappings[:user]
  end

  test "should get registrations new" do
    get :new
    assert_response :success
  end
  # test "post here" do
  #   post :create, {"user"=>{"email"=>"gavin@shopifyconcierge.com", "name"=>"Gavin Terrill", "title"=>"President", "password"=>"[FILTERED]", "password_confirmation"=>"[FILTERED]", "role_id" => 1}, "commit"=>"Sign up"}
  #   assert_equal 1, User.order(:id).last.shop_id
  #   assert_equal 1, User.order(:id).last.role_id
  # end
end
