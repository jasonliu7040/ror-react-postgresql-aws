require 'test_helper'

class ProductSyncJobTest < ActiveSupport::TestCase
  test 'it syncs' do
    shop = shops(:test)
    product = products(:hook_product)

    assert_not_equal 'White', product.variants.first.option1, 'Test requires option 1 value to be something other than White'

    mock_product_post 27763452
    FakeWeb.register_uri(:get, "https://#{shop.subdomain}.myshopify.com/admin/products/#{product.external_id}.xml", {
        :body => File.read(Rails.root.join("test/shopify_mock_fixtures/products/#{product.external_id}_update.xml")),
        :status => ["200", "Ok"]
    })
    FakeWeb.register_uri(:post, "https://#{shop.subdomain}.myshopify.com/admin/products/#{product.external_id}/metafields.xml", {:body => "",  :status => ["200", "Ok"]})

    FakeWeb.register_uri(:get, "https://#{shop.subdomain}.myshopify.com/admin/variants/233592770.xml", {
        :body => File.read(Rails.root.join("test/shopify_mock_fixtures/variants/233592770.xml")),
        :status => ["200", "Ok"]
    })
    FakeWeb.register_uri(:post, "https://#{shop.subdomain}.myshopify.com/admin/variants/233592770/metafields.xml", {:body => "",  :status => ["200", "Ok"]})

    before_sync_capacities = product.option_capacities.map(&:capacity)

    ProductSyncJob.new(shop.id, product.external_id).perform

    product.reload

    assert_equal 'White', product.variants.first.option1, 'Variant title should have been updated'

    after_sync_capacities = product.option_capacities.map(&:capacity)

    assert(before_sync_capacities == after_sync_capacities, "Capacity shouldn't be changed by sync job")

    after_sync_duration_option_values = product.option_durations.map(&:value)
    assert(after_sync_duration_option_values.include?('Red'), "Existing option value 'Red' is missing after sync")
    assert(after_sync_duration_option_values.include?('White'), "New option value 'White' should have been created after sync")

  end
end
