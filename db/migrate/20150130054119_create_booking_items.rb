class CreateBookingItems < ActiveRecord::Migration
  def change
    create_table :booking_items do |t|
      t.references :shop,    :null => false
      t.references :booking, :null => false
      t.datetime :start,     :null => false
      t.datetime :finish,    :null => false
      t.references :product, :null => false
      t.integer  :external_product_id, :limit => 8, :null => false
      t.string :sku
      t.references :variant, :null => false
      t.integer  :external_variant_id, :limit => 8, :null => false
      t.integer :quantity,   :default => 1, :null => false
      t.decimal :price,      :precision => 8, :scale => 2
      t.integer :lag_added
      t.timestamps
    end

    add_index :booking_items, [:product_id, :variant_id]

    add_column :products, :booking_items_count, :integer, default: 0, null: false
    add_column :variants, :booking_items_count, :integer, default: 0, null: false
    add_column :events, :booking_items_count, :integer, default: 0, null: false
    add_column :events, :booking_names_count, :integer, default: 0, null: false
  end
end
