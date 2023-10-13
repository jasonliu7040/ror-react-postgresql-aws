class AddProductIdIndexToVariants < ActiveRecord::Migration
  def self.up
    add_index :variants, :product_id, :name=>'product_id_index'
  end

  def self.down
    remove_index :variants, 'product_id_index'
  end
end
