class CreateReminderConfigs < ActiveRecord::Migration
  def change
    create_table :reminder_configs do |t|
      t.references :shop, :null => false
      t.integer :duration, :default => 4320
      t.string :trigger_type
      t.references :liquid_template, :null => false
      t.timestamps
    end
  end
end
