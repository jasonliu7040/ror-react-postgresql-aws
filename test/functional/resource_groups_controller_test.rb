# coding: utf-8
require 'test_helper'

class ResourceGroupsControllerTest < ActionController::TestCase
  setup do
    set_shopify_session
    @resource_group = resource_groups(:one)
    @resource = resources(:three)
  end

  test "should get index" do
    get :index
    assert_response :success
    assert_not_nil assigns(:resource_groups)
  end

  test "should get new" do
    get :new
    assert_response :success
  end

  test "should create resource_group" do
    assert_difference('ResourceGroup.count') do
      post :create, {resource_group: { description: @resource_group.description, name: @resource_group.name }, :resource_id => resources(:one).id}
    end

    assert_redirected_to resource_group_path(assigns(:resource_group))
  end
  test "should create resource_group with real world params" do
    assert_difference('ResourceGroup.count') do
      post :create, {"utf8"=>"✓", "authenticity_token"=>"01ICQ23rQz8Idq2KELxrTpC3oKzuZVI5qqFRSXma4rI=", "resource_group"=>{"name"=>"Coderz", "description"=>"Coderz"}, "resource_id"=>resources(:one).id, "commit"=>"Create Resource group"}
    end

    assert_redirected_to resource_group_path(assigns(:resource_group))
  end

  test "should get edit" do
    get :edit, id: @resource_group
    assert_response :success
    assert_select "option", :attributes => {:value => @resource.id}
  end

  test "should update resource_group" do
    put :update, id: @resource_group, resource_group: { description: @resource_group.description, name: @resource_group.name }
    assert_redirected_to resource_groups_path
  end

  test "should destroy resource_group" do
    assert_difference('ResourceGroup.count', -1) do
      delete :destroy, id: @resource_group
    end

    assert_redirected_to resource_groups_path
  end
end
