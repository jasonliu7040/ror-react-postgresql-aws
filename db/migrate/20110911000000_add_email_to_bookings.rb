class AddEmailToBookings < ActiveRecord::Migration
  def self.up
    add_column :bookings, :email, :string
    add_column :bookings, :customer_id, :integer
    add_column :shops, :settings, :text
  end
    
  def self.down
    remove_column :bookings, :email
    remove_column :bookings, :customer_id
    remove_column :shops, :settings
  end
end
