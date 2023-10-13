class AddTypeToBookingItems < ActiveRecord::Migration
  def change
    add_column :booking_items, :type, :string, :default => "Reservation"
  end
end
