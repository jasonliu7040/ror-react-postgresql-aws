class ChangeShopifyIdsToBigInt < ActiveRecord::Migration
  def up
    change_column :shops, :charge_id, :integer, :limit => 8
    change_column :events, :external_product_id, :integer, :limit => 8
    change_column :events, :external_variant_id, :integer, :limit => 8
    change_column :products, :external_id, :integer, :limit => 8
    change_column :variants, :external_id, :integer, :limit => 8
  end

  def down
    change_column :shops, :charge_id, :integer
    change_column :events, :external_product_id, :integer
    change_column :events, :external_variant_id, :integer
    change_column :products, :external_id, :integer
    change_column :variants, :external_id, :integer
  end
end
