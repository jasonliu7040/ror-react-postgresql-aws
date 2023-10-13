class AddingMultipleIndexToDb < ActiveRecord::Migration
  def change
    #add_index :event_dates, :event_id
    add_index :event_dates, [:shop_id, :event_id, :type, :product_id, :variant_id], :name => "event_dates_shop_prod_var_ids"
    add_index :event_dates, [:shop_id, :event_id, :type, :external_product_id, :external_variant_id], :name => "event_dates_product_shop_external"
    add_index :event_dates, [:shop_id, :event_id, :product_id, :variant_id], :name => "event_dates_product_shop_id"
    add_index :event_dates, [:shop_id, :event_id, :type, :product_id, :variant_id, :start, :finish], :name => "event_dates_product_shop_id_dates"
    add_index :event_dates, [:shop_id, :event_id, :product_id, :variant_id, :start, :finish], :name => "event_dates_no_type_product_shop_id_dates"
    add_index :events, :variant_id
    add_index :events, [:shop_id, :type, :product_id, :variant_id], :name => "events_product_variant_id"
    add_index :events, [:shop_id, :type, :external_product_id, :external_variant_id], :name => "events_product_shop_external"
    add_index :events, [:shop_id, :product_id, :variant_id]
    add_index :events, [:shop_id, :type, :product_id, :variant_id, :start, :finish], :name => "events_product_shop_id_dates"
    add_index :events, [:shop_id, :product_id, :variant_id, :start, :finish], :name => "events_no_types_product_shop_id_dates"
    add_index :liquid_template_versions, :liquid_template_id
    add_index :locations, :shop_id
    add_index :opening_hours, :season_id
    add_index :option_capacities, :product_id
    add_index :products, :location_id
    add_index :resource_groups, :shop_id
    add_index :resources, :shop_id
    add_index :resources, :user_id
    add_index :resources, [:shop_id, :user_id]
    add_index :schedule_items, :variant_id
    add_index :seasons,  [:hourable_id, :hourable_type]
    add_index :shop_notes, :shop_id
    add_index :shop_notes, [:noteable_id, :noteable_type]
    add_index :users, :shop_id
    add_index :variants, [:external_id]
    add_index :variants, [:product_id]
  end
end
