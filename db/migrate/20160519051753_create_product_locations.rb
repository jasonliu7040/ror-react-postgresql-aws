class CreateProductLocations < ActiveRecord::Migration
  def up
    create_table :product_locations do |t|
      t.references :product, index: true, foreign_key: true
      t.references :location, index: true, foreign_key: true
      t.timestamps null: false
    end

    # convert all existing 1:many relationships over for products
    # Product.where('location_id > 0').each {|product| ProductLocation.create!(:product_id => product.id, :location_id => product.location_id)}

    # add location to existing booking items

  end

  def down
    drop_table :product_locations
  end
end
