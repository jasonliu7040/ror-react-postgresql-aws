require 'test_helper'

class ShopTest < ActiveSupport::TestCase
  setup do
    @shop = shops(:test)
  end

  test "generates a good old hmac code " do
    muck = @shop.hmac_sha1(@shop.subdomain, @shop.subdomain + @shop.id.to_s)
    assert_equal muck, @shop.generate_shop_calendar_code
    assert @shop.compare_calendar_code(muck), "Should like be a good calendar code"
  end

  test "shop settings yaml shows up" do
    assert @shop.settings_json.present?
  end

  # test "should we deprecate tz now" do
  #   assert @shop.tz_now.present?
  # end

  test "should we deprecate reset_variant_durations" do
    # mock_variant_post(1)
    # mock_out :get, "variants/1.xml"
    # mock_variant_post
    # mock_variant_post(2)
    # mock_out :get, "variants/2.xml"
    # mock_variant_post(65985862)
    # mock_out :get, "variants/65985862.xml"
    # mock_variant_post(65985869)
    # mock_out :get, "variants/65985869.xml"
    # mock_variant_post(666)
    # mock_out :get, "variants/666.xml"
    # mock_variant_post(7)
    # mock_out :get, "variants/7.xml"
    # mock_variant_post(1009)
    # mock_out :get, "variants/1009.xml"
    # mock_variant_post(1000)
    # mock_out :get, "variants/1000.xml"
    # mock_out :get, "products/2.xml"
    # mock_out :get, "products/1.xml"
    # mock_product_post 1
    # mock_product_post 2
    mock_out_all_products_and_variants
    assert @shop.reset_variant_durations.present? #why did i have to do all these mocks after like 2 months of this test being here!
  end

  test "get them default settings_yaml" do
    @shop.settings_yaml = ""
    assert @shop.settings
  end

  test "import_order" do
    mock_out :get, "orders/1.xml"
    @shop.import_order(1)
  end

  test "install" do
    mock_out :get, "script_tags.xml"
    FakeWeb.register_uri(:delete, "https://test.myshopify.com/admin/script_tags/421379493.xml", {:body => "",  :status => ["200", "Ok"]})
    FakeWeb.register_uri(:delete, "https://test.myshopify.com/admin/script_tags/596726825.xml", {:body => "",  :status => ["200", "Ok"]})
    FakeWeb.register_uri(:post, "https://test.myshopify.com/admin/script_tags.xml", {:body => "",  :status => ["200", "Ok"]})
    mock_out :get, "webhooks.xml"
    FakeWeb.register_uri(:delete, "https://test.myshopify.com/admin/webhooks/4759306.xml", {:body => "",  :status => ["200", "Ok"]})
    FakeWeb.register_uri(:delete, "https://test.myshopify.com/admin/webhooks/901431826.xml", {:body => "",  :status => ["200", "Ok"]})
    FakeWeb.register_uri(:post, "https://test.myshopify.com/admin/webhooks.xml", {:body => "",  :status => ["200", "Ok"]})
    mock_out :get, "shop.xml"
    FakeWeb.register_uri(:post, "https://test.myshopify.com/admin/metafields.xml", {:body => "",  :status => ["200", "Ok"]})

    @shop.install
  end

  test "gets all blackouts" do
    assert_not_nil @shop.all_blackouts(DateTime.now, DateTime.now + 1.months, [])
  end

  test "new shop hits the good defaults" do
    mock_session "subsubnew" do
      # mock_out :delete, "script_tags/421379493.xml", "subsubnew"
      # mock_out :delete, "script_tags/596726825.xml", "subsubnew"

      # the_file = Rails.root.join("test/shopify_mock_fixtures/post_script_tags.xml")
      # the_url = "https://subsubnew.myshopify.com/admin/script_tags.xml"
      # FakeWeb.register_uri(:post, the_url, :body => File.read(the_file))
      # mock_out :delete, "webhooks/4759306.xml", "subsubnew"
      # mock_out :delete, "webhooks/901431826.xml", "subsubnew"
      # a_file = Rails.root.join("test/shopify_mock_fixtures/webhooks/901431826.xml")
      # a_url = "https://subsubnew.myshopify.com/admin/webhooks.xml"
      # FakeWeb.register_uri(:post, a_url, :body => File.read(a_file))

      # shop = Shop.new(site: "subsubnew", subdomain: "subsubnew")
      # assert shop.save, "Is it valid, this shop?"
    end
  end

  test "shop has a couple seasons in DB" do
    assert_equal 2, @shop.seasons.count
  end

  test "building a product from scope should work" do
    z =  @shop.products.build(:external_id => 123123, :capacity => 1)
    assert z.valid?
  end
end
