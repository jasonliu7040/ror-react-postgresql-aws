class AddTypeOrderIdIndexToEvents < ActiveRecord::Migration
  def self.up
    add_index :events, [:type, :order_id], :name=>'type_order_id_index'
  end

  def self.down
    remove_index :events, 'type_order_id_index'
  end
end
