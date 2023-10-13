class AddHiddenToProducts < ActiveRecord::Migration
  def change
    add_column :products, :hidden, :boolean, :default => false
  end
end
