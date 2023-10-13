class AddEmailToLocation < ActiveRecord::Migration
  def change
    add_column :locations, :email, :string, default: ''
    add_column :shops, :reminder_cc_location, :boolean, default: false
  end
end
