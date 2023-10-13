class DropReservationsTable < ActiveRecord::Migration
  def up
    drop_table :reservation_items if ActiveRecord::Base.connection.table_exists? 'reservation_items'
    drop_table :reservations if ActiveRecord::Base.connection.table_exists? 'reservations'
    remove_column :shops, :allow_waitlist
  end

  def down
  end
end
