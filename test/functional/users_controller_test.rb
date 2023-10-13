require 'test_helper'

class UsersControllerTest < ActionController::TestCase
  setup do
    set_shopify_session
  end
  test "should get index" do
    get :index
    all_users = assigns(:users)
    assert_response :success
    assert all_users.present? && all_users.count < User.count, "Should have less users then total Users, assuming that there fixtures use different shop_id's and you mixed it up"
    assert_select "td", :content => "Staff"
  end

  test "should get edit" do
    get :edit, {id: users(:one).id }
    assert_response :success
  end
  test "should update" do
    user = users(:one)
    get :update, {id: user.id, :user => {
                                  name: "Philip Jones", email: user.email}}
    assert_redirected_to user_path(user)
    assert_equal "Philip Jones", assigns(:user).name
  end
  test "should not update" do
    user = users(:one)
    get :update, {id: user.id, :user => {
                                  name: "Philip Jones", email: ""}}
    assert_response :success
  end
end
