class AddScheduleYamlToScheduleItems < ActiveRecord::Migration
  def self.up
    add_column :schedule_items, :schedule_yaml, :text
  end

  def self.down
    remove_column :schedule_items, :schedule_yaml
  end
end
