require 'test_helper'

class EventsControllerTest < ActionController::TestCase
  setup do
    set_shopify_session
    @start = Time.now.utc
    @finish = @start.advance(:months => 1)
    @parmas = {:product => 1, :start => @start.strftime('%Y-%m-%d'), :end => @finish.strftime('%Y-%m-%d'), :format => :json}
  end

  test 'index with no params passes for json' do
    get :index, :format => :json
    assert_response :success
  end

  test 'gives all product booking items and blackouts when no filter by product id' do
    get :index,  {:product => '', :start => @start.strftime('%Y-%m-%d'), :end => @finish.strftime('%Y-%m-%d'), :format => :json}
    assert_response :success
    assert_equal 16, assigns(:results).count #may need to adjust as bookings/blackouts added.
  end

  test 'index with no params passes for html' do
    get :index
    assert_response :success
  end

  test 'index success with params' do
    get :index, @parmas
    assert_response :success
  end
end
