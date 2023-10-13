require 'test_helper'

class SettingsControllerTest < ActionController::TestCase
  setup do
    set_shopify_session
    mock_out :get, 'shop.xml'
    @shop = shops(:test)
  end

  test 'should get index' do
    mock_out :get, "script_tags.xml"
    mock_out :get, "webhooks.xml"
    get :index
    assert_response :success
  end

  test 'update the settings' do
    put :update, {:shop => {:id => @shop.id, :settings => {'message_blacked_out' => "No Bookings Here"}}}
    assert_equal 0, @shop.errors.count
  end

# this is here to remind me that we can't hit that else no matter what (i don't think)
  test 'rollbar 164 doesnt blow up' do
    assert_raises ActionController::ParameterMissing do
      get :update, {}
    end

  end

  test 'not one setting gets updated' do
    skip "update attribute takes anything so you'll always update it's stuff, till we find another way to do thing"
    # assert_no_difference "ShopNote.count" do
    #   put :update, {:shop => {:id => @shop.id}}
    # end
  end

  test 'successful update hours also sets ShopNote' do
    put :update_hours, {:shop => {:id => @shop.id, :opening_hours => "{\"seasons\":[{\"name\":\"All Year\",\"id\":\"all-year\",\"start\":\"2014-01-01\",\"finish\":\"2014-12-31\",\"days\":[{\"day\":0,\"hours\":[]},{\"day\":1,\"hours\":[{\"from\":{\"hour\":\"9\",\"minute\":\"0\"},\"to\":{\"hour\":\"17\",\"minute\":\"0\"}}]},{\"day\":2,\"hours\":[{\"from\":{\"hour\":\"9\",\"minute\":\"0\"},\"to\":{\"hour\":\"17\",\"minute\":\"0\"}}]},{\"day\":3,\"hours\":[{\"from\":{\"hour\":\"9\",\"minute\":\"0\"},\"to\":{\"hour\":\"17\",\"minute\":\"0\"}}]},{\"day\":4,\"hours\":[{\"from\":{\"hour\":\"9\",\"minute\":\"0\"},\"to\":{\"hour\":\"17\",\"minute\":\"0\"}}]},{\"day\":5,\"hours\":[{\"from\":{\"hour\":\"9\",\"minute\":\"0\"},\"to\":{\"hour\":\"17\",\"minute\":\"0\"}}]},{\"day\":6,\"hours\":[]}]}]}"}}
    assert_equal 0, @shop.errors.count
  end
end
