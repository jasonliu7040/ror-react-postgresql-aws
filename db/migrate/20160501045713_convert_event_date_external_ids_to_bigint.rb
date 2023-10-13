class ConvertEventDateExternalIdsToBigint < ActiveRecord::Migration
  def change
    change_column :event_dates, :external_product_id, :integer, :limit => 8
    change_column :event_dates, :external_variant_id, :integer, :limit => 8
  end
end
