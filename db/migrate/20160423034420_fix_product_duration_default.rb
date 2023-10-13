class FixProductDurationDefault < ActiveRecord::Migration
  def change
    change_column :products, :duration, :integer, :default => 3600 # default to 1 hour
  end
end
