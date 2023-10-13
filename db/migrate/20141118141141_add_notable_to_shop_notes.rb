class AddNotableToShopNotes < ActiveRecord::Migration
  def change
    add_column :shop_notes, :noteable_type, :string
    add_column :shop_notes, :noteable_id, :integer
  end
end
