VariantLegacyMetafieldSyncStruct = Struct.new(:shop_id, :variant_id, :external_id) unless defined?(VariantLegacyMetafieldSyncStruct)

class VariantLegacyMetafieldSyncJob < VariantLegacyMetafieldSyncStruct
  include BookThatAppUtils

  def perform
    log_exception(true) do
      shop = Shop.find_by_id(self.shop_id)
      if shop
        begin
          variant = Variant.find_by_id(self.variant_id)
          svariant = shop.external_variant(self.external_id)
          shop.external do
            if variant
              adds_a_metafield(svariant, {:namespace => 'bookthatapp', :key => 'start_time', :value => variant.start_time.to_i, :value_type => 'integer'})
              adds_a_metafield(svariant, {:namespace => 'bookthatapp', :key => 'finish_time', :value => variant.finish_time.to_i, :value_type => 'integer'})
              adds_a_metafield(svariant, {:namespace => 'bookthatapp', :key => 'duration', :value => variant.duration_minutes, :value_type => 'integer'})

              Rails.logger.info "[#{shop.subdomain}/variants/#{self.variant_id}] Legacy metafields updated"
            else
              svariant.metafields.each do |mf|
                mf.destroy
              end
            end
          end if svariant
        rescue ActiveResource::ResourceNotFound => rnf
          # nothing to update
          Rails.logger.info "[#{shop.subdomain}/variants/#{self.variant_id}] No external variant found: skipping update"
        end
      end
    end
  end

  def adds_a_metafield(variant, a)
    begin
      variant.add_metafield(ShopifyAPI::Metafield.new(a))
    rescue ActiveResource::ResourceNotFound
      nil
    end
  end
end
