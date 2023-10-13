class CreateReports < ActiveRecord::Migration
  def change
    create_table :reports do |t|
      t.string :name
      t.text :fields
      t.belongs_to :shop
      t.timestamps null: false
    end
  end
end
