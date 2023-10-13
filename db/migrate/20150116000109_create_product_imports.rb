class CreateProductImports < ActiveRecord::Migration
  def change
    create_table :product_imports do |t|
      t.references :shop
      t.string :state
      t.integer :product_count, :default => "0"
      t.integer :import_count,  :default => "0"
      t.string :profile,   :null => false
      t.integer :mindate
      t.string :lead_time, :default => "0"
      t.integer :lag_time, :default => 0
      t.string :filename

      t.timestamps
    end
    add_index :product_imports, :shop_id
  end
end
