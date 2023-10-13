class NewBookingJob < Struct.new(:shop_id, :booking_id)
  include BookThatAppUtils

  def perform
    log_exception(true) do
      shop = Shop.find_by_id(self.shop_id)
      return unless shop

      booking = shop.bookings.find(self.booking_id)
      return unless booking

      Rails.logger.info "[#{shop.subdomain}] New booking via booking form: #{booking.id}"

      SendNewBookingMail.booking_notification(booking).deliver_now
      SendNewBookingMail.booking_confirmation(booking).deliver_now
    end
  end
end
