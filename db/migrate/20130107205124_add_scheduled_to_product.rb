class AddScheduledToProduct < ActiveRecord::Migration
  def change
    add_column :products, :scheduled, :boolean, :default => false
  end
end
