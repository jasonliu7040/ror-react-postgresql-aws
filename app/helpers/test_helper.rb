module TestHelper
  def product_metafield_config(product_external_id)
    product = Product.find_by_external_id(product_external_id)
    product.metafield_config if product
  end

  def variant_metafield_config(product_external_id)
    product = Product.find_by_external_id(product_external_id)
    if product
      variants = product.variants.map do |variant|
        "#{variant.external_id}:#{variant.metafield_config}"
      end
      variants.join(',')
    end
  end
end


