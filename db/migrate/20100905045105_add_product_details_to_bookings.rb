class AddProductDetailsToBookings < ActiveRecord::Migration
  def self.up
    add_column :bookings, :product_handle, :string
    add_column :bookings, :title, :string
  end
    
  def self.down
    remove_column :bookings, :product_handle
    remove_column :bookings, :title
  end
end
