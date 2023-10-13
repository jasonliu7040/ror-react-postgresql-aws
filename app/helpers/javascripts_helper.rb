module JavascriptsHelper
  def store_location
    store = shopify_store
    "#{store.address1}<br>#{store.address2}<br>#{store.city} #{store.zip} #{store.country}"
  end

  def store_iana_timezone
    store = shopify_store
    store.iana_timezone
  end

  def store_name
    store = shopify_store
    store.name
  end

  def store_email
    store = shopify_store
    store.customer_email || store.email
  end

  def shopify_store
    @shopify_store ||= @shop.external_shop
  end
end
