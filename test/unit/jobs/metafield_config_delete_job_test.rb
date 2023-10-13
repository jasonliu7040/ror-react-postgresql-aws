require 'test_helper'

class MetafieldConfigDeleteJobTest < ActiveSupport::TestCase
  test 'it destroys product metafield config' do
    shop = shops(:test)
    product = products(:hook_product)

    mock_out(:get, "products/#{product.external_id}.xml")
    mock_out(:get, "products/#{product.external_id}/metafields.xml")
    FakeWeb.register_uri(:delete, "https://#{shop.subdomain}.myshopify.com/admin/products/#{product.external_id}/metafields/#{product.external_id}.xml", {:body => "",  :status => ["200", "Ok"]})
    MetafieldConfigDeleteJob.new(shop.id, 'products', product.external_id).perform
  end
end
