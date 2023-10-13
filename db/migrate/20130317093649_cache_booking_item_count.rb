class CacheBookingItemCount < ActiveRecord::Migration
  def up
    execute "update products set booking_items_count=(select count(*) from booking_items where product_id=products.id)"
    execute "update products set variants_count=(select count(*) from variants where product_id=products.id)"
  end

  def down
  end
end
