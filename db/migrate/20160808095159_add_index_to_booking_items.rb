class AddIndexToBookingItems < ActiveRecord::Migration
  def change
    add_index :booking_items, :booking_id
  end
end
