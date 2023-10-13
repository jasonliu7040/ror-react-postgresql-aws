SHOPIFY_CALLBACK_URLS = {
    development: 'http://www.bookthatapp.dev:3002/auth/shopify/callback',
    test: 'http://www.bookthatapp.dev:3002/auth/shopify/callback',
    staging: 'https://www.bookthatapp-staging.com/auth/shopify/callback',
    production: 'https://www.bookthatapp.com/auth/shopify/callback'
}

Rails.application.config.middleware.use OmniAuth::Builder do
  provider :shopify, Bookthatapp::Application.config.api_key, Bookthatapp::Application.config.secret,
           :scope => 'write_products,read_orders,read_customers,write_script_tags,write_themes',
           :callback_url => SHOPIFY_CALLBACK_URLS[Rails.env.to_sym],
           :setup => lambda { |env| params = Rack::Utils.parse_query(env['QUERY_STRING'])
           env['omniauth.strategy'].options[:client_options][:site] = "https://#{params['shop']}" }
end

OmniAuth.config.logger = Rails.logger