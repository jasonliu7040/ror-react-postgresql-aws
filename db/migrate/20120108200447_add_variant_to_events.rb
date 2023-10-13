class AddVariantToEvents < ActiveRecord::Migration
  def self.up
    change_table :events do |t|
      t.references :variant
    end
  end

  def self.down
    change_table :events do |t|
      t.remove :variant_id
    end
  end
end
