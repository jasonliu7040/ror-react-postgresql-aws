class AddAvailabilityIndexToEvents < ActiveRecord::Migration
  def self.up
    add_index :events, [:type, :shop_id, :product_id, :finish, :start], :name=>'availability_index'
  end

  def self.down
    remove_index :events, 'availability_index'
  end
end
