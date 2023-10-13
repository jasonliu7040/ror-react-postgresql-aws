require 'test_helper'

class BlackoutTest < ActiveSupport::TestCase
  test "product test gets global and product blackouts returned" do
    product = products(:blackout_product)
    assert_equal 1, product.blackouts.count
  end

  test "shop has global blackout periods" do
    shop = shops(:test)
    assert shop.blackouts.count > 0
  end

  test "to calendar_hash spits out what it does" do
    blackout = event_dates(:blackout_one)
    two = event_dates(:two)
    assert_not_empty blackout.to_calendar_hash
    assert_not_empty two.to_calendar_hash
  end

  test "does not collide with another blackout of different type or global" do
    one = event_dates(:two)
    muck = Blackout.new(:start => one.start, :finish => one.finish, product_id: 1)
    assert muck.valid?, "should be valid"
  end

  test "new blackout does not collide with another blackout with same product id, and a differnt variant" do
    one = event_dates(:blackout_three)
    muck = Blackout.new(:start => one.start, :finish => one.finish, product_id: 4, variant_id: 4)
    assert muck.valid?, "should be valid"
  end

  test "deleting a product deletes any associated blackouts" do
    product = products(:blackout_product)

    assert_difference 'Blackout.count', -2 do
      # so that product after_destroy callbacks are good
      mock_out :get, "products/#{product.external_id}/metafields.xml?key=config&namespace=bookthatapp"
      mock_out :get, "products/9.xml"
      mock_out :get, "products/9/metafields.xml"
      mock_product_post 9
      FakeWeb.register_uri(:delete, "https://test.myshopify.com/admin/products/#{product.external_id}/metafields/9.xml", {:body => "",  :status => ["200", "Ok"]})

      product.destroy
    end
  end

  test "deleting a variant deletes any associated blackouts" do
    variant = variants(:blackout_variant)
    mock_out :get, "products/9.xml"
    mock_variant_post 9
    mock_product_post 9
    assert_difference 'Blackout.count', -1 do

      # mock_out :get, "products/#{product.external_id}/metafields.xml?key=config&namespace=bookthatapp"
      # FakeWeb.register_uri(:delete, "https://test.myshopify.com/admin/products/#{product.external_id}/metafields/9.xml", {:body => "",  :status => ["200", "Ok"]})

      variant.destroy
    end
  end
end
