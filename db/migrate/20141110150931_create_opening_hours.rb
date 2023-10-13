class CreateOpeningHours < ActiveRecord::Migration
  def change
    create_table :opening_hours do |t|
      t.integer :day_number
      t.time :from
      t.time :to
      t.integer :season_id

      t.timestamps
    end
  end
end
