class ConvertBigintsToBigints < ActiveRecord::Migration
  # trying to fix RB 1845 - mysql bigint columns don't seem to understand they are limit 8
  def change
    change_column :events, :order_id, :integer, :limit => 8
    change_column :events, :customer_id, :integer, :limit => 8
    change_column :events, :external_product_id, :integer, :limit => 8
    change_column :events, :external_variant_id, :integer, :limit => 8

    change_column :booking_items, :external_product_id, :integer, :limit => 8
    change_column :booking_items, :external_variant_id, :integer, :limit => 8
    change_column :booking_items, :line_item_id, :integer, :limit => 8

    change_column :products, :external_id, :integer, :limit => 8
    change_column :products, :duration_option_external_id, :integer, :limit => 8

    change_column :variants, :external_id, :integer, :limit => 8

    change_column :option_durations, :option_external_id, :integer, :limit => 8

    change_column :shops, :charge_id, :integer, :limit => 8
  end
end
