class AddProviderToShops < ActiveRecord::Migration
  def self.up
    change_table "shops" do |t|
      t.string :provider
      t.string :uid
      t.string :google
    end
  end

  def self.down
    change_table "shops" do |t|
      t.remove :provider
      t.remove :uid
      t.remove :google
    end
  end
end
