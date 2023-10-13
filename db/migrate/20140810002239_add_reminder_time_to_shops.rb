class AddReminderTimeToShops < ActiveRecord::Migration
  def change
    add_column :shops, :reminder_time, :integer, :default => 4320
  end
end
