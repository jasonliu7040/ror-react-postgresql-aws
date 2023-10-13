Bookthatapp::Application.configure do
  # Settings specified here will take precedence over those in config/application.rb
  ::DOMAIN = "www.bookthatapp.dev:3002"

  config.eager_load = false

  # In the development environment your application's code is reloaded on
  # every request.  This slows down response time but is perfect for development
  # since you don't have to restart the webserver when you make code changes.
  config.cache_classes = false


  # Show full error reports and disable caching
  config.consider_all_requests_local       = true
  config.action_controller.perform_caching = false

  # Don't care if the mailer can't send
  config.action_mailer.raise_delivery_errors = true

  # Print deprecation notices to the Rails logger
  config.active_support.deprecation = :log

  config.log_level = :debug

  ActiveResource::Base.logger = Logger.new(STDOUT)
  ActiveResource::Base.logger.level = Logger::DEBUG

  config.log_tags = [:subdomain, :remote_ip]

  # Fallback to assets pipeline if a precompiled asset is missed
  config.assets.compile = true

  # Expands the lines which load the assets
  config.assets.debug = false

  config.action_mailer.default_url_options = { host: 'www.bookthatapp.dev', port: 3002 }
end
