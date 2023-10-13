class ChangeBookingItemToItems < ActiveRecord::Migration
  def change
    drop_table :booking_items
   remove_column :event_dates, :booking_item_id
    rename_column :booking_names, :booking_item_id, :item_id
    add_column :event_dates, :event_id, :integer
  end
end
