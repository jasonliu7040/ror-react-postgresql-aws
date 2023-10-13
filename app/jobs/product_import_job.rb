class ProductImportJob < LogExceptionJob.new(:shop_id, :product_import_id)
  def logged_perform
    @shop = Shop.find_by_id(self.shop_id)

    if @shop
      @import = @shop.product_imports.find(self.product_import_id)
      @store = @shop.external_shop

      # get the unique handles out of the csv file
      url = @import.attachment.expiring_url(10)
      handles = Set.new
      begin
        CSV.new(open(url), headers: true, row_sep: :auto, col_sep: ';', :encoding => 'windows-1251:utf-8').each do |row|
          handles << row['Handle']
        end
      rescue CSV::MalformedCSVError => mcsve
        @import.failed
        return
      end

      @import.update_attribute(:product_count, handles.size)

      ActiveRecord::Base.transaction do
        handles.each do |handle|
          import_product(handle)
        end
      end

      @import.complete
    end
  end

  def import_product(handle)
    product = @shop.products.with_deleted.find_by_product_handle(handle)

    if product # product already configured
      if product.destroyed?
        Rails.logger.info "[#{@shop.subdomain}/product_imports/#{@import.id}] restored external product #{product.external_id}"
        product.restore
      end

      update_product(product)

      Rails.logger.info "[#{@shop.subdomain}/product_imports/#{@import.id}] scheduling product sync for external product #{product.external_id}" # schedule a sync (but at a lower priority)
      Delayed::Job.enqueue ProductSyncJob.new(@store.id, product.external_id), :priority => 35
    else
      sproduct = @shop.external_product_by_handle(handle)
      if sproduct
        product, shopify_product_variants = @shop.build_new_product_from_external(sproduct)

        update_product(product)

        Rails.logger.info "[#{@shop.subdomain}/product_imports/#{@import.id}] created new from external product #{product.external_id}"
      end
    end
  end

  def update_product(product)
    product.profile = @import.profile
    product.lag_time = @import.lag_time
    product.lead_time = @import.lead_time
    product.mindate = @import.mindate if @import.mindate
    product.range_count_basis = @import.range_basis
    product.min_duration = @import.range_min
    product.max_duration = @import.range_max

    if @import.capacity_type.present?
      product.capacity_type = @import.capacity_type
      if @import.capacity_type == 0
        product.capacity = @import.capacity
      else

      end

    end

    if product.save
      @import.import_count += 1
    end
  end
end

