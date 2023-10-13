class AddOpeningHoursToShops < ActiveRecord::Migration
  def change
    add_column :shops, :opening_hours, :text
  end
end
