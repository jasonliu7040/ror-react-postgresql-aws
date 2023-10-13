require 'test_helper'

class HooksControllerTest < ActionController::TestCase
  test 'shop_update' do
    request.env['HTTP_X_SHOPIFY_SHOP_DOMAIN'] = 'test'

    shop_file = mock_out(:get, 'shop.xml')

    raw_post :shop_update, {}, File.read(shop_file)
    assert_response :success

    shop = shops(:test)
    assert_equal -1, shop.charge_id, 'Shop charge_id should be -1 after it becomes a trial shop'
  end

  test 'orders_create' do
    order_id = 157266798

    request.env['HTTP_X_SHOPIFY_SHOP_DOMAIN'] = 'test'
    request.env['HTTP_X_SHOPIFY_ORDER_ID'] = order_id

    order_file = mock_out(:get, "orders/#{order_id}.xml")
    assert_difference('Booking.count') do
      raw_post :orders_create, {}, File.read(order_file)
    end
    assert_response :success

    raw_post :orders_updated, {}, File.read(Rails.root.join('test/hooks/order-update.xml'))
    assert_response :success
  end

  test 'orders_cancelled' do
    order_id = 123132311

    request.env['HTTP_X_SHOPIFY_SHOP_DOMAIN'] = 'test'
    request.env['HTTP_X_SHOPIFY_ORDER_ID'] = order_id

    assert_difference('Booking.count', -1) do
      post :orders_cancelled
    end

    assert_response :success
  end

  test 'mails as is supposed to' do
    post :mail, {:format => :json, _json: [
        {'email' => 'john.doe@sendgrid.com', 'timestamp' => 1337197600, 'smtp-id' => '<4FB4041F.6080505@sendgrid.com>', 'event' => 'processed'},
        {'email' => 'john.doe@sendgrid.com', 'timestamp' => 1337966815, 'category' => 'newuser', 'event' => 'click', 'url' => 'http://sendgrid.com'},
        {'email' => 'john.doe@sendgrid.com', 'timestamp' => 1337969592, 'smtp-id' => '<20120525181309.C1A9B40405B3@Example-Mac.local>', 'event' => 'processed'}
    ]}
  end

  test 'the Deprecated hook names' do
    [:uninstall, :order, :paid, :cancelled, :update, :delete].each do |place|
      post place, {:format => :json}
      assert_response :success
    end
  end

  test 'app unistalled successful' do
    post :app_uninstalled, {:format => :json}, {"X-Shopify-Shop-Domain" => "test"}
    assert_response :success
  end

  test 'products_update' do
    product = products(:update_hook_product)

    request.env['HTTP_X_SHOPIFY_SHOP_DOMAIN'] = 'test'
    request.env['HTTP_X_SHOPIFY_PRODUCT_ID'] = product.external_id

    mock_out(:get, 'variants/666/metafields.xml?key=config&namespace=bookthatapp')
    mock_out(:get, 'variants/233592770.xml')
    mock_out(:get, 'variants/233592770/metafields.xml')
    mock_out :delete, 'variants/666/metafields/666.xml'
    mock_out(:put, 'products/100383216.xml')
    mock_product_post
    mock_product_post(1003832167)
    mock_out(:get, 'variants/233592770.xml')

    file = mock_out(:get, "products/#{product.external_id}.xml") # products/1003832167.xml

    # according to the mock file there is only 1 variant for the product now so
    # variants with external id 233592771 & 666 on the BTA side should be destroyed
    assert_difference 'Variant.count', -2 do
      raw_post :products_update, {}, File.read(file)
    end
    assert_response :success

    # make sure variant fields match what is posted in the update
    variant = variants(:update_hook_variant)
    assert_equal 'Black', variant.title
    assert_equal 'ORGANZA-998', variant.sku
    assert_equal 2.99, variant.price
    assert_equal 3.99, variant.compare_at_price
  end

  test 'products_delete is successful' do
    product = products(:update_hook_product)

    request.env['HTTP_X_SHOPIFY_SHOP_DOMAIN'] = 'test'
    request.env['HTTP_X_SHOPIFY_PRODUCT_ID'] = product.external_id

    file = mock_out(:get, "products/#{product.external_id}.xml")
    mock_out_all_products_and_variants
    mock_product_post 1003832167
    mock_out :get, 'products/1003832167/metafields.xml'
    assert_difference 'Product.count', -1 do
      raw_post :products_delete, {}, File.read(file)
    end
  end
end
