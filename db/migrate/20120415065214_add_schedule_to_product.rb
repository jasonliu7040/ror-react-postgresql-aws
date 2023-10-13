class AddScheduleToProduct < ActiveRecord::Migration
  def self.up
    change_table "products" do |t|
      t.text :schedule
    end
  end

  def self.down
    change_table "products" do |t|
      t.remove :schedule
    end
  end
end
