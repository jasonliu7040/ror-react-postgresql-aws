class AddAllDayToBlackouts < ActiveRecord::Migration
  def self.up
    unless column_exists? :blackouts, :all_day
      add_column :blackouts, :all_day, :integer
    end
    remove_column :bookings, :product_handle
   end
    
  def self.down
    remove_column :blackouts, :all_day
    add_column :bookings, :product_handle, :string
  end
end
