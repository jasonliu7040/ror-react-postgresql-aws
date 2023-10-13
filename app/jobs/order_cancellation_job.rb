class OrderCancellationJob < LogExceptionJob.new(:shop_id, :order_id)
  def logged_perform
    shop = Shop.find_by_id(self.shop_id)
    shop.bookings.where(order_id: self.order_id).destroy_all if shop
  end
end
