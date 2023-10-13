require 'test_helper'

class FeedbacksControllerTest < ActionController::TestCase
  setup do
    set_shopify_session
  end

  test "should get new" do
    get :new
    assert_response :success
  end

  test "successful post" do
    assert_difference 'ActionMailer::Base.deliveries.size', 1 do
      post :create, feedback: {
                      name: 'test',
                      email: 'test@test.com',
                      subject: 'hi',
                      content: 'bai'
                  }
    end

    ActionMailer::Base.deliveries.clear

    assert_redirected_to events_path
  end

  test "failed post" do
    post :create, feedback: {
                    name: '',
                    email: '',
                    subject: '',
                    content: ''
                }

    assert_not_nil assigns(:feedback).errors
  end
end
