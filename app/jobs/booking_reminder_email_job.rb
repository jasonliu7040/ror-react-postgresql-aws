class BookingReminderEmailJob < Struct.new(:shop_id, :booking_id)
  include BookThatAppUtils

  def perform
    log_exception(true) do
      shop = Shop.find_by_id(self.shop_id)
      if shop
        booking = shop.bookings.where(id: self.booking_id).first
        template = shop.template("reminder")
        SendReminderMail.reminder_email(booking, template).deliver_now if booking && booking.email.present?
      end
    end
  end
end
