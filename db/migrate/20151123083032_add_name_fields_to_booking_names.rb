class AddNameFieldsToBookingNames < ActiveRecord::Migration
  def change
    unless column_exists? :booking_names, :first_name
      add_column :booking_names, :first_name, :string
    end

    unless column_exists? :booking_names, :last_name
      add_column :booking_names, :last_name, :string
    end

    unless column_exists? :booking_names, :phone
      add_column :booking_names, :phone, :string
    end
  end
end
