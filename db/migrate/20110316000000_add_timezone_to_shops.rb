class AddTimezoneToShops < ActiveRecord::Migration
  def self.up
    add_column :shops, :timezone, :string
  end

  def self.down
    remove_column :shops, :timezone
  end
end
