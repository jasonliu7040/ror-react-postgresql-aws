class ConvertEventCustomerIdToBigint < ActiveRecord::Migration
  def up
    change_column :events, :customer_id, :integer, :limit => 8
  end

  def down
    change_column :events, :customer_id, :integer
  end
end
