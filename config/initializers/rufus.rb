require 'rufus-scheduler'

# todo - should only be run from the redis layer (1 instance)
# scheduler = Rufus::Scheduler.new(:lockfile => ".rufus-scheduler.lock")
#
# unless scheduler.down?
#   scheduler.every("60") do
#     Rails.logger.info 'Hi from Rufus - Woof!'
#   end
# end