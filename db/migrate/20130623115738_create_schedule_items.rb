class CreateScheduleItems < ActiveRecord::Migration
  def change
    drop_table :inventories if ActiveRecord::Base.connection.tables.include? 'inventories'
    drop_table :schedules if ActiveRecord::Base.connection.table_exists? 'schedules'
    drop_table :product_times if ActiveRecord::Base.connection.tables.include? 'product_times'

    create_table :schedule_items do |t|
      t.references :product
      t.references :variant
      t.string :type
      t.datetime :start
      t.datetime :finish
      t.integer :duration
      t.text :rule
      t.timestamps
    end
  end
end