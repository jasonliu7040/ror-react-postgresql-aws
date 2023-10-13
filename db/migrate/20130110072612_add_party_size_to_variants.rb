class AddPartySizeToVariants < ActiveRecord::Migration
  def self.up
    add_column :variants, :party_size, :integer, :default => 1
    add_column :variants, :start_time, :time
    add_column :variants, :finish_time, :time
  end

  def self.down
    remove_column :variants, :party_size
    remove_column :variants, :start_time
    remove_column :variants, :finish_time
  end
end
