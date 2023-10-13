class CreateVariants < ActiveRecord::Migration
  def self.up
    create_table :variants do |t|
      t.references  :product
      t.integer     :variant_id
      t.integer     :external_id
      t.string      :title
      t.float       :price
      t.float       :compare_at_price
      t.string      :sku
      t.text        :options_yaml
      t.text        :settings_yaml
      t.float       :duration
      t.integer     :duration_units
      t.integer     :all_day
      t.datetime    :last_sync
      t.timestamps
    end
    add_column :products, :last_sync, :datetime
    add_column :products, :end_dates, :integer
    add_column :products, :excerpt, :text
    add_column :blackouts, :product_id, :integer
    rename_column :products, :settings, :settings_yaml
  end

  def self.down
    rename_column :products, :settings_yaml, :settings
    remove_column :blackouts, :product_id
    remove_column :products, :end_dates
    remove_column :products, :excerpt
    remove_column :products, :last_sync
    drop_table :variants
  end
end
