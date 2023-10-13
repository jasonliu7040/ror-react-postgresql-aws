class CreateBlackouts < ActiveRecord::Migration
  def self.up
    create_table :blackouts do |t|
      t.references :shop
      t.datetime :start
      t.datetime :finish
      t.timestamps
    end
  end

  def self.down
    drop_table :blackouts
  end
end
