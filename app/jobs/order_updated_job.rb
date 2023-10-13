class OrderUpdatedJob < Struct.new(:shop_id, :order_id)
  include BookThatAppUtils

  def perform
    log_exception(true) do
      shop = Shop.find_by_id(self.shop_id)
      if shop
        order = shop.external_order(self.order_id)
        unless order
          Rails.logger.warn "[#{shop.subdomain}/orders/#{self.order_id}] Order not found"
          return
        end

        Rails.cache.delete("#{shop.subdomain}/order/#{self.order_id}")

        status = BookingStatus::status(order.financial_status)
        shop.bookings.where(:order_id => self.order_id).each do |booking|
          booking.status = status
          if !booking.save
            Rails.logger.error "[#{shop.subdomain}/bookings/#{booking.id}] Save booking failed: #{booking.errors.inspect}"
          end
        end
      end
    end
  end
end
