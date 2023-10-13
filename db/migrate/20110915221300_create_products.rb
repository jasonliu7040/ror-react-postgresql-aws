class CreateProducts < ActiveRecord::Migration
  def self.up
    drop_table :products if ActiveRecord::Base.connection.tables.include?("products")
    
    create_table :products do |t|
      t.references :shop
      t.integer :product_id
      t.string :product_handle
      t.string :product_title
      t.string :product_image_url
      t.integer :capacity
      t.timestamps
    end
  end

  def self.down
    drop_table :products
  end
end
