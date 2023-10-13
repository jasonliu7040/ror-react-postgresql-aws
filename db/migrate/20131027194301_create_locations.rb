class CreateLocations < ActiveRecord::Migration
  def up
    create_table :locations do |t|
      t.references :shop
      t.string :name
      t.string :address
      t.string :latitude
      t.string :longitude
      t.string :locality
      t.string :country
      t.timestamps
    end

    change_table :products do |p|
      p.references :location
    end
  end
end
