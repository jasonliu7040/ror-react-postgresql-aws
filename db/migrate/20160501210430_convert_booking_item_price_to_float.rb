class ConvertBookingItemPriceToFloat < ActiveRecord::Migration
  def change
    change_column :booking_items, :price, :float, :limit => 24
  end
end
