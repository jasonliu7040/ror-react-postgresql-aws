class AddColumnsToProductImports < ActiveRecord::Migration
  def change
    add_column :product_imports, :capacity_type, :integer
    add_column :product_imports, :capacity, :integer, default: 0
    add_column :product_imports, :capacity_options, :text, size: 500
    add_column :product_imports, :duration_type, :integer
    add_column :product_imports, :duration, :integer, default: 0
  end
end
