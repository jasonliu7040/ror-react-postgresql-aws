class ProductsController < ApplicationController
  before_filter  :current_timezone, :load_resources, :load_locations
  skip_before_filter  :verify_authenticity_token, :only => [:update] , :if => proc {|c| request.xhr?}

  include SpecificRendering

  def index
    @products = current_account.products.includes(:option_capacities).order(:product_title).page(params[:page] || 1).per(50)

    @search_term = params[:search]
    if @search_term.present?
      @products = @products.where("product_title LIKE ? OR product_handle LIKE ?", "%#{@search_term}%", "%#{@search_term}%")
    end

    respond_to do |format|
      format.html # index.html.erb
    end
  end

  def show
    redirect_to edit_product_path(params[:id])
  end

  def new
    eid = params[:external_id]
    if eid.blank?
      redirect_to(products_url)
    else
      # if this product previously existed then recover it
      @product = Product.only_deleted.find_by_shop_id_and_external_id(@account.id, eid)
      @events = []
      if @product
        build_schedule_items
        Product.restore(@product.id, :recursive => true)
        flash[:notice] = "Recovered #{@product.product_title}"
        redirect_to edit_product_path(@product)
        return
      end

      # if this product already exists then redirect to edit
      @product = Product.find_by_shop_id_and_external_id(@account.id, eid)
      if @product
        build_schedule_items
        redirect_to edit_product_path(@product)
        return
      end

      @product, @shopify_product_variants = @account.build_new_product_from_external_id(eid)

      if @product.present?
        edit_set_up
        build_schedule_items
        @resource_constraints = @product.resource_constraints.build
        respond_to do |format|
          format.html
        end
      else
        redirect_to(products_url, notice: "Product not found")
      end
    end
  end

  def create
    @product = @account.products.build(product_params)
    @product.mindate = 1

    set_configuration_options

    if @product.min_duration.blank?
      @product.min_duration = 0
    end

    respond_to do |format|
      if @product.save
        Delayed::Job.enqueue(InventoryPolicyJob.new(@account.id, @product.external_id), :priority => 10)
        flash[:notice] = "Product saved"
        format.html { redirect_to edit_product_path(@product) }
        format.js
        format.json do
          render :json => ProductSerializer.new(@product).as_json.merge(message: 'Product created'),
                 status: :created
        end
      else
        edit_set_up
        format.html { render :action => "new" }
        format.js
        format.json do
          render :json => { message: @product.errors }, status: 500
        end
      end
    end
  end

  def edit
    @legacy_variant_times = %w(aloha-golf hawaiideepseafishing mexicoteetimes golfhawaiiteetimes gogohawaii hawaiigolfclubrentals).include?(current_account.subdomain)
    @product =  current_account.products.includes(:schedule).where(id: params[:id]).first
    if @product
      build_schedule_items
      @events = TermsPresenter.new(@product.terms).calendar_json
      edit_set_up
      respond_to do |format|
        format.html
      end
    else
      redirect_to(products_url, notice: "Product not found")
    end
  end

  def update
    @product = current_account.products.find_by_id(params[:id])
    if params[:reset_variants]
      reset_variants
    else
      @product.option_capacities.each {|oc|oc.delete}
      set_configuration_options

      respond_to do |format|
        if @product.update_attributes(product_params)
          Delayed::Job.enqueue InventoryPolicyJob.new(@account.id, @product.external_id), :priority => 10
          format.html do
            redirect_to(edit_product_path(@product), :notice => 'Product updated')
          end
          format.json do
            render :json => ProductSerializer.new(@product).as_json.merge(message: 'Product updated'), status: 200
          end
        else
          @events = []
          format.html do
            edit_set_up
            render :action => "edit"
          end
          format.json do
            render :json => { message: @product.errors }, status: 500
          end
        end
      end
    end
  end

  def reset_variants
    shopify_product = @account.external_product(@product.external_id)
    if shopify_product
      @product.import_variants(shopify_product.variants)
      Rails.logger.info "Variants built: #{@product.variants.size}"
      @product.save
    end

    respond_to do |format|
      format.html do
        redirect_to(edit_product_path(@product), :notice => 'Variants reset')
      end
    end
  end

  def destroy
    product = Product.find_by_id(params[:id])
    if product && product.destroy
      flash[:notice] = "Product deleted."
    end

    respond_to do |format|
      format.html { redirect_to(products_url) }
    end
  end

  def autocomplete
    # term = params[:term]
    # @products = Product.order(:product_title).where(["shop_id = ? and (product_title like ? or product_handle = ?)", @account.id, "%#{term}%", term])
    # respond_to do |format|
    #   format.html
    #   format.json {
    #     render json: @products.map{|product| {:value => product.id, :name =>  product.product_title}}
    #   }
    # end
  end

  protected

  def set_configuration_options
    configuration_options = params[:configuration_options]
    if configuration_options
      @product.capacity_option1 = configuration_options[0]
      @product.capacity_option2 = configuration_options[1]
      @product.capacity_option3 = configuration_options[2]
    end
  end

  def edit_set_up
    @shopify_product_variants = []
    @variant_options = []

    sproduct = current_account.external_product(@product.external_id)
    if sproduct
      @shopify_product_variants = sproduct.variants
      @variant_options = sproduct.options
    end

    # provide a default duration option
    if @product.option_durations.blank?
      option = @variant_options.first
      @product.duration_option_external_id = option.id
      @product.duration_option_position = 1
      option.values.each do |value|
        @product.option_durations.build({
          value: value,
          duration: 0,
          low_range: 0,
          high_range: 0,
          option_external_id: option.id
        })
      end
    end

    # start/finish time added Jan/2013 - this code provides a reasonable default for earlier shops and is set in build_variant
    @product.variants.each do |variant|
      variant.start_time = Time.now.utc.change({:hour => 9}) if variant.start_time.nil?
      variant.finish_time = Time.now.utc.change({:hour => 17}) if variant.finish_time.nil?
    end

    @product_count = @account.products.count
  end

  def datatable
    @iTotalRecords = ShopifyAPI::Product.count
    @products = ShopifyAPI::Product.find(:all, :params => {:limit => params[:iDisplayLength], :page => params[:iDisplayStart].to_i + 1})
    @iTotalDisplayRecords = @products.size
    @sEcho = params[:sEcho].to_i
    render :partial => 'datatable'

#    colName = ["image" , "title", "type", "vendor"]
#    order = colName[params[:iSortCol_0].to_i] + " " + params[:sSortDir_0]
#
#    @products = ShopifyAPI::Product.find(
#      :order => order,
#      :limit => params[:iDisplayLength], :offset => params[:iDisplayStart],
#      :conditions => [ 'title LIKE ? OR type LIKE ? OR vendor LIKE ?', '%'+params[:sSearch]+'%', '%'+params[:sSearch]+'%', '%'+params[:sSearch]+'%'])
  end

  def choose
    current_page = params[:page] || 1
    per_page = 25
    count = ShopifyAPI::Product.count()

    @products = ShopifyAPI::Product.find(:all, :params => {:limit => per_page, :page => current_page})
    @existing_products = Product.find(:all)
    @page_results = Kaminari.paginate_array(@products).page(current_page).per(per_page)
    render :partial => 'chooser/result_list'
  end

  def load_resources
    @available_resources = current_account.resources.order(:name)
  end

  def load_locations
    @available_locations = current_account.locations.order(:name)
  end

  private

  # def process(action, *args)
  #   super
  # rescue AbstractController::ActionNotFound
  #   respond_to do |format|
  #     format.json { render :json => {:error => "not-found"}.to_json, :status => 404 }
  #     format.html { render :text => "404 Not found", :status => 404 }
  #     format.all { render nothing: true, :status => 404 }
  #   end
  # end

  def product_params
    params.require(:product).permit!.except(:shopify_url)

    # muck = params.require(:product).permit(
    #     :max_duration,
    #     {:product_capacities_attributes => [:resource_id]},
    #     :min_duration,
    #     :background_color,
    #     :id,
    #     {:option_capacities_attributes => [:capacity, :option1, :option2, :option3]},
    #     :capacity,
    #     :product_handle,
    #     :location_id,
    #     :lag_time,
    #     :calendar_display,
    #     :capacity_type,
    #     :lead_time,
    #     :profile,
    #     :border_color,
    #     :text_color,
    #     {:variants_attributes => [:external_id, :option1, :option2, :option3, :sku, :settings_yaml, :all_day, :duration,
    #         :start_time, :finish_time, :party_size, :ignore]},
    #     :product_image_url,
    #     :product_title,
    #     :product_id,
    #     :scheduled,
    #     :mindate,
    #     :external_id,
    #     schedule_attributes: [:id, :schedulable_id, :schedulable_type,
    #                           oneoff_items_attributes: [:id, :schedule_id, :start, :finish, :_destroy],
    #                           recurring_items_attributes: [:id, :schedule_id, :schedule_yaml, :_destroy]
    #     ])
    # if params[:product][:resource_constraints_attributes].present?
    #   muck = muck.tap do |white_listed|
    #     white_listed[:resource_constraints_attributes] = params[:product][:resource_constraints_attributes]
    #   end
    # end
    # muck
  end

  def build_schedule_items
    @product.build_schedule if @product.schedule.blank?
    @product.schedule.recurring_items.build if @product.schedule.recurring_items.blank?
  end

end
