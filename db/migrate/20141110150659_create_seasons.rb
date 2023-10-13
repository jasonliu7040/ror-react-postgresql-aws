class CreateSeasons < ActiveRecord::Migration
  def change
    create_table :seasons do |t|
      t.string :name
      t.string :id_of_season
      t.date :start
      t.date :finish
      t.integer :hourable_id
      t.string :hourable_type

      t.timestamps
    end
  end
end
