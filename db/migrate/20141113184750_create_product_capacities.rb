class CreateProductCapacities < ActiveRecord::Migration
  def change
    create_table :product_capacities do |t|
      t.references :product
      t.references :resource
      t.references :variant
      t.integer :quantity

      t.timestamps
    end
    add_index :product_capacities, :product_id
    add_index :product_capacities, :resource_id
    add_index :product_capacities, :variant_id
  end
end
