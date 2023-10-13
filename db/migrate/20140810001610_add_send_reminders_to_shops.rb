class AddSendRemindersToShops < ActiveRecord::Migration
  def change
    add_column :shops, :send_reminders, :boolean, :default => true
  end
end
