class CreateOptionDurations < ActiveRecord::Migration
  def change
    create_table :option_durations do |t|
      t.references :product
      t.integer :option_external_id, :limit => 8 # track which option these values belong to
      t.string :value # which value does this duration apply to
      t.integer :duration # product.duration_option_range_variant == false
      t.integer :low_range # product.duration_option_range_variant == true
      t.integer :high_range # product.duration_option_range_variant == true
      t.datetime :deleted_at
      t.timestamps
    end
    add_index :option_durations, :product_id
  end
end
