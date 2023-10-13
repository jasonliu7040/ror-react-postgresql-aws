require 'rack-mini-profiler'

# initialization is skipped so trigger it
Rack::MiniProfilerRails.initialize!(Rails.application)

# Rack::MiniProfiler.config.user_provider = Proc.new{|env| CurrentUser.get(env)} <= Figure out how to get current subdomain

Rack::MiniProfiler.config.start_hidden = false
Rack::MiniProfiler.config.use_existing_jquery = true
Rack::MiniProfiler.config.position

# set MemoryStore
Rack::MiniProfiler.config.storage = Rack::MiniProfiler::MemoryStore


# see redis.rb for prod setup