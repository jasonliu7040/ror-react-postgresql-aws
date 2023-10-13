class CreateCourses < ActiveRecord::Migration
  def change
    create_table :courses do |t|
      t.references :product
      t.datetime :start_date
      t.datetime :finish_date
      t.timestamps
    end
  end
end
