require 'test_helper'
require 'time'

class ProxyControllerTest < ActionController::TestCase
  setup do
    set_shopify_session
    mock_out(:get, 'shop.xml')
  end

  def times
    start = Time.now.utc
    finish = start.advance(:months => 1)
    return start, finish
  end

  test 'index' do
    start, finish = times
    get :index, {:shop => 'test', :start => start.strftime('%Y-%m-%d'), :finish => finish.strftime('%Y-%m-%d')}
    assert_response :success
  end

  test 'index with query param is successfully' do
    start, finish = times
    get :index, {:shop => 'test', :start => start.strftime('%Y-%m-%d'), :finish => finish.strftime('%Y-%m-%d'), 'q' => 'one_product'}
    assert_response :success
  end
  
  test 'make sure the other accounts products dont show up' do
    start, finish = times
    get :index, {:shop => 'test', :start => start.strftime('%Y-%m-%d'), :finish => finish.strftime('%Y-%m-%d')}
    # i put puts instead and it worked, not sure how to get it yet.
  end
  
  test 'doesnt error if start is blank' do
    get :index, {:shop => 'test', 'booking-start'=>''}
    assert_response :success
  end

  test 'proxy products sends 410 not used' do
    #http://legros-parker-and-harris6290.bookthatapp.dev:3002/proxy/products?shop=legros-parker-and-harris6290&booking-start=&booking-finish=
    get :products, {shop: 'test', 'booking-start': '', 'booking-finish': ''}
    assert_response 410
  end

  test 'proxy search successfully' do
    get :search, {shop: 'test.myshopify.com', path_prefix: '/apps/bookthatapp'}
    assert_response :success
  end

  test 'proxy search does not succeed and kicks error' do
    get :search, {shop: 'testes.myshopify.com', path_prefix: '/apps/bookthatapp'}
    assert_response 404
    assert_nil assigns(:shop)
  end

  test 'proxy product does not succeed and kicks error' do
    get :products, {shop: 'testes.myshopify.com', path_prefix: '/apps/bookthatapp'}
    assert_response 404
    assert_nil assigns(:bookings)
  end

  test 'proxy customer successful' do
    get :customer, {shop: 'test.myshopify.com', :id => 1, path_prefix: '/apps/bookthatapp'}
    assert_response :success
  end

  test 'proxy customer 412 if no id passed but shop exists' do
    get :customer, {shop: 'test.myshopify.com', path_prefix: '/apps/bookthatapp'}
    assert_response 412
  end

  test 'proxy email successful' do
    get :email, {shop: 'test.myshopify.com',:id => 1, path_prefix: '/apps/bookthatapp'}
    assert_response :success
  end

  test 'proxy calendar successful with prod' do
    get :calendar, {shop: 'test.myshopify.com', handle: 'hook-product', path_prefix: '/apps/bookthatapp'}
    assert_response :success
  end

  test 'proxy calendar successful with prod and variant' do
    get :calendar, {shop: 'test.myshopify.com', handle: 'hook-product', path_prefix: '/apps/bookthatapp', variant: 65985862}
    assert_response :success
  end
  
  test 'proxy calendar successful with no product params' do
    get :calendar, {shop: 'test.myshopify.com', path_prefix: '/apps/bookthatapp'}
    assert_response :success
  end
end
