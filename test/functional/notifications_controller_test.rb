require 'test_helper'

class NotificationsControllerTest < ActionController::TestCase
  setup do
    set_shopify_session
  end
  test "should get index" do
    get :index
    assert_response :success
  end

  test "should assign action items" do
    get :index
    assert_not_empty assigns(:action_items)
    assert_select "a", :attributes =>{ href: "/bookings/7/edit"}
  end
  #json was taken out
  # test "pump out all shop_notes with a limit of 6 in json" do
  #   (0..7).to_a.each {|d| @shop.shop_notes.create(:message => "Somejunk #{d}")}
  #   get :index, :format => :json
  #   assert_equal 6, assigns(:notes).count
  # end
end
