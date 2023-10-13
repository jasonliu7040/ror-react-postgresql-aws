class AddCcLocationToReminderConfigs < ActiveRecord::Migration
  def change
    add_column :reminder_configs, :cc_location, :boolean, default: false
  end
end
