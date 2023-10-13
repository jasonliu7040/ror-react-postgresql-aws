class InventoryPolicyJob < LogExceptionJob.new(:shop_id, :shopify_product_id)
  def logged_perform
    shop = Shop.find_by_id(self.shop_id)
    shop.external do
      sproduct = shop.external_product(self.shopify_product_id)
      if sproduct
        sproduct.variants.select{|svariant| svariant.inventory_management != ''}.each do |svariant|
          variant = shop.variants.find_by_external_id(svariant.id)
          unless variant.ignore?
            svariant.inventory_management = ''
          end if variant
        end

        sproduct.save
      end if shop
    end
  end
end
