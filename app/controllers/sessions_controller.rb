class SessionsController < ApplicationController
  layout "brochure"

  def new
    authenticate if params[:shop].present?
  end

  def create
    begin
      authenticate
    rescue URI::InvalidURIError
      flash[:error] = "Not a valid store address. Please try again."
      redirect_to :action => 'index'
    end
  end

  def show
    tour = false
    if response = request.env['omniauth.auth']
      sess = ShopifyAPI::Session.new(params[:shop], response['credentials']['token'])
      session[:shopify] = sess

      ShopifyAPI::Base.activate_session(sess)
      begin
        shop = ShopifyAPI::Shop.current
        sub = shop.myshopify_domain.split('.').first
        account = Shop.find_by_shop_id(shop.id)

        if account.nil?
          logger.info "New account: #{sub}"
          flash[:info] = "Thanks for signing up, and welcome aboard!"

          account = Shop.new(
              :shop_id => shop.id,
              :subdomain => sub,
              :site => session[:shopify].site,
              :timezone => shop.timezone[12..shop.timezone.length],
              :charge_id => ['staff', 'affiliate'].include?(shop.plan_name) ? -2 : -1,
              :oauth_token => response['credentials']['token'],
              :email => shop.email,
              :owner => shop.shop_owner
          )

          account.save

          tour = true

          Notifier.delay.signup_email(account)

          redirect_to :controller => 'events', :subdomain => sub, :anchor => tour ? 'guider=first' : nil
        else
          flash[:notice] = "Logged in"
          redirect_to :controller => 'events', :subdomain => sub
        end
      rescue ActiveResource::UnauthorizedAccess
        flash[:error] = "We are having problems accessing your store. Please try again."
        redirect_to :action => 'index'
      ensure
        ShopifyAPI::Base.site = nil
      end

      session[:return_to] = nil
    else
      flash[:error] = "Could not log in to Shopify store."
      redirect_to :action => 'new'
    end
  end

  def destroy
    session[:shopify] = nil
    flash[:notice] = "Successfully logged out."
    redirect_to :action => 'new', :subdomain => "www"
  end

  protected

  def authenticate
    if shop_name = sanitize_shop_param(params)
      redirect_to "/auth/shopify?shop=#{shop_name}"
    else
      redirect_to return_address
    end
  end

  def return_address
    session[:return_to] || root_url
  end

  def sanitize_shop_param(params)
    return unless params[:shop].present?
    name = params[:shop].downcase.strip.gsub(/[\s&]/, '-').chomp('.') #rollbar had someone enter &
    name += '.myshopify.com' unless name.ends_with?('.myshopify.com')
    URI("http://#{name}").host
  end

end
