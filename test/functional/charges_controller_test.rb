require 'test_helper'

class ChargesControllerTest < ActionController::TestCase
  setup do
    set_shopify_session
    mock_out :get, 'recurring_application_charges.xml'
    mock_out :get, 'application_charges.xml'
  end

  test 'index page' do
    get :index
    assert_response :success
  end

  [:installation].each do |the_route|
    test "should get #{the_route}" do
      get the_route, {charge_id: 1}
      assert_response :success
    end
  end

  [1, 2].each do |id|
    test 'should get install' do
      set_shopify_session
      mock_out :get, "application_charges/#{id}.xml"
      mock_out :post, 'application_charges/2/activate.xml'
      mock_out :get, 'shop.xml'
      get :install, {charge_id: id}
      assert_redirected_to '/charges/installation'
    end
  end

  test 'approve install' do
    FakeWeb.register_uri :post,
                         'https://test.myshopify.com/admin/application_charges.xml',
                         :body => File.read(Rails.root.join('test/shopify_mock_fixtures/application_charges/approve_install.xml'))
    patch :approve_install
    assert_response :redirect
  end

  test 'subscribe to recurring charge' do
    FakeWeb.register_uri :post,
                         'https://test.myshopify.com/admin/recurring_application_charges.xml',
                         :body => File.read(Rails.root.join('test/shopify_mock_fixtures/recurring_application_charges/approve_recurring_charge.xml'))
    patch :subscribe
    assert_response :redirect
  end

  test 'confirm recurring charge - charge was accepted' do
    mock_out :get, 'recurring_application_charges/1.xml'
    get :confirm, charge_id: 1
    assert_redirected_to charges_path(subdomain: 'test')
  end

  test 'cancel recurring charge' do
    patch :cancel
    assert_response :redirect
  end

  test 'confirm recurring charge - charge was declined' do
    mock_out :get, 'recurring_application_charges/2.xml'
    get :confirm, charge_id: 2
    assert_redirected_to charges_path(subdomain: 'test')
  end
end
