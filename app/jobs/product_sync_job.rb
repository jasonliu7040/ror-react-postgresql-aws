#
# Updates the BTA copy of a product (including variants and options)
#
class ProductSyncJob < Struct.new(:shop_id, :shopify_product_id)
  include BookThatAppUtils

  #
  # Creates a semaphore key unique to this product. Returns false if it already exists.
  # The key is deleted after 2 minutes or the job has run.
  #
  def reserve
    result = true

    if Rails.env.production?
      key = semaphore_key

      begin
        if $redis.get(key)
          result = false
        else
          $redis.set(key, key)
          $redis.expire(key, 120) # 2 minutes
        end
      rescue Redis::CannotConnectError
        Rails.logger.warn 'Can not connect to redis'
      end
    end

    result
  end

  def unreserve
    if Rails.env.production?
      # clean up semaphore key
      key = semaphore_key
      $redis.del(key)
    end
  end

  def perform
    log_exception(true) do
      @shop = Shop.find_by_id(self.shop_id)
      return unless @shop
      @product = Product.find_by_shop_id_and_external_id(@shop.id, self.shopify_product_id)
      if @product
        lookup_product
        if @sproduct.nil?
          @product.destroy
        else
          update_product
        end

        Rails.cache.delete("#{@shop.subdomain}/product/#{self.shopify_product_id}")
      end

      unreserve
    end
  end

  # get a non cached product from the shop
  def lookup_product
    @shop.external do
      begin
        @sproduct = ShopifyAPI::Product.find(self.shopify_product_id)
      rescue ActiveResource::ResourceNotFound
        @sproduct = nil
      end
    end
  end

  def update_product
    ActiveRecord::Base.transaction do # batch update - can be a lot of variants being saved
      @product.product_title = @sproduct.title
      @product.product_handle = @sproduct.handle
      @product.hidden = @sproduct.published_at.nil?
      simages = @sproduct.images
      @product.product_image_url = simages.length > 0 ? simages.first.src : nil

      @product.capacity_option1 = @sproduct.options[0].name if @sproduct.options[0] && @product.capacity_option1.present?
      @product.capacity_option2 = @sproduct.options[1].name if @sproduct.options[1] && @product.capacity_option2.present?
      @product.capacity_option3 = @sproduct.options[2].name if @sproduct.options[2] && @product.capacity_option3.present?

      Rails.logger.info "[#{@shop.subdomain}/products/#{@product.external_id}] Product updated: #{@product.product_title}"

      # see if any variants have been deleted
      eids = @sproduct.variants.collect(&:id) # collect ids of shopify variants

      @product.variants.each do |v|
        unless eids.include?(v.external_id) # this variant has been deleted
          Rails.cache.delete("#{@shop.subdomain}/variant/#{v.external_id}")

          # don't delete variants where bookings or blackouts exist
          booking_exists = @shop.booking_items.exists?(:external_product_id => self.shopify_product_id, :variant_id => v.id)
          blackout_exists = @shop.blackouts.exists?(:external_product_id => self.shopify_product_id, :variant_id => v.id)
          event_date_exists = @shop.event_dates.exists?(:external_product_id => self.shopify_product_id, :variant_id => v.id)

          unless booking_exists or blackout_exists or event_date_exists
            v.destroy
            Rails.logger.info "[#{@shop.subdomain}/products/#{@product.external_id}/variants/#{v.external_id}] Variant destroyed: #{v.title}"
          end
        end
      end

      @sproduct.variants.each do |svariant|
        update_variant(svariant)
      end

      # destroy removed options
      update_duration_options

      @product.save
    end
  end

  # update or create local variant from external variant
  def update_variant(svariant)
    variant = Variant.find_by_product_id_and_external_id(@product.id, svariant.id)
    if variant # existing variant
      Rails.cache.delete("#{@shop.subdomain}/variant/#{svariant.id}")
      variant.title = svariant.title
      variant.sku = svariant.sku
      variant.price = svariant.price
      variant.compare_at_price = svariant.compare_at_price
      variant.option1 = svariant.option1
      variant.option2 = svariant.option2
      variant.option3 = svariant.option3
      if variant.save
        Rails.logger.info "[#{@shop.subdomain}/products/#{@product.external_id}/variants/#{svariant.id}] Variant updated: #{svariant.title}"
      else
        Rails.logger.error "[#{@shop.subdomain}/products/#{@product.external_id}/variants/#{svariant.id}] Variant update failed: #{svariant.title} (#{variant.errors.inspect})"
      end
    else # new variant?
      # check if previously deleted
      variant = Variant.only_deleted.find_by_product_id_and_external_id(@product.id, svariant.id)
      if variant
        Variant.restore(variant.id, :recursive => true)
        Rails.logger.info "[#{@shop.subdomain}/products/#{@product.external_id}/variants/#{svariant.id}] Variant restored: #{svariant.title}"
      else
        @product.build_variant(svariant)
        Rails.logger.info "[#{@shop.subdomain}/products/#{@product.external_id}/variants/#{svariant.id}] Variant created: #{svariant.title}"
      end
    end
  end

  def update_duration_options
    if @product.duration_option_external_id
      # find option that has been configured in BTA
      if soption = @sproduct.options.find {|soption| soption.id == @product.duration_option_external_id}
        update_duration_option(soption)
      else
        # option has been deleted
        @product.duration_option_external_id = nil
        @product.duration_option = nil
        @product.option_durations.destroy_all
      end
    end
  end

  def update_duration_option(soption)
    @product.duration_option = soption.name
    @product.duration_option_position = soption.position

    # gather current option values
    values = @product.option_durations.map(&:value)

    # loop over shopify option values to see which ones we already have or need to be created
    soption.values.each do |svalue|
      # create a new option_duration if this is a new value
      unless values.delete(svalue) # whatever is left needs to be deleted
        @product.option_durations.build({
          value: svalue,
          duration: 0,
          low_range: 0,
          high_range: 0,
          option_external_id: soption.id
        })
      end
    end

    # delete left over values that no longer exist on the shopify side
    @product.option_durations.where(value: values).destroy_all
  end

private
  def semaphore_key
    "product_update_#{self.shop_id}_#{self.shopify_product_id}"
  end
end
