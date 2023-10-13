class AddNameToBookings < ActiveRecord::Migration
  def self.up
    add_column :bookings, :name, :string
  end
    
  def self.down
    remove_column :bookings, :name
  end
end
