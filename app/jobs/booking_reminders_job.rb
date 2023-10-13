class BookingRemindersJob < LogExceptionJob.new(:shop_id, :booking_ids, :template_id)
  include BookThatAppUtils

  def logged_perform
    shop = Shop.find_by_id(self.shop_id)
    if shop
      bookings = shop.bookings.where(id: self.booking_ids)
      template = shop.templates.find_by(id: self.template_id)
      reminder_service = RemindersService.new
      reminder_service.send_reminder_for_bookings(bookings, template)
    else
      Rails.logger.info 'Shop not found'
    end
  end
end