class ProductDeleteJob < Struct.new(:shop_id, :shopify_product_id)
  include BookThatAppUtils

  def perform
    log_exception(true) do
      shop = Shop.find_by_id(self.shop_id)
      if shop
        Product.destroy_all(:external_id => self.shopify_product_id)
      end
    end
  end
end
