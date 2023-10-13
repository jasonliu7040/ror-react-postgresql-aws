require 'test_helper'

class ProductTest < ActiveSupport::TestCase

  def setup_new_product(arg = {})
    shop = shops(:test)
    p = shop.products.build
    p.product_title = "Unit Test"
    p.capacity = 1
    p.external_id = 27763452
    p
  end

  test "should be able to create a product" do
    mock_session do
      mock_product_post 27763452
      mock_out :get, "products/27763452.xml"
      mock_out :put, "products/27763452.xml"
      p = setup_new_product
      assert p.save!, "save failed"
    end
  end

  test "icecube_schedule messing with IceCube triggers the exeception but also let's what it is supposed to do go through" do
    p = products(:product1)
    p.schedule.recurring_items.first.schedule_yaml.gsub! "[", ""
    assert p.icecube_schedule
  end

  test "can get external_product from product" do
    mock_out :get, "products/1003832167.xml"
    p = products(:update_hook_product)
    assert p.external_product
  end

  test "schedule goes json" do
    p = products(:product1)
    assert_not_nil p.schedule_json
  end

  test "syncs metafields for old shops" do
    mock_out :get, "products/1003832167.xml"
    mock_product_post(1003832167)
    p = products(:update_hook_product)
    assert p.sync_metafields
  end

  test "munges out the product url" do
    p = products(:scheduled_daily_product)
    assert_not_nil p.image_url
  end

  test "if you pass a space in for product_image_url" do
    p = products(:scheduled_daily_product)
    p.product_image_url = "/"
    assert_equal "", p.image_url
  end

  test "initialize with scheduled yaml" do
    mock_out :get, "products/27763452.xml"

    shop = shops(:test)
    the_string = ":start_date: 2014-08-27 12:00:00 Z\n:duration: 720\n:rrules:\n- :validations:\n  :rule_type: IceCube::MinutelyRule\n  :interval: 12\n  :until:  2014-08-27 14:00:00 Z\n:exrules: []"
    p = shop.products.build(:schedule_yaml => the_string)
    p.product_title = "Unit Test"
    p.capacity = 1
    p.external_id = 27763452
    mock_product_post 27763452
    assert p.valid?
    assert p.save
    mock_product_post 27763452
    assert_equal the_string, Product.find(p.id).schedule_yaml
  end

  test 'metafield_config' do
    p = products(:resource_one) # has 1 resource assigned
    config = p.metafield_config
    assert config
  end
end
