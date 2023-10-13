class AddCapacityTypeToProduct < ActiveRecord::Migration
  def self.up
    change_table "products" do |t|
      t.integer :capacity_type, :default => 0
      t.string :capacity_option1
      t.string :capacity_option2
      t.string :capacity_option3
    end
  end

  def self.down
    change_table "products" do |t|
      t.remove "capacity_type"
      t.remove :capacity_option1
      t.remove :capacity_option2
      t.remove :capacity_option3
    end
  end
end
