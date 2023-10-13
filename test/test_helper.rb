require 'simplecov'
SimpleCov.start
ENV["RAILS_ENV"] = "test"
require File.expand_path('../../config/environment', __FILE__)
require 'rails/test_help'
require 'bcrypt'

include ActiveJob::TestHelper
#require 'flexmock/test_unit'

class ActiveSupport::TestCase
  # Setup all fixtures in test/fixtures/*.(yml|csv) for all tests in alphabetical order.
  #
  # Note: You'll currently still have to declare fixtures explicitly in integration tests
  # -- they do not yet inherit this setting
  fixtures :all
  FakeWeb.allow_net_connect = false
  # Add more helper methods to be used by all tests here...
  I18n.enforce_available_locales = false
  def raw_post(action, params, body)
    @request.env['RAW_POST_DATA'] = body
    resp = post(action, params)
    @request.env.delete('RAW_POST_DATA')
    resp
  end

  def set_shopify_session(arg = :test)
    @shop = shops(arg)
    @request.host = "#{@shop.subdomain}.bookthatapp.dev"
    @request.session[:shopify] = ShopifyAPI::Session.new(@request.host)
  end

  def add_params
    @res_params = {:variant_id => 1, :quantity => 1, :start => "2014-12-29 00:00:00 -0500", :finish => "2014-12-30 00:00:00 -0500"}
  end

  def setup_error_vars(quant = 1)
    @ressie = events(:reservation_three)
    @item = @ressie.items.last
    @start_date = @item.start
    @quant = quant
  end

  def sign_out_shopify
    @request.session[:shopify] = nil
  end

  def mock_out(method, addr, sub = "test")
    file = Rails.root.join("test/shopify_mock_fixtures/#{addr[/[^?]+/]}")
    url = "https://#{sub}.myshopify.com/admin/#{addr}"
    FakeWeb.register_uri(method, url, :body => File.read(file))
    # response = ShopifyAPI::Mock::Response.new(method, addr, File.read(file))
    file
  end

  def mock_out_with_response(method, addr, sub = "test", response_filename)
    file = Rails.root.join("test/shopify_mock_fixtures/#{response_filename}")
    url = "https://#{sub}.myshopify.com/admin/#{addr}"
    FakeWeb.register_uri(method, url, :body => File.read(file))
    # response = ShopifyAPI::Mock::Response.new(method, addr, File.read(file))
    file
  end

  def hawaii_mock_session(&block)
    ShopifyAPI::Session.temp("hawaii", "randomtoken") {
      block.call(self)
    }
  end
  def mock_session(sub = "test", &block)
      ShopifyAPI::Session.temp("test", "randomtoken") {
        block.call(self)
      }
  end
  def mock_post_shop_metafields(sub="test")
    filez = Rails.root.join("test/shopify_mock_fixtures/shop.xml") #picked random file for now.
    FakeWeb.register_uri(:post, "https://#{sub}.myshopify.com/admin/metafields.xml", :body => File.read(filez))
  end
  def mock_product_post(prod = 100383216, sub='test')
    filez = Rails.root.join("test/shopify_mock_fixtures/products/#{prod}/metafields/#{prod}.xml")
    FakeWeb.register_uri(:post, "https://#{sub}.myshopify.com/admin/products/#{prod}/metafields.xml", :body => File.read(filez))
  end

  def mock_variant_post(prod=233592770)
    filez = Rails.root.join("test/shopify_mock_fixtures/variants/#{prod}/metafields/#{prod}.xml")
    FakeWeb.register_uri(:post, "https://test.myshopify.com/admin/variants/#{prod}/metafields.xml", :body => File.read(filez))
    mock_out(:get, "variants/#{prod}.xml")
  end

  def mock_variant_post_direct(variant, sub = 'test')
    filez = Rails.root.join("test/shopify_mock_fixtures/variants/#{variant}/metafields.xml")
    FakeWeb.register_uri(:post, "https://#{sub}.myshopify.com/admin/variants/#{variant}/metafields.xml", :body => File.read(filez))
  end

  def mock_shop_for_session(name = "newshop")
    filez = Rails.root.join("test/shopify_mock_fixtures/#{name}.xml")
    FakeWeb.register_uri(:get, "https://#{name}.myshopify.com/admin/shop.xml", :body => File.read(filez))
  end
  def mock_new_session_routes(the_name = "newshop")
    mock_out :get, "script_tags.xml", the_name
    mock_out :get, "webhooks.xml", the_name
    mock_out :delete, "script_tags/421379493.xml", the_name
    mock_out :delete, "script_tags/596726825.xml", the_name
    the_file = Rails.root.join("test//shopify_mock_fixtures/post_script_tags.xml")
    the_url = "https://#{the_name}.myshopify.com/admin/script_tags.xml"
    FakeWeb.register_uri(:post, the_url, :body => File.read(the_file))
    mock_out :delete, "webhooks/4759306.xml", the_name
    mock_out :delete, "webhooks/901431826.xml", the_name
    a_file = Rails.root.join("test//shopify_mock_fixtures/webhooks/901431826.xml")
    a_url = "https://#{the_name}.myshopify.com/admin/webhooks.xml"
    FakeWeb.register_uri(:post, a_url, :body => File.read(a_file))
  end

  def mock_out_all_products_and_variants
    mock_out :get, "shop.xml"
    [1, 2, 3, 7, 9, 10, 666, 1000, 1009, 1098, 27763452, 100383216, 1003832167, 1212129201,233592771, 233592770, 65985862, 65985869].each do |x|
      mock_product_post x
      mock_variant_post x
      mock_out :get,"products/#{x}.xml"
    end
  end

  def iso_date_format(date)
    date.strftime('%Y-%m-%d')
  end
end

class ActionController::TestCase
  def json
    ActiveSupport::JSON.decode @response.body
  end
end

class ActionController::TestCase
  include Devise::TestHelpers
end
