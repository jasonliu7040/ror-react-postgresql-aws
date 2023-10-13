class ConvertEventOrderIdToBigInt < ActiveRecord::Migration
  def up
    change_column :events, :order_id, :integer, :limit => 8
  end

  def down
    change_column :events, :order_id, :integer
  end
end
