class AddProductIdIndextToScheduleItems < ActiveRecord::Migration
  def self.up
    add_index :schedule_items, [:type, :product_id, :start], :name=>'product_id_start_index'
  end

  def self.down
    remove_index :schedule_items, 'product_id_start_index'
  end
end
