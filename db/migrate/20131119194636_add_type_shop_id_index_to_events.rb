class AddTypeShopIdIndexToEvents < ActiveRecord::Migration
  def self.up
    add_index :events, [:type, :shop_id], :name=>'type_shop_id_index'
  end

  def self.down
    remove_index :events, 'type_shop_id_index'
  end
end
