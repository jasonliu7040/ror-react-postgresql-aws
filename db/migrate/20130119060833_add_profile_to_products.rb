class AddProfileToProducts < ActiveRecord::Migration
  def change
    add_column :products, :profile, :string
  end
end
