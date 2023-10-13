class AddMinDurationToProducts < ActiveRecord::Migration
  def change
    add_column :products, :min_duration, :integer, :null => false, :default => 0
    add_column :products, :max_duration, :integer, :null => false, :default => 0
  end
end
