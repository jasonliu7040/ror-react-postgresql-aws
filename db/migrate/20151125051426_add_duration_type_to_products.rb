class AddDurationTypeToProducts < ActiveRecord::Migration
  def change
    add_column :products, :duration_type, :integer, :default => 0
    add_column :products, :duration, :integer # for product duration type
    # for variant option duration type
    add_column :products, :duration_option, :string
    add_column :products, :duration_option_external_id, :integer, :limit => 8
    add_column :products, :duration_option_position, :integer
    add_column :products, :duration_option_range_variant, :boolean, :default => false # does selecting a range update selected variant
  end
end
