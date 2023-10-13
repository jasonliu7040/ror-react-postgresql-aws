#
# Install webhooks, script tag and set up a config metafield on the shop
#
class ShopInstallJob < Struct.new(:shop_id)
  include BookThatAppUtils

  def perform
    log_exception(true) do
      @shop = Shop.find_by_id(self.shop_id)
      return unless @shop

      @shop.external do
        install_script_tag
        install_webhooks
        install_config
        # install_snippets
        # modify_published_theme
      end

      # turn on new duration for new shops
      $flipper[:duration_v2].enable(@shop)
    end
  end

  def install_script_tag
    Rails.cache.delete "#{@shop.subdomain}/scripts"

    scripts = ShopifyAPI::ScriptTag.find(:all)
    scripts.each do |script|
      script.destroy if script.src.include? '.bookthatapp.com'
    end if scripts

    ShopifyAPI::ScriptTag.create(:src => '//' + @shop.subdomain + '.' + DOMAIN + '/javascripts/bta.js', :display_scope => 'online_store', :event => 'onload')
    ShopifyAPI::ScriptTag.create(:src => '//' + @shop.subdomain + '.' + DOMAIN + '/javascripts/bta-order-status.js', :display_scope => 'order_status', :event => 'onload')
  end

  def install_webhooks
    Rails.cache.delete "#{@shop.subdomain}/hooks"

    hooks = ShopifyAPI::Webhook.find(:all)
    hooks.each do |hook|
      hook.destroy
    end if hooks

    ["shop/update", "app/uninstalled", "orders/create", "orders/paid", "orders/cancelled", "products/update", "products/delete"].each do |topic|
      webhook = ShopifyAPI::Webhook.create(:topic => topic, :address => "http://www.#{DOMAIN}/hooks/#{topic}")
      raise "Webhook invalid: #{webhook.errors.inspect}" unless webhook.valid?
    end
  end

  def install_config
    metafield = ShopifyAPI::Metafield.new(key: "config", namespace: "bookthatapp", value: '{"authentication_token": ""}', value_type: "string")
    # metafield = ShopifyAPI::Metafield.new(key: "config", namespace: "bookthatapp", value: '{"authentication_token": "' + @shop.authentication_token + '"}', value_type: "string")
    @shop.external_shop.add_metafield(metafield)
  end

  def install_snippets
    @shop.external do
      ['bta-cart'].each do |snippet|
        snippet = ShopifyAPI::Asset.new(:key => "snippets/#{snippet}.liquid")
        snippet.value = File.read("#{Rails.root}/db/snippets/#{snippet}.liquid")
        snippet.save
      end
    end
  end

  def modify_published_theme
    @shop.external do
      cart_template = ShopifyAPI::Asset.find('templates/cart.liquid')
      cart_template.value += "\n\n{% include 'bta-cart' %}"
      cart_template.save
    end
  end
end
