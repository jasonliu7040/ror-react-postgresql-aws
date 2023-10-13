require 'flipper/adapters/activerecord'
adapter = Flipper::Adapters::ActiveRecord.new
$flipper = Flipper.new(adapter)
