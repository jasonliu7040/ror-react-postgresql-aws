require 'test_helper'
require 'time'

class AvailabilityControllerTest < ActionController::TestCase
  setup do
    @request.host = "#{shops(:test).subdomain}.bookthatapp.dev"
    @start = Time.now.utc + 1.day
    @finish = @start.advance(:months => 1)
    @parmas = {:products => '1', :start => iso_date_format(@start), :finish => iso_date_format(@finish)}
  end

  test 'index with no params' do
    get :index, :format => :json
    assert_response :bad_request, 'Expected 400 when start parm not specified'
  end

  test 'index success with params' do
    get :index, @parmas, :format => :json
    assert_response :success
  end

  test 'scheduled product with params is a success' do
    get :index, {:products => 7, start: iso_date_format(@start), finish: iso_date_format(@finish)}, :format => :json
    assert_response :success
  end

  test 'rollbar 157; make it not error on advance' do
    get :index, {
        'controller' => 'availability',
        'action' => 'index',
        'start' => 'Invalid Date',
        'end' => 'Invalid Date',
        'products' => '351090413,351090421,351090401'
    }
    assert_response 400
  end

  test 'json decoding on index' do
    parmas = @parmas.merge({:format => :json})
    get :index, parmas
    json = ActiveSupport::JSON.decode @response.body
    assert json['products'][0]['bookings'].size > 0, 'want to make sure something is booked'
    assert_not_nil json['blackouts']
  end

  test 'index with bookings' do
    params = {:products => 7, start: iso_date_format(@start), finish: iso_date_format(@finish)}
    get :index, params, :format => :json
    assert_response :success
  end

  test 'index with bookings' do
    finish = @finish + 90.days
    prod_id = products(:blackout_product).external_id
    params = {:products => prod_id.to_s, start: iso_date_format(@start), :finish => iso_date_format(finish), format: :json}

    get :index, params
    s = json
    assert_equal 6, s['blackouts'].count, 'Should be 4 global, 1 product, 1 variant. As a sanity check, we left one way in the future so it wouldnt trigger this' # adjust if fixtures change #controller is hard coded at 2months forward from start.
  end

  test 'index with end param' do
    params = {:products => 7, start: iso_date_format(@start), finish: iso_date_format(@finish)}
    get :index, params, :format => :json
    assert_response :success
  end

  test 'index with bad end param gets false' do
    params = {:products => 7, start: iso_date_format(@start), finish: iso_date_format(@finish)}
    get :index, params, :format => :json
    assert_response :success
  end

  test 'get to capacity does something successful' do
    finish = @start.advance(:days => 1)
    get :capacity, {:variants => "[{\"variant\":1,\"start\":\"#{@start.iso8601}\",\"finish\":\"#{finish.iso8601}\", \"quantity\":1}]", :format => :json}
    assert_response :success
  end

  test 'gets bad variants in capacity' do
    finish = @start.advance(:days => 1)
    get :capacity, {:variants => "[{\"variant\":169,\"start\":\"\",\"finish\":\"#{finish.iso8601}\", \"quantity\":1}]", :format => :json}
    assert_response :success
  end

  test 'no variants in capacity' do
    get :capacity, {:format => :json}
    assert_response 403
  end

  test 'gets the schedule successfully' do
    external_id = products(:scheduled_daily_product).external_id
    params = {
        :products => [external_id],
        :finish => iso_date_format(@finish),
        :start => iso_date_format(@start)
    }
    get :schedule, params.merge!({format: :json})
    assert_response :success
    resp = json

    counts = resp['schedule'].map { |d| d['bookingCount'][0] }

    # if ever the booking count for product 7 change assertion value
    # - find bookings by running this: BookingItem.joins(:product).where('start < ? and finish > ?', @finish, @start).where(products: {external_id: 7})
    assert_equal 3, counts.sum
  end

  test 'blocks a bad subdomain' do
    @request.host = 'badbadbad.bookthatapp.dev'
    params = {:products => [7], start: iso_date_format(@start), finish: iso_date_format(@finish)}
    get :schedule, params.merge!({:format => :json})
    assert_response :redirect
  end

  test 'successful schedule with location' do
    params = {:products => [7], start: iso_date_format(@start), finish: iso_date_format(@finish), :location => '1'}
    get :schedule, params.merge!({:format => :json})
    assert_response :success
  end

  test 'successful schedule with resource' do
    params = {:products => [7], start: iso_date_format(@start), finish: iso_date_format(@finish), :resource => '1'}
    get :schedule, params.merge!({:format => :json})
    assert_response :success
  end

  test 'gets the schedule with handle successfully' do
    params = {:products => [7], start: iso_date_format(@start), finish: iso_date_format(@finish), :handle => 'scheduled-daily-product'}
    get :schedule, params.merge!({:format => :json})
    assert_response :success
  end

  test 'gets the schedule with variant successfully' do
    params = {:products => [7], :variant => 666, start: iso_date_format(@start), finish: iso_date_format(@finish)}
    get :schedule, params.merge!({:format => :json})
    json_resp = json
    assert json_resp['schedule'][0]['start'].is_a?(Array), 'Should be an array'
    assert_response :success
  end

  test 'no products in array gets successfully still' do
    params = {:product => [], start: iso_date_format(@start), finish: iso_date_format(@finish)}
    get :schedule, params.merge!({:format => :json})
    assert_response :success
  end

  test 'no product and a referer does something good' do
    params = {:product => [], start: iso_date_format(@start), finish: iso_date_format(@finish)}
    get :schedule, params.merge!({:format => :json}), {'HTTP_REFERER' => 'http://test.bookthatapp.dev/products/1'}
    assert_response :success
  end

  test 'json with bad date format returns some kind of error message' do
    get :schedule, {'callback' => 'jQuery18302866429244168103_1415232000020', 'start' => 'Invalid Date', 'end' => 'Invalid Date', '_' => '1415232000000', :format => :json}
    assert_response 404
  end

  test 'ical shows up in schedule' do
    get :schedule, {:format => :ics}
    assert_response :success
    assert assigns(:calendar_output).present?
  end

  test 'one off product in schedule successfully' do
    meh = events(:shop_one_prod_four)
    params = {:products => [6], :start => iso_date_format(meh.start), :finish => iso_date_format(meh.finish)}
    get :schedule, params.merge!({:format => :json})
    assert_response :success
  end

  test 'get the preview successfully' do
    today = iso_date_format(Date.today)
    params = {start: iso_date_format(@start), :duration => 720, :dates => iso_date_format(@start + 1.day), :schedule => CGI.unescape("%3Astart_date%3A+#{today}+12%3A00%3A00+Z%0A%3Aduration%3A+720%0A%3Arrules%3A%0A-+%3Avalidations%3A%0A++%3Arule_type%3A+IceCube%3A%3AMinutelyRule%0A++%3Ainterval%3A+12%0A++%3Auntil%3A++#{today}+14%3A00%3A00+Z%0A%3Aexrules%3A+%5B%5D"), :title => 'fake', :format => :json}
    get :preview, params
    assert_response :success
  end
end
