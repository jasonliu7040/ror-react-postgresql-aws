class AddChargeIdToShops < ActiveRecord::Migration
  def self.up
    change_table "shops" do |t|
      t.integer :charge_id, :default => 0
    end
  end

  def self.down
    change_table "shops" do |t|
      t.remove "charge_id"
    end
  end
end
