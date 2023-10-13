class AddQuantityToBookingItem < ActiveRecord::Migration
  def change
    drop_table :booking_items if ActiveRecord::Base.connection.table_exists? :booking_items
    create_table :booking_items do |t|
      t.references :booking
      t.references :product
      t.references :variant
      t.integer :quantity
      t.decimal :price, :precision => 8, :scale => 2
      t.integer :shop_product_id, :limit => 8
      t.integer :shop_variant_id, :limit => 8
      t.string :sku
      t.timestamps
    end
  end
end
