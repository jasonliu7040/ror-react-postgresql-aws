# The controller used when you need a method in many places.
class ApplicationController < ActionController::Base
  before_filter :track_referer, :check_plan_and_require_account, :miniprofiler
  before_filter :set_specific_layout
  rescue_from ActiveResource::ClientError, :with => :client_error
  rescue_from ActiveResource::UnauthorizedAccess, :with => :unauthorized_access
  rescue_from OAuth2::Error, :with => :unauthorized_access

  include BookThatAppUtils
  include HandleItem
  protect_from_forgery

  rescue_from 'REXML::ParseException' do |exception|
    render :text => exception.to_s, :status => 200
  end

  def not_found
    respond_to do |format|
      format.html { render :template => 'application/404', :layout => 'brochure', :status => 404 }
      format.js {render :json => {:message => 'The requested resource does not exist'}, :status => 404}
      format.all { render :nothing => true, :status => 404 }
    end
  end

  # For logging shop with lograge
  def append_info_to_payload(payload)
    super

    domain = request.headers['HTTP_X_SHOPIFY_SHOP_DOMAIN']
    payload[:shop] = domain.split('.').first if domain

    order_id = request.headers['HTTP_X_SHOPIFY_ORDER_ID']
    payload[:order_id] = order_id if order_id

    product_id = request.headers['HTTP_X_SHOPIFY_PRODUCT_ID']
    payload[:product_id] = product_id if product_id
  end

protected
  #this should spit out start or render error
  def client_error(ce)
    home_direct = redirect_to(:controller => "home", :action => "index", :subdomain => false)
    case ce.response.code.to_s
    when '429'
      redirect_to :template => 'application/429', :status => :not_found
    when '401'
      home_direct
    else
      scope = {}
      scope[:person] = current_account
      Rollbar.scoped(scope) do
        Rollbar.notifier.log('error', ce, :use_exception_level_filters => true)
      end

      home_direct
    end
  end

  def unauthorized_access
    flash[:error] = "BookThatApp is currently not authorized to access your store. Please sign up to allow access."
    redirect_to login_url(subdomain: "www")
  end

  # Will either fetch the current account or return nil if none is found
  def current_account
    @account ||= Shop.find_by_subdomain(request.subdomain)
    @shop = @account # TODO: @shop everywhere (replace @account and current_account)
  end
  helper_method :current_account
  #taking over for subdomain_fu
  def current_subdomain
    @current_subdomain ||= request.subdomain
  end
  helper_method :current_subdomain
  # Shopify Shop object
  def current_shop
    session[:shopify]
  end
  helper_method :current_shop

  def current_timezone
    @current_timezone = current_account.tz
  end

  helper_method :current_timezone

  def render_json_error(error_string = "Error Processing: ", status_code = 404, error_messages = [])
    if error_messages.present?
      concated_array = error_messages.map {|key,value| value}
      concated_msgs = concated_array.flatten.join(' ')
      render :json => {:error => error_string + " " + concated_msgs}, status: status_code
    else
      render :json => {:error => error_string}, status: status_code
    end

  end

  def only_admin
    ['legros-parker-and-harris6290', 'pragmaticinsights'].include? @account.subdomain
  end
  helper_method :render_json_error, :only_admin

  # before_filter for controllers
  def account_required
    if ["availability"].include?(controller_name)
      shop_not_found_error unless current_account
    else
      if @account.present?
        cookies[:bta_admin] = "true" if @account.subdomain == 'legros-parker-and-harris6290' # backdoor for accessing accounts. TODO: replace with devise

        if is_admin? || /\.json|\.ics/ =~ request.fullpath
          ::NewRelic::Agent.add_custom_attributes(:account => @account.subdomain)
        else
          shop_not_found_error("You are not allowed to view the subdomain")
        end
      else
        shop_not_found_error
      end
    end
  end

  def is_admin?
    shopify_sesh = current_shop

    if shopify_sesh.present?
      session_sub = shopify_sesh.subdomain
      session_sub == "legros-parker-and-harris6290" || (cookies[:bta_admin] == "true") || session_sub == @account.subdomain
    else
      false
    end
  end

  def shop_not_found_error(msg = "")
    msg =  "Could not find the shop '#{request.subdomain}'" if msg.blank?
    flash[:error] = msg
    logger.info msg
    @account = false
    redirect_to :controller => "home", :action => "index", :subdomain => "www"
  end

  def ensure_not_blacklisted
    if $blacklisted.include?(request.subdomain)
      flash[:notice] = "Your account has been suspended because of suspicious or malicious activities."
      redirect_to login_url(subdomain: "www")
    end
  end

  def track_referer
    ::NewRelic::Agent.add_custom_attributes(:referer => request.referer)
  end

  def check_plan_and_require_account
    # these controllers don't have a subdomain
    unless  ['home', 'hooks', 'javascripts', 'login', 'navigate', 'proxy', 'sessions', 'tests', 'embeds'].include?(controller_name)
      current_account
    end

    # these controllers and modules don't need to authenticate
    unless  ['application', 'availability', 'home', 'hooks', 'javascripts', 'login', 'navigate', 'proxy', 'sessions', 'tests', 'embeds'].include?(controller_name) || ['api'].any?{|module_name| controller_path.include?("#{module_name}/")}
      account_required
      check_plan if @account
    end
  end

  def check_plan
    @notification_count = @account.shop_notes.action_items.count
    @plan_exceeded = plan_exceeded?
    redirect_to :controller => "charges" if @plan_exceeded && (controller_name != "charges")
  end

  def plan_exceeded?
    book_plan = Bookthatapp::Application.config
    @bookings_count = current_account.bookings.count
    @products_count = @account.products.count
    @plan_exceeded = (@account.charge_id == -1 &&
                      (@bookings_count > book_plan.limited_plan_max_bookings ||
                       @products_count > book_plan.limited_plan_max_products))
  end
  helper_method :plan_exceeded?

  def miniprofiler
    Rack::MiniProfiler.authorize_request if params[:pp].present? || (params[:controller] == 'availability' && params[:action] == 'schedule')
  end

  def set_specific_layout
    return if current_layout == "brochure"
    ui_version( proc { self.class.layout 'admin' },
                proc { self.class.layout 'application' } )
  end


  def current_layout
    self.send :_layout
  end

  def ui_version(callback_for_new, callback_for_old)
    if $flipper[:new_ui].enabled?(current_account)
      return callback_for_new.call if callback_for_new.present?
    else
      return callback_for_old.call if callback_for_old.present?
    end
  end
  helper_method :ui_version

end
