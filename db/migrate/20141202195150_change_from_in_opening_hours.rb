class ChangeFromInOpeningHours < ActiveRecord::Migration
  def change
    rename_column :opening_hours, :from, :start
    rename_column :opening_hours, :to, :finish
  end
end
