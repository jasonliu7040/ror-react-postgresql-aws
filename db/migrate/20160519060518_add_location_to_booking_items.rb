class AddLocationToBookingItems < ActiveRecord::Migration
  def change
    add_reference :booking_items, :location, index: true, foreign_key: true
  end
end
