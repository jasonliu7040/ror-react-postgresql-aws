class AddAttendedToEvents < ActiveRecord::Migration
  def change
    add_column :events, :attended, :boolean
  end
end
