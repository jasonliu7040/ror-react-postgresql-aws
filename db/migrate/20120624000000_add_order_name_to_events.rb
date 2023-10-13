class AddOrderNameToEvents < ActiveRecord::Migration
  def self.up
    add_column :events, :order_name, :string
  end

  def self.down
    remove_column :events, :order_name
   end
end
