#
# Mapping between a booking_item and resource
#
class ResourceAllocation < ActiveRecord::Base
  belongs_to :booking_item, counter_cache: true
  belongs_to :resource
  accepts_nested_attributes_for :resource, :reject_if => :all_blank
end
