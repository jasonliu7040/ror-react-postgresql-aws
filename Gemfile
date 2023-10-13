source 'https://rubygems.org'

gem 'rails', '~> 4.2'
gem 'mysql2'
gem 'shopify_app'
gem 'kgio', '2.9.2'
gem 'kaminari', '0.15.1' # remove dependency when 0.16.2 released. see https://github.com/amatsuda/kaminari/issues/581
gem 'ice_cube', '0.14.0'
gem 'tzinfo'
gem 'tzinfo-data'
gem 'chronic', '0.9.1'
gem 'liquid'
gem 'hpricot'
gem 'devise'
gem 'exception_notification', '4.0.0'
# gem 'validates_email_format_of', :git => 'git://github.com/alexdunae/validates_email_format_of.git'
gem 'pdfkit'
gem 'fastercsv', :platforms => :ruby_18
gem 'nested_form'
gem 'redis'
gem 'redis-namespace'
gem 'dynamic_form'
gem 'twilio-ruby'
gem 'httparty', '0.11.0'
gem 'bitly'
gem 'geocoder'
gem 'mousetrap-rails'
gem 'request_exception_handler'
gem 'rest-client'
gem 'unicorn'
gem 'newrelic_rpm'
gem 'delayed_job_active_record'
gem 'daemons'
gem 'icalendar'
gem 'paranoia'
gem 'paper_trail', '~> 3.0.2'
gem 'rollbar'
gem 'therubyracer'
gem 'american_date'
# gem 'stripe', :git => 'https://github.com/stripe/stripe-ruby'
gem 'stripe_event'
gem 'gabba'
gem 'lograge'
gem 'state_machines-activerecord'
gem 'cocoon'
gem 'quiet_assets'
gem 'pry'
gem 'tlsmail', require: false
gem 'rack-mini-profiler', require: false # has to be after db gems - see config/initializers/rack_profiler.rb
gem 'rufus-scheduler'
gem 'flipper'
gem 'flipper-activerecord'
gem 'htmlentities'
gem 'rack-attack'
# gem 'premailer-rails' # having problems in production - "undefined method `remove' for #<Hpricot::Elem:0x00000009ccb3a8>"
gem 'aws-sdk', '~> 2.3'
gem 'paperclip', '~> 5.0.0.beta1'
gem 'dotenv-rails'
gem 'rectify'
gem 'transaction_retry'

gem 'jquery-rails'
# api
gem 'active_model_serializers'
gem 'rack-cors', :require => 'rack/cors'
# gem 'rspec-api_helpers', github: 'kollegorna/rspec-api_helpers', :group => [:test, :development] # rails 4 dependency
# gem 'active_hash_relation' # rails 4 dependency
# gem 'redis-throttle', git: 'git://github.com/andreareginato/redis-throttle.git' # rails 4 dependency

# group :assets do
  gem 'sass-rails'#,   '~> 3.2.3'
  gem 'coffee-rails'#, '~> 3.2.1'
  gem 'uglifier'#, '>= 1.0.3'
#end

gem 'bootstrap-sass', '~> 3.3.6'
gem 'font-awesome-rails', '>= 4.3.0.0'
gem 'react-rails'
gem 'browserify-rails'
gem 'sprockets', '3.6.3'

group :development, :test do
  gem 'metric_fu', '~> 4.11.1'
  gem 'shopify-mock'
  gem 'nokogiri'
  gem 'rspec-rails', '~> 3.4'
  gem 'minitest-spec-rails', git: "git://github.com/metaskills/minitest-spec-rails.git"
  gem 'capybara'
  gem 'sqlite3'
    gem "rack-test", require: "rack/test"
end

group :test do
  gem 'database_cleaner'
  gem 'simplecov', :require => false
  gem 'test_after_commit'
  gem 'factory_girl_rails'
  gem 'rails-perftest'
  gem 'ruby-prof'
end

group :development do
  gem 'rb-notifu'
  gem 'bullet'
  gem 'railroady' # bundle exec rake diagram:all
end
