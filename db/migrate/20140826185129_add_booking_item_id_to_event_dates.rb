class AddBookingItemIdToEventDates < ActiveRecord::Migration
  def change
    add_column :event_dates, :booking_item_id, :integer

    add_column :event_dates, :all_day, :boolean
    add_column :event_dates, :external_variant_id, :integer
    add_column :event_dates, :external_product_id, :integer
  end
end
