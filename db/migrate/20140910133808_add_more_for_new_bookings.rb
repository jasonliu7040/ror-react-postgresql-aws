class AddMoreForNewBookings < ActiveRecord::Migration
  def up
    change_column :event_dates, :type, :string,  :default => "Item"
    rename_column :products, :booking_items_count, :items_count
    add_column :events, :cart_token, :string
  end

  def down
    change_column :event_dates, :type, :string, :default => "Reservations"
    rename_column :products, :items_count, :booking_items_count
    remove_column :events, :cart_token, :string
  end
end
