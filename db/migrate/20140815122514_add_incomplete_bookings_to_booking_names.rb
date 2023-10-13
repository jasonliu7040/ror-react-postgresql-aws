class AddIncompleteBookingsToBookingNames < ActiveRecord::Migration
  def change
    add_column :booking_names, :incomplete_booking_id, :integer
  end
end
