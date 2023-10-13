class CreateShops < ActiveRecord::Migration
  def self.up
    create_table :shops do |t|
      t.integer :shop_id, :default => "0", :null => false
      t.string :site
      t.boolean :processing
      t.string :subdomain
      t.timestamps
    end
  end

  def self.down
    drop_table :shops
  end
end
