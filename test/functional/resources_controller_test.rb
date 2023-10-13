require 'test_helper'

class ResourcesControllerTest < ActionController::TestCase
  setup do
    @resource = resources(:one)
    set_shopify_session
  end

  test "should get index" do
    get :index
    assert_response :success
    assert_not_nil assigns(:resources)
  end

  test "should get index json" do
    get :index, format: :json
    assert_response :success
    assert_not_nil assigns(:resources)
  end

  test "should get new" do
    get :new
    assert_response :success
    # assert_tag tag: "option", :attributes => {:value => 1}
    # assert_tag tag: "option", :attributes => {:value => "Staff"}
  end

  test "should create resource" do
    assert_difference('Resource.count') do
      post :create, resource: { description: @resource.description, name: @resource.name, resource_type: @resource.resource_type, user_id: @resource.user_id }
    end

    assert_redirected_to resources_path
  end

  test "should get edit" do
    get :edit, id: @resource
    assert_response :success
  end

  test "should update resource" do
    put :update, id: @resource, resource: { description: @resource.description, name: @resource.name, resource_type: @resource.resource_type, user_id: @resource.user_id }
    assert_redirected_to resources_path
  end

  test "should destroy resource" do
    assert_difference('Resource.count', -1) do
      delete :destroy, id: @resource
    end

    assert_redirected_to resources_path
  end
end
