module ShopifyAPI
  module PriceConversion
    def to_cents(amount)
      (amount.to_f * 100).round
    end
  end

  class Session
    def subdomain
      @url.split('.').first
    end
  end
  
  class Base
    self.format = :xml if Rails.env.test?

    def self.find_each(options = {})
      find_in_batches(options) do |records|
        records.each { |record| yield record }
      end

      self
    end

    def self.find_in_batches(options = {})
      page = 1
      limit = options.delete(:limit) || 250

      objects = find(:all, :params => {:page => page, :limit => limit})

      while objects.any?
        yield objects

        break if objects.size < limit
        page += 1
        objects = find(:all, :params => {:page => page, :limit => limit})
      end
    end
  end

  class Shop < Base
    cattr_accessor :cached

    def to_liquid
      {
        'name'     => name,
        'email'    => email,
        'address'  => address1,
        'city'     => city,
        'zip'      => zip,
        'country'  => country,
        'phone'    => phone,
        'province' => province,
        'owner'    => shop_owner,
        'permanent_domain' => myshopify_domain
      }
    end
  end

  class Order < Base
    def to_liquid
      fulfilled, unfulfilled = line_items.partition {|item| item.fulfilled?}
      {
          'name'              => name,
          'email'             => email,
          'gateway'           => gateway,
          'order_name'        => name,
          'order_number'      => number,
          'subtotal_price'    => cents(subtotal_price),
          'total_price'       => cents(total_price),
          'tax_price'         => cents(total_tax),
          'line_items'        => line_items,
          'fulfilled_line_items' => fulfilled,
          'unfulfilled_line_items' => unfulfilled,
          'note'              => note,
          'attributes'        => note_attributes,
          'customer'          => {'email' => email, 'name' => billing_address.nil? ? "" : billing_address.name}
      }
    end

    private

    # needed because Shopify API exports prices in decimals (dollar amounts),
    # but we want integers (cent amounts) for consistency
    def cents(amount)
      (amount * 100).to_i
    end
  end

  class LineItem < Base
    def to_liquid
      {
          'id'         => id,
          'title'      => name,
          'price'      => price.to_i * 100,
          'line_price' => (price * quantity),
          'quantity'   => quantity,
          'sku'        => sku,
          'grams'      => grams,
          'vendor'     => vendor,
          'variant_id' => variant_id
      }
    end
  end

  class Product < Base
    include PriceConversion

    def to_liquid
      {
        'id'                      => id,
        'title'                   => title,
        'handle'                  => handle,
        'content'                 => body_html,
        'description'             => body_html,
        'vendor'                  => vendor,
        'type'                    => product_type,
        'variants'                => variants.collect(&:to_liquid),
        'images'                  => images.collect(&:to_liquid),
        'featured_image'          => images.first,
        'tags'                    => all_tags,
        'price'                   => price_range,
        'price_min'               => to_cents(variants.min_by {|v| v.price}.price),
        'url'                     => "/products/#{handle}",
        'options'                 => options.collect(&:name)
      }
    end

    def all_tags
      tags.blank? ? [] : tags.split(",").collect(&:strip)
    end

    def prices
      variants.collect(&:price).collect(&:to_f)
    end

    def price_min
      prices.min
    end

    def price_max
      prices.max
    end

    def available?
      variants.map(&:inventory_quantity).sum > 0
    end
  end

  class Image < Base
    def to_liquid
      src.match(/\/(products\/.*)\?/)[0]
    end
  end

  class Variant < Base
    include PriceConversion

    def self.lookup(id, product_id)
      Rails.cache.fetch("products/#{product_id}/variants/#{id}", :expires_in => 1.hour) do
        find(id, {:params => {:product_id => product_id}})
      end
    end

    # truncated (as opposed to Shopify's model) for simplicity
    def to_liquid
      {
        'id'                 => id,
        'title'              => title,
        'option1'            => option1,
        'option2'            => option2,
        'option3'            => option3,
        'price'              => to_cents(price),
        'weight'             => grams,
        'compare_at_price'   => to_cents(compare_at_price),
        'inventory_quantity' => inventory_quantity,
        'sku'                => sku
      }
    end
  end

  module Metafields
    def get_metafield(namespace, key)
      s = metafields.select {|field| field.namespace == namespace && field.key == key}
      s.first
    end
  end
end

module ShopifyLoginProtection
  def shopify_session
    if session[:shopify].blank? or shop_overwritten?
      original_request = "#{request.fullpath}?#{request['QUERY_STRING']}" # request.query_string
      session[:return_to] = original_request
      redirect_to :controller => 'login', :action => 'index', :shop => params[:shop]
      return
    end

    ActiveResource::Base.site = session[:shopify].site
    ShopifyAPI::Shop.cached = Rails.cache.fetch("shops/#{session[:shopify].url}", :expires_in => 5.minutes) { session[:shopify].shop }
    yield
  ensure
    ActiveResource::Base.site = nil
    ShopifyAPI::Shop.cached = nil
  end

  private
  def shop_overwritten?
    return false if params[:shop].blank?
    params[:shop] != session[:shopify].url && "#{params[:shop]}.myshopify.com" != session[:shopify].url
  end
end

