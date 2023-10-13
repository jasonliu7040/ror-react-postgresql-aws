class AddShopIdToResources < ActiveRecord::Migration
  def change
    add_column :resources, :shop_id, :integer
    add_column :resource_groups, :shop_id, :integer
  end
end
