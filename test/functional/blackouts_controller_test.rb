require 'test_helper'

class BlackoutsControllerTest < ActionController::TestCase
  setup do
    set_shopify_session
  end

  test 'should get index' do
    get :new
    assert_response :success
  end

  test 'should create a blackout' do
    now = Date.today + 96.days
    the_finish = now + 1.days
    post :create, {blackout: {id: '', product_id: '', variant_id: '', all_day: '1', start: "#{now}", finish: "#{the_finish}"}}
    assert_redirected_to events_url
    assert Blackout.last.finish.min == 59, "Should be just before midnight, but is #{Blackout.last.finish}"
  end

  test 'should not create a global blackout' do
    post :create, {blackout: {finish: Time.now + 1.day}}
    assert_select 'h2', content: 'Create Blackout Date'
  end

  test 'should not create a blackout' do
    post :create, {blackout: {finish: Time.now + 1.day, product_id: products(:product1).id}}
    assert_select "h2", content: "Create Blackout Date"
  end

  test 'should not create a blackout' do
    prod = products(:product1)
    post :create, {blackout: {finish: Time.now + 1.day, product_id: prod.id, variant_id: prod.variants.first.id}}
    assert_select 'h2', content: 'Create Blackout Date'
  end

  test 'should get edit in blackout' do
    get :edit, id: event_dates(:two).id
    assert_response :success
  end

  test 'should not get edit in blackout' do
    get :edit, id: products(:blackout_product).id
    assert_redirected_to events_url
  end

  test 'should update a blackout' do
    put :update, {id: event_dates(:two).id, blackout: {id: event_dates(:two).id, start: Time.now + 3.day, finish: Time.now + 4.day}}
    assert_redirected_to events_url
  end

  test 'should not update a blackout' do
    put :update, {id: event_dates(:two).id, blackout: {id: event_dates(:two).id, start: '', finish: Time.now + 4.day}}
    assert_select 'h2', content: 'Edit Blackout Date'
  end

  test 'should not update a blackout that clashes with another of the same type' do
    skip 'removed to be added later'
    # two = event_dates(:two)
    # one = event_dates(:blackout_one)
    # put :update, {id: event_dates(:two).id, blackout: {id: event_dates(:two).id, start: one.start, finish: one.finish}}
    # assert_tag :tag => 'h2', content: 'Edit Blackout Date'
  end

  test 'an old blackout gets converted to a new EventDate kind' do
    new_start = Time.zone.now + 14.days
    black = events(:week_blackout_product)
    put :update, {utf8: '✓', authenticity_token: '01ICQ23rQz8Idq2KELxrTpC3oKzuZVI5qqFRSXma4rI=', old_blackout: {id: black.id}, ga_client_id: '1424456246.1415014951', blackout: {product_id: black.product_id, variant_id: black.variant_id, all_day: '1', start: new_start, finish: new_start + 1.day}, commit: 'Save', id: black.id}
    #{:blackout => {:id => events(:week_blackout_product).id, :start => new_start, :finish => new_start + 4.day}}
    assert_equal new_start.to_datetime.beginning_of_day, assigns(:blackout).start
  end

  test 'should delete if we say so' do
    assert_difference 'EventDate.count', -1 do
      put :update, {id: event_dates(:two).id, blackout: {id: event_dates(:two).id, start: Time.now + 3.day, finish: Time.now + 4.day}, delete: true}
    end
  end

  test 'should delete an Old Blackout' do
    assert_difference 'Event.count', -1 do
      put :update, {id: events(:random_blackout_product).id, blackout: {id: events(:random_blackout_product).id, start: Time.now + 3.day, finish: Time.now + 4.day}, delete: true}
    end
  end
end
