#
# used by the product chooser (product page)
#
class ChooserController < ApplicationController
  skip_before_filter :verify_authenticity_token
  def search
    if params.has_key?(:term)
      result = []
      @account.external do
        ShopifyAPI::Product.find(:all, params:{title:"%#{params[:term]}%"}).each do |product|
          result << product.as_json
        end
      end

      respond_to do |format|
        format.json do
          render :json => result, :callback => params[:callback]
        end
      end
    else
      render :text => "Required parameters missing: 'term'", :status => 403
    end
  end

  def products
    current_page = params[:page] || 1
    per_page = 15
    count = @account.external_product_count
    @products = @account.external_products current_page, per_page
    @existing_products = []
    @page_results = Kaminari.paginate_array(@products, {:total_count => count}).page(current_page).per(per_page)
    render :partial => 'products/result_list'
  end

  def product
    @account.external do
      respond_to do |format|
        format.json do
          render :json => ShopifyAPI::Product.find(params[:id]).to_json, :callback => params[:callback]
        end
      end
    end
  end

  def available
    @existing_products = @account.products
    current_page = params[:page] || 1
    per_page = 15
    count = @account.external_product_count
    @products = @account.external_products(current_page, per_page) || []
    @page_results = Kaminari.paginate_array(@products, {:total_count => count}).page(current_page).per(per_page)
    ui_version( proc { render :partial => 'products/v2/result_list'  },  proc { render :partial => 'products/result_list' } )
  end

  def variant_options
    product = @account.products.with_deleted.find_by_id(params[:product_id])
    if product

      respond_to do |format|
        format.js do
          render :json => {
              :handle => product.product_handle,
              :profile => product.profile,
              :variants => @account.variants.with_deleted.where(product_id: params[:product_id]).collect do |v|
                v.as_json(:only => [:id, :external_id, :title, :all_day], :methods => [:metafield_config, :hidden])
              end,
              :resources => product.resources.collect { |r| r.as_json(:only => [:id, :name]) },
              :locations => product.locations.collect { |l| l.as_json(:only => [:id, :name]) }
          }
        end
      end
    else
      not_found
    end
  end
end
