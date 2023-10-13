class AddBookingItemsCountToProducts < ActiveRecord::Migration
  def change
    add_column :products, :booking_items_count, :integer, :default => 0, :null => false
    add_column :products, :variants_count, :integer, :default => 0, :null => false
  end
end
