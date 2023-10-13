class AddBookingItemIdColumnToBookingNames < ActiveRecord::Migration
  def change
    add_column :booking_names, :booking_item_id, :integer
  end
end
