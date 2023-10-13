class CreateSchedules < ActiveRecord::Migration
  def change
    drop_table :schedules if ActiveRecord::Base.connection.table_exists? 'schedules'
    create_table :schedules do |t|
      t.references :schedulable, polymorphic: true, index: true
      t.timestamps
    end
  end
end
