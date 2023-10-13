class MetafieldConfigDeleteJob < Struct.new(:shop_id, :resource, :resource_id)
  include BookThatAppUtils

  def perform
    log_exception(true) do
      begin
        shop = Shop.find_by_id(self.shop_id)
        shop.external do
          find_metafields(shop).each do |metafield|
            destroy_metafield(metafield)
          end

          Rails.logger.info "[#{shop.subdomain}/metafields/#{self.resource_id}/config] Metafields deleted"
        end if shop
      rescue ActiveResource::UnauthorizedAccess => e
        # uninstalled
      end
    end
  end

  def find_metafields(shop)
    case self.resource
      when 'products'
        bta_metafields_for(shop.external_product(self.resource_id))
      when 'variants'
        bta_metafields_for(shop.external_variant(self.resource_id))
      else
        Rails.logger.error "[#{shop.subdomain}/metafields/#{self.resource_id}/config] Don't know how to find metafields for #{self.resource}"
        []
    end
  end

  def bta_metafields_for(sobject)
    sobject.nil? ? [] : sobject.metafields.select { |mf| mf.namespace == 'bookthatapp' }
  end

  def destroy_metafield(mf)
    begin
      mf.destroy
    rescue ActiveResource::ResourceNotFound
      # already deleted
    end
  end
end
