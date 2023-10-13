class AddShopIdAndExternalIdIndexToProducts < ActiveRecord::Migration
  def self.up
    add_index :products, [:shop_id, :external_id], :name=>'shop_id_external_id_index'
  end

  def self.down
    remove_index :products, 'shop_id_external_id_index'
  end
end
