require 'test_helper'

class InventoryPolicyJobTest < ActiveSupport::TestCase
  test 'it updates variants that have inventory policy incorrectly set' do
    shop = shops(:test)
    product = products(:hook_product)
    mock_out(:get, "products/#{product.external_id}.xml")
    FakeWeb.register_uri(:put, "https://#{shop.subdomain}.myshopify.com/admin/products/#{product.external_id}.xml", {:body => "",  :status => ["200", "Ok"]})
    InventoryPolicyJob.new(shop.id, product.external_id).perform
  end
end
