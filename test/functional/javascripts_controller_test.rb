require 'test_helper'

class JavascriptsControllerTest < ActionController::TestCase
[:bta, :wizard].each do |the_action|
    test 'should assign action items' do
      set_shopify_session
      get the_action, :format => :js
      assert_response :success
      assert assigns(:settings).present?
    end

    test "should 404 #{the_action}" do
      get the_action, :format => :js
      assert_response 404
    end
  end
end
