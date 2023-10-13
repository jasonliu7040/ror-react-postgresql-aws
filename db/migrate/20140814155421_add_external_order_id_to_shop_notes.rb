class AddExternalOrderIdToShopNotes < ActiveRecord::Migration
  def change
    add_column :shop_notes, :external_order_id, :integer
  end
end
