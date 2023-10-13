class AddEmailToBookingNames < ActiveRecord::Migration
  def change
    add_column :booking_names, :email, :string
  end
end
