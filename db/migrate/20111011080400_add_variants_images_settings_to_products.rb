class AddVariantsImagesSettingsToProducts < ActiveRecord::Migration
  def self.up
    add_column :products, :external_id, :text
    add_column :products, :settings, :text
    add_column :products, :images, :text
    add_index :products, [:shop_id]
    add_index :shops, [:subdomain]
    add_column :bookings, :all_day, :integer
    add_column :blackouts, :all_day, :integer
    add_index :blackouts, [:shop_id, :start]
    add_index :bookings, [:shop_id, :product_id, :scheduled_start]
  end

  def self.down
    remove_index :bookings, [:shop_id, :product_id, :scheduled_start]
    remove_index :blackouts, [:shop_id, :start]
    remove_column :blackouts, :all_day
    remove_column :bookings, :all_day
    remove_index :shops, [:subdomain]
    remove_index :products, [:shop_id]
    remove_column :products, :external_id
    remove_column :products, :settings
    remove_column :products, :images
  end
end
