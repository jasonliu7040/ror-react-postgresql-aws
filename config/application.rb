require File.expand_path('../boot', __FILE__)
require 'csv'
require 'rails/all'
require 'yaml'

require 'dotenv'
Dotenv.load

# prevent messages from tlsmail - http://stackoverflow.com/questions/8783400/warning-already-initialized-constant-after-installing-tlsmail-gem
require 'net/smtp'
Net.instance_eval {remove_const :SMTPSession} if defined?(Net::SMTPSession)

require 'net/pop'
Net::POP.instance_eval {remove_const :Revision} if defined?(Net::POP::Revision)
Net.instance_eval {remove_const :POP} if defined?(Net::POP)
Net.instance_eval {remove_const :POPSession} if defined?(Net::POPSession)
Net.instance_eval {remove_const :POP3Session} if defined?(Net::POP3Session)
Net.instance_eval {remove_const :APOPSession} if defined?(Net::APOPSession)

require 'tlsmail'

Bundler.require(:default, Rails.env)

# If you precompile assets before deploying to production, use this line
Bundler.require *Rails.groups(:assets => %w(development test))
# If you want your assets lazily compiled in production, use this line
# Bundler.require(:default, :assets, Rails.env)

module Bookthatapp
  class Application < Rails::Application
    config.price = 19.95
    config.trial_period = 30
    config.install_price = 75.00
    config.limited_plan_max_bookings = 10
    config.limited_plan_max_products = 10

    # shopify app auth credentials:
    if Rails.env.production?
      config.api_key = "35b63cb98175322a555e035845626664"
      config.secret  = "0b20bcb7ee6f5defa52f54bd857b2a51"
      # config.api_key = ENV['SHOPIFY_CLIENT_API_KEY']
      # config.secret = ENV['SHOPIFY_CLIENT_API_SECRET']
    elsif Rails.env.staging?
      config.api_key = "288df9aede828f14bfe4b3117adebfda"
      config.secret  = "e114c45482a27cda30013de1278bf336"
    else
      config.api_key = "a94c31105b9c6468d666a66792f3a3e6"
      config.secret  = "ff8d7282f1845157940d87f854ed74f3"
    end

    # stripe credentials
    if Rails.env.production?
      config.stripe_secret_key = "sk_live_3V6gU66oAqyRay4plxLtYOLt" # aka api_key
      config.stripe_publish_key = "pk_live_oDLCEKvepToUZFoIJIK4qnkV"
    else
      config.stripe_secret_key = "sk_test_MlmikMrWdNySEmeKn53qwlD0" # aka api_key
      config.stripe_publish_key = "pk_test_sgLXBrCs7TKSIb73wmwWQpL5"
    end

    config.embedded_app = false # shopify_app gem


    Stripe.api_key = config.stripe_secret_key

    # Settings in config/environments/* take precedence over those specified here.
    # Application configuration should go into files in config/initializers
    # -- all .rb files in that directory are automatically loaded.

    # Custom directories with classes and modules you want to be autoloadable.
    config.autoload_paths += %W(#{config.root}/lib)
    config.autoload_paths += %W(#{config.root}/lib/liquid/filters)
    config.autoload_paths += %W(#{config.root}/lib/liquid/tags)

    # Only load the plugins named here, in the order given (default is alphabetical).
    # :all can be used as a placeholder for all plugins not explicitly named.
    # config.plugins = [ :exception_notification, :ssl_requirement, :all ]

    # Activate observers that should always be running.
    # config.active_record.observers = :cacher, :garbage_collector, :forum_observer

    # Set Time.zone default to the specified zone and make Active Record auto-convert to this zone.
    # Run "rake -D time" for a list of tasks for finding time zone names. Default is UTC.
    # config.time_zone = 'Central Time (US & Canada)'
    config.generators do |g|
      g.test_framework :test_unit
    end

    # The default locale is :en and all translations from config/locales/*.rb,yml are auto loaded.
    # config.i18n.load_path += Dir[Rails.root.join('my', 'locales', '*.{rb,yml}').to_s]
    # config.i18n.default_locale = :de

    config.i18n.enforce_available_locales = true

    # JavaScript files you want as :defaults (application.js is always included).
    # config.action_view.javascript_expansions[:defaults] = %w(jquery rails)

    # Configure the default encoding used in templates for Ruby 1.9.
    config.encoding = "utf-8"

    # Configure sensitive parameters which will be filtered from the log file.
    config.filter_parameters += [:password]

    # Version of your assets, change this if you want to expire all your assets
    config.assets.version = '1.0'

    # Paperclip / AWS S3
    config.paperclip_defaults = {
      storage: :s3,
      s3_credentials: {
        bucket: ENV['PD_IMPORT_S3_BUCKET'],
        access_key_id: ENV['AWS_ACCESS_KEY_ID'],
        secret_access_key: ENV['AWS_SECRET_ACCESS_KEY'],
        s3_region: ENV['AWS_REGION']
      }
    }

    # Change the path that assets are served from
    # config.assets.prefix = "/assets"

    config.cache_store = :memory_store

    config.middleware.use Rack::ContentLength

    ActiveRecord::Base.include_root_in_json = false

    Net::SMTP.enable_tls(OpenSSL::SSL::VERIFY_NONE)
    ActionMailer::Base.smtp_settings = {
      :user_name => "gavin@shopifyconcierge.com",
      :password => "Noddy069",
      :domain => "shopifyconcierge.com",
      :address => "smtp.sendgrid.net",
      :port => 587,
      :authentication => :plain,
      :enable_starttls_auto => false
    }

    config.lograge.enabled = true
    config.lograge.ignore_actions = ['javascripts#bta', 'home#status']
    config.lograge.custom_options = lambda do |event|
      options = {}
      options[:shop] = event.payload[:shop] if event.payload[:shop]
      options[:order_id] = event.payload[:order_id] if event.payload[:order_id]
      options[:product_id] = event.payload[:product_id] if event.payload[:product_id]
      options
    end

    YAML::ENGINE.yamler = 'psych' if defined?(YAML::ENGINE)

    config.exceptions_app = self.routes

    # api
    # config.middleware.use Rack::RedisThrottle::Daily, max: 100000

    config.middleware.insert_before 0, "Rack::Cors", :debug => !Rails.env.production?, :logger => (-> { Rails.logger }) do
      allow do
        origins '*'
        resource '*', :headers => :any, :methods => [:get, :post, :put, :patch, :delete, :options, :head]
      end
    end

    config.after_initialize do |app|
      app.config.paths.add 'app/presenters', :eager_load => true
    end


    config.assets.precompile += [ 'admin/custom.css', 'admin/appviews.css', 'admin/cssanimations.css', 'admin/dashboards.css', 'admin/forms.css', 'admin/gallery.css', 'admin/graphs.css', 'admin/mailbox.css', 'admin/miscellaneous.css', 'admin/pages.css', 'admin/tables.css', 'admin/uielements.css', 'admin/widgets.css', 'admin/commerce.css' ]
    config.assets.precompile += [ 'admin/custom.js', 'admin/appviews.js', 'admin/cssanimations.js', 'admin/dashboards.js', 'admin/forms.js', 'admin/gallery.js', 'admin/graphs.js', 'admin/mailbox.js', 'admin/miscellaneous.js', 'admin/pages.js', 'admin/tables.js', 'admin/uielements.js', 'admin/widgets.js', 'admin/commerce.js' ]


    config.active_record.raise_in_transactional_callbacks = true
    config.middleware.use Rack::Attack
    config.browserify_rails.commandline_options = '-t babelify'
    config.browserify_rails.paths << '/lib/assets/javascripts/'
  end
end
