class DropBookingsTableAndBlackoutsTable < ActiveRecord::Migration
  def up
    drop_table :bookings
    drop_table :blackouts
  end

  def down
    create_table :bookings
    create_table :blackouts
  end
end
