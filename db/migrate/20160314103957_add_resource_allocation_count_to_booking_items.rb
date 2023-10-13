class AddResourceAllocationCountToBookingItems < ActiveRecord::Migration
  def self.up
    add_column :booking_items, :resource_allocations_count, :integer, null:false, default: 0
    BookingItem.find_each {|bi| BookingItem.reset_counters(bi.id, :resource_allocations)}
  end

  def self.down
    remove_column :booking_items, :resource_allocations_count
  end
end
