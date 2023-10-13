class AddScheduleYamlToProducts < ActiveRecord::Migration
  def self.up
    remove_column :products, :schedule
    add_column :products, :schedule_yaml, :text
  end
    
  def self.down
    remove_column :products, :schedule_yaml
  end
end
