class AddBookingCountToShops < ActiveRecord::Migration
  def self.up
    add_column :shops, :bookings_count, :integer, null: false, default: 0
    Shop.ids.each {|id| Shop.reset_counters(id, :bookings) }
  end

  def self.down
    remove_column :shops, :bookings_count
  end
end
