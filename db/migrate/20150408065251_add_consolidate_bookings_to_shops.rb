class AddConsolidateBookingsToShops < ActiveRecord::Migration
  def change
    add_column :shops, :consolidate_bookings, :boolean, :default => true
  end
end
