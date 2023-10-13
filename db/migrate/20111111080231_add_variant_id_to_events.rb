class AddVariantIdToEvents < ActiveRecord::Migration
  def self.up
    add_column :events, :external_product_id, :integer
    add_column :events, :external_variant_id, :integer
  end

  def self.down
    remove_column :events, :external_variant_id
    remove_column :events, :external_product_id
   end
end
