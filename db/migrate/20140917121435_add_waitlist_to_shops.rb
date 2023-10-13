class AddWaitlistToShops < ActiveRecord::Migration
  def change
    add_column :shops, :allow_waitlist, :boolean, :default => false
  end
end
