class AddRangeCountBasisToProducts < ActiveRecord::Migration
  def change
    add_column :products, :range_count_basis, :integer, :default => 0
  end
end
