require 'time'
require 'chronic'
require 'hooks_controller_deprecated_function_names'

class HooksController < ApplicationController
  include BookThatAppUtils
  include DeprecatedHookNames

  # around_action :log_everything, only: [:orders_create, :products_update]

  skip_before_filter :verify_authenticity_token
  before_filter :verify_webhook, :except => [:verify_webhook, :uninstall, :mail]
  before_filter :lookup_shop, :except => [:mail]
  rescue_from 'MultiJson::LoadError' do |exception|
    logger.error exception.to_s
    render :nothing => true, :status => 200
  end

  # http://legros-parker-and-harris6290.bookthatapp.dev:3002/hooks/mail?email=emailrecipient@domain.com&event=open&booking=21&category=reminder&timestamp=1366166040&shop=legros-parker-and-harris6290
  # curl -X POST -H "Content-Type: application/json" -d '[{"email":"john.doe@sendgrid.com","timestamp":1337197600,"smtp-id":"<4FB4041F.6080505@sendgrid.com>","event":"processed"},{"email":"john.doe@sendgrid.com","timestamp":1337966815,"category":"newuser","event":"click","url":"http://sendgrid.com"},{"email":"john.doe@sendgrid.com","timestamp":1337969592,"smtp-id":"<20120525181309.C1A9B40405B3@Example-Mac.local>","event":"processed"}]' http://legros-parker-and-harris6290.bookthatapp.dev:3002/hooks/mail
  def mail
    Delayed::Job.enqueue CreateEmailEventJob.new(params['_json']), :priority => 50
    render :nothing => true, :status => 200
  end

  def shop_update
    if @shop && @shop.charge_id == -2 # staff or dev shop
      @shop.update_attribute(:charge_id, -1)
    end
    render :nothing => true, :status => 200
  end

  # echo '' | curl -X POST -H 'Content-type: text/xml' -H 'X-SHOPIFY-SHOP-DOMAIN: green-london-shop.myshopify.com' -d @- http://www.bookthatapp.dev:3005/hooks/app/uninstalled
  def app_uninstalled
    if @shop
      Delayed::Job.enqueue AppUninstallJob.new(@shop.id), :priority => 10
    end
    render :nothing => true, :status => 200
  end

  # cat test/event-date-attribute.xml | curl -X POST -H 'Content-type: text/xml' -H 'X-SHOPIFY-SHOP-DOMAIN: legros-parker-and-harris6290.myshopify.com' -H 'X-SHOPIFY-ORDER-ID: 52425152' -d @- http://localhost:3005/hooks/order/create
  # cat test/lip.xml | curl -X POST -H 'Content-type: text/xml' -H 'X-SHOPIFY-SHOP-DOMAIN: legros-parker-and-harris6290.myshopify.com' -H 'X-SHOPIFY-ORDER-ID: 144974050' -d @- http://localhost:3005/hooks/order/create
  # cat test/aloha.xml | curl -X POST -H 'Content-type: text/xml' -H 'X-SHOPIFY-SHOP-DOMAIN: legros-parker-and-harris6290.myshopify.com' -H 'X-SHOPIFY-ORDER-ID: 152792680' -d @- http://localhost:3005/hooks/order/create

  # cat test/booking-attribute.xml | curl -X POST -H 'Content-type: text/xml' -H 'X-SHOPIFY-SHOP-DOMAIN: legros-parker-and-harris6290.myshopify.com' -H 'X-SHOPIFY-ORDER-ID: 52425152' -d @- http://localhost:3005/hooks/order
  def orders_create
    if @shop
      order_id = request.headers.env['HTTP_X_SHOPIFY_ORDER_ID'].to_i
      Delayed::Job.enqueue OrderCreateJob2.new(@shop.id, order_id)
    end
    render :nothing => true, :status => 200
  end

  # echo '<?xml version="1.0" encoding="UTF-8"?><order><id type="integer">33327962</id><financial-status>paid</financial-status></order>' | curl -X POST -H 'Content-type: text/xml' -H 'X-SHOPIFY-SHOP-DOMAIN: legros-parker-and-harris6290.myshopify.com' -H 'X-SHOPIFY-ORDER-ID: 52425152' -d @- http://localhost:3005/hooks/paid
  def orders_paid
    handle_order_job OrderUpdatedJob
  end

# Order Paid was the same code.
  def orders_updated
    handle_order_job OrderUpdatedJob
  end

  def orders_cancelled
    handle_order_job OrderCancellationJob
  end

  # cat test/product-update.xml | curl -X POST -H 'Content-type: text/xml' -H 'X-SHOPIFY-SHOP-DOMAIN: legros-parker-and-harris6290.myshopify.com' -H 'X-Shopify-Product-Id: 100383216' -d @- http://localhost:3002/hooks/products/update
  def products_update
    render :nothing => true, :status => 200

    if @shop
      # check if known product
      eid = request.headers.env['HTTP_X_SHOPIFY_PRODUCT_ID'].to_i
      if Product.exists?(:shop_id => @shop.id, :external_id => eid)
        job = ProductSyncJob.new(@shop.id, eid)

        # return if job already queued
        return unless job.reserve

        Delayed::Job.enqueue job, :priority => 5
      end
    end
  end

  # echo '' | curl -X POST -H 'Content-type: text/xml' -H 'X-SHOPIFY-SHOP-DOMAIN: legros-parker-and-harris6290.myshopify.com' -d @- http://www.bookthatapp.dev:3005/hooks/products/delete
  def products_delete
    if @shop
      eid = request.headers.env['HTTP_X_SHOPIFY_PRODUCT_ID'].to_i
      if Product.exists?(:shop_id => @shop.id, :external_id => eid)
        Delayed::Job.enqueue ProductDeleteJob.new(@shop.id, eid), :priority => 5
      end
    end

    render :nothing => true, :status => 200
  end

  private
  def lookup_shop
    sub = request.headers.env['HTTP_X_SHOPIFY_SHOP_DOMAIN']
    if sub
      name = sub.split('.').first
      @shop = Shop.find_by_subdomain(name)
    end
  end

  def verify_webhook
    unless request.headers.env['HTTP_X_SHOPIFY_TEST']
      if Rails.env.production?
        data = request.body.read.to_s
        hmac_header = request.headers.env['HTTP_X_SHOPIFY_HMAC_SHA256']
        digest  = OpenSSL::Digest::Digest.new('sha256')
        calculated_hmac = Base64.encode64(OpenSSL::HMAC.digest(digest, Bookthatapp::Application.config.secret, data)).strip
        unless calculated_hmac == hmac_header
          head :unauthorized
        end
        request.body.rewind
      end
    end
  end

  def handle_order_job(order_job_class_name)
    if @shop
      order_id = request.headers.env['HTTP_X_SHOPIFY_ORDER_ID'].to_i
      Delayed::Job.enqueue order_job_class_name.new(@shop.id, order_id) if Event.exists?(:shop_id => @shop.id, :order_id => order_id)
    end
    render :nothing => true, :status => 200
  end

  def log_everything
    log_headers
    yield
  ensure
    log_response
  end

  def log_headers
    http_envs = {}.tap do |envs|
      request.headers.each do |key, value|
        envs[key] = value if ['http', 'x-'].any? {|word| key.downcase.start_with?(word)}
      end
    end

    Rails.logger.info "Received #{request.method.inspect} to #{request.url.inspect} from #{request.remote_ip.inspect}. Processing with headers #{http_envs.inspect} and params #{params.inspect}"
  end

  def log_response
    Rails.logger.info "Responding with #{response.status.inspect} => #{response.body.inspect}"
  end
end
