class AddMindateToProducts < ActiveRecord::Migration
  def change
    add_column :products, :mindate, :integer, :null => false, :default => 0
    execute "update products set mindate = lead_time where lead_time is not null"
    execute "update products set lead_time = 0"
  end
end
