class CreateBookings < ActiveRecord::Migration
  def self.up
    create_table :bookings do |t|
      t.references :shop
      t.integer :product_id
      t.integer :variant_id
      t.datetime :scheduled_start
      t.datetime :scheduled_end
      t.timestamps
    end
  end

  def self.down
    drop_table :bookings
  end
end
