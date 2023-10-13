class CreateOptionCapacities < ActiveRecord::Migration
  def self.up
    create_table :option_capacities do |t|
      t.references :product
      t.string :option1
      t.string :option2
      t.string :option3
      t.integer :capacity
      t.timestamps
    end
  end

  def self.down
    drop_table :option_capacities
  end
end
