class AddRangeToProductImports < ActiveRecord::Migration
  def change
    add_column :product_imports, :range_basis, :integer, :default => 0
    add_column :product_imports, :range_min, :integer, :default => 0
    add_column :product_imports, :range_max, :integer, :default => 0
  end
end
