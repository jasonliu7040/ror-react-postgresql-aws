class SendRemindersJob < LogExceptionJob.new(:time)
  def logged_perform
    @rs = RemindersService.new(self.time)
    Shop.where(send_reminders: true).where('bookings_count > 0').find_in_batches(batch_size: 250).each do |shops|
      shops.each do |shop|
        send_shop_reminders shop
      end
    end
  end

  def send_shop_reminders(shop)
    shop.reminder_configs.each do |config|
      @rs.send_reminders(config)
    end
  end
end
