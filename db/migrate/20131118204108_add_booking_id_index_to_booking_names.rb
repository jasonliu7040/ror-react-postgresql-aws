class AddBookingIdIndexToBookingNames < ActiveRecord::Migration
  def self.up
    add_index :booking_names, :booking_id, :name=>'booking_id_index'
  end

  def self.down
    remove_index :booking_names, 'booking_id_index'
  end
end
