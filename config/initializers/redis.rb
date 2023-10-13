if Rails.env.production?
  host = '172.31.44.213'
  port = 6379
  pass = 'noddy69'

  $redis = Redis.new(:host => host, :port => port, :password => pass)

  # set RedisStore for mini-profiler
  Rack::MiniProfiler.config.storage_options = {:host => host, :port => port, :password => pass }
  Rack::MiniProfiler.config.storage = Rack::MiniProfiler::RedisStore
else
  $redis = Redis.new
end