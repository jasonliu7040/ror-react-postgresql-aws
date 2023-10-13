class AddScheduleReferenceToScheduleItems < ActiveRecord::Migration

  def change
    change_table :schedule_items do |t|
      t.references :schedule, index: true
    end
  end

  def down
    change_table :schedule_items do |t|
      t.remove :schedule_id
    end
  end
end
