class AddCalendarDisplayToProducts < ActiveRecord::Migration
  def change
    add_column :products, :lead_time, :string, :default => "0" #
    add_column :products, :lag_time, :integer, :default => 0 #minutes
    add_column :products, :calendar_display, :boolean, :default => false
  end
end
