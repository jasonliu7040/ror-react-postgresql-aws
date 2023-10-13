class OneoffSchedule < ScheduleItem
  # TODO: when a date changes update any existing bookings based on the old date
  # commented out the code belong since it may have caused https://shopifyconcierge.zendesk.com/agent/tickets/6597

  # after_save :update_existing_bookings
  #
  # def update_existing_bookings
  #   # if start date has changed and there are existing bookings
  #   self.start_changed? && self.product.bookings.active.where(:start => self.start_was).each do |booking|
  #     delta = self.start - self.start_was
  #     booking.adjust_start_time(delta)
  #     booking.save
  #   end
  # end

  def occurrences(start, finish, variant = nil, duration = nil)
    result = []
    occurrence = {}

    if start <= self.start && self.start <= finish
      occurrence[:start] = (variant.present? && variant.all_day?) ? self.start.midnight : self.start
      if duration.present?
        occurrence[:finish] = occurrence[:start].advance(:seconds => duration)
        occurrence[:duration] = duration
      end
      result << occurrence
    end

    result
  end

end
