# Proxy is used for other calendars to tell them what's going on in the product schedule for the start and finish'
class ProxyController < ApplicationController
  rescue_from ActionController::RoutingError, :with => :ignore_action

  skip_before_filter :verify_authenticity_token

  around_filter :cached_external_shop
  after_filter :set_access_control_headers

  # http://legros-parker-and-harris6290.bookthatapp.dev:3002/proxy?shop=legros-parker-and-harris6290.myshopify.com&start=16%2F07%2F2013&finish=31%2F07%2F2013
  def index
    start, finish = DateParameters.new(@shop, params).parse
    assigns = @shop.product_hash(params, start, finish)
    html = @shop.template("products").render(assigns)
    render :text => html, :status => 200, :content_type => Rails.env.development? ? 'text/html' : 'application/liquid'
  end

  # http://legros-parker-and-harris6290.bookthatapp.dev:3002/proxy/customer/91651944?shop=legros-parker-and-harris6290.myshopify.com
  def customer
    customer_id = params[:id]
    if customer_id
      bookings = @shop.bookings.where(:customer_id => customer_id)
      assigns = {'shop' => @shop, 'bookings' => bookings}
      html = @shop.template("customer").render(assigns)
      render :text => html, :status => 200, :content_type => Rails.env.development? ? 'text/html' : 'application/liquid'
    else
      render :text => "Customer ID missing", :status => 412
    end
  end

  def search
    @shop.external do
      assigns = {"shop" => @shop, "path" => params[:path] || '/apps/bookthatapp'}
      render :layout => false, :text => @shop.template("search").render(assigns), :status => 200, :content_type => 'text/html'
    end
  end

  # http://legros-parker-and-harris6290.bookthatapp.dev:3002/proxy/products?shop=legros-parker-and-harris6290&booking-start=&booking-finish=#
  def products
    render_json_error("route is no longer available", 410)
  end

  def email
    @shop.external do
      assigns = {"shop" => @shop.external_shop, "booking" => @shop.events.find(params[:id].to_i)}
      render :text => @shop.template("reminder").render(assigns), :status => 200, :content_type => 'text/plain'
    end
  end

  # http://legros-parker-and-harris6290.bookthatapp.dev:3002/apps/bookthatapp/calendar?shop=legros-parker-and-harris6290.myshopify.com
  # http://legros-parker-and-harris6290.bookthatapp.dev:3002/apps/bookthatapp/calendar?shop=legros-parker-and-harris6290.myshopify.com&handle=cocktail-bar-staff
  # http://legros-parker-and-harris6290.bookthatapp.dev:3002/apps/bookthatapp/calendar?shop=legros-parker-and-harris6290.myshopify.com&handle=black-organza-storage-bag&variant=233592770
  def calendar
    product_query = @shop.products.where(hidden: false).includes(:variants).order(:product_title)

    handles = params[:handle]
    if handles.present?
      product_query = product_query.where(:product_handle => handles)
    end

    variant = params[:variant]
    if variant.present?
      product_query = product_query.joins(:variants).where(:variants => {:external_id => variant})
    end

    variants = {}
    product_query.all.each do |product|
      variant_query = product.variants.select('external_id, title')
      if variant.present?
        variant_query = product.variants.where(:external_id => variant)
      end
      variants[product.product_handle] = variant_query.collect {|v| [v.external_id, v.title]}
    end

    assigns =  { "shop" => @shop, "products" => product_query, "variants" => variants, "location" => @shop.locations.first, "locations" => @shop.locations }
    render :text => @shop.template("calendar").render(assigns), :status => 200, :content_type => Rails.env.development? ? 'text/html' : 'application/liquid'
  end

  def booking
    content_type = Rails.env.development? ? 'text/html' : 'application/liquid'
    response.headers.delete "X-Frame-Options" # http://jerodsanto.net/2013/12/rails-4-let-specific-actions-be-embedded-as-iframes/
    respond_to do |format|
      format.html { render layout: 'barebones', content_type: content_type }
    end
  end

private
  def set_access_control_headers
    headers['Access-Control-Allow-Origin'] = '*'
    headers['Access-Control-Request-Method'] = '*'
  end

  def lookup_shop
    param_shop =  params["shop"]
    if param_shop
      name = param_shop.split('.').first
      @shop = Shop.find_by_subdomain(name)
    else
      @shop = current_account
    end
  end

  def cached_external_shop
    # required for some liquid filters to work properly
    lookup_shop
    if @shop
      ShopifyAPI::Shop.cached = @shop.external_shop
      yield
    else
      render :nothing => true, :status => 404
    end
  ensure
    ShopifyAPI::Shop.cached = nil
  end

  def ignore_action
    logger.warn "ignoring unknown action: #{params["action"]}"
  end
end
