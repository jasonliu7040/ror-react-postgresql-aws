class CreateResourceAllocations < ActiveRecord::Migration
  def change
    create_table :resource_allocations do |t|
      t.references :resource
      t.references :booking_item
      t.decimal    :allocation, :precision => 2, :default => 1.0
      t.timestamps
    end
    add_index :resource_allocations, :resource_id
    add_index :resource_allocations, :booking_item_id
  end
end
