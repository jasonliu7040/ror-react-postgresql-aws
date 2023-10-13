class CreateBookingNames < ActiveRecord::Migration
  def change
    create_table :booking_names do |t|
      t.references :booking
      t.string :name
      t.timestamps
    end
  end
end
