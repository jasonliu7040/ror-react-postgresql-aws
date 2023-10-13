class AddOrderIdToBookings < ActiveRecord::Migration
  def self.up
    add_column :bookings, :order_id, :integer
    add_column :bookings, :status, :integer
  end
    
  def self.down
    remove_column :bookings, :order_id
    remove_column :bookings, :status
  end
end
