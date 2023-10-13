#
# Create a Shopify metafield.
#
# We do this as a background job because it is slow (http call) and if we hit
# the API limits the job will throw an exception and then DJ will retry automatically
#
MetafieldConfigStruct = Struct.new(:shop_id, :resource, :resource_id, :value) unless defined?(MetafieldConfigStruct)

class MetafieldConfigJob < MetafieldConfigStruct
  include BookThatAppUtils

  def perform
    log_exception(true) do
      shop = Shop.find_by_id(self.shop_id)
      if shop
        shop.external do
          begin
            # overwrites existing value if it exists
            mf = ShopifyAPI::Metafield.new({:resource => self.resource,
                                        :resource_id => self.resource_id,
                                        :namespace => 'bookthatapp',
                                        :key => 'config',
                                        :value => self.value,
                                        :value_type => 'string'})
            mf.save

            Rails.logger.info "[#{shop.subdomain}/metafields/#{self.resource_id}/config] Metafield updated"

          rescue ActiveResource::ResourceNotFound => rnf
            # nothing to update
            Rails.logger.info "[#{shop.subdomain}/metafields/#{self.resource_id}/config] Metafield update skipped: shopify variant not found"
          end
        end
      end
    end
  end
end
