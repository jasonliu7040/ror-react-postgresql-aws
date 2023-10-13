class CreateEventDates < ActiveRecord::Migration
  def change
    create_table :event_dates do |t|
      t.datetime :start
      t.datetime :finish
      t.references :shop
      t.references :product
      t.references :variant
      t.integer :quantity, :default => 1
      t.string :type, :default => "Item"

      t.timestamps
    end
    add_index :event_dates, :shop_id
    add_index :event_dates, :product_id
    add_index :event_dates, :variant_id
  end
end
