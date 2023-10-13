class CreateScheduleAdjustments < ActiveRecord::Migration
  def change
    create_table :schedule_adjustments do |t|
      t.integer :adjustable_id
      t.string :adjustable_type
      t.datetime :old_date
      t.datetime :new_date

      t.timestamps
    end
  end
end
