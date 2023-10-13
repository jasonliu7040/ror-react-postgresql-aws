class AddLineItemIdToBookingItem < ActiveRecord::Migration
  def change
    add_column :booking_items, :line_item_id, :integer, :limit => 8
  end
end
