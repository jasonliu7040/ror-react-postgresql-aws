class CreateResourceConstraints < ActiveRecord::Migration
  def change
    create_table :resource_constraints do |t|
      t.references :resource
      t.references :product

      t.timestamps
    end
    add_index :resource_constraints, :resource_id
    add_index :resource_constraints, :product_id
  end
end
