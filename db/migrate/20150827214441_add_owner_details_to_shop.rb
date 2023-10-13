class AddOwnerDetailsToShop < ActiveRecord::Migration
  def change
    add_column :shops, :email, :string, :default => ''
    add_column :shops, :owner, :string, :default => ''
  end
end
