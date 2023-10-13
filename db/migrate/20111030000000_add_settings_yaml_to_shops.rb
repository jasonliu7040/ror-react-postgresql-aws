class AddSettingsYamlToShops < ActiveRecord::Migration
  def self.up
    remove_column :shops, :settings
    add_column :shops, :settings_yaml, :text
  end
    
  def self.down
    remove_column :shops, :settings_yaml
  end
end
