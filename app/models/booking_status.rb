class BookingStatus
  PENDING = 1
  CONFIRMED = 2
  CANCELLED = 4
  INCOMPLETE = 5

  def self.status(value)
    case value
      when "paid"
        BookingStatus::CONFIRMED
      when "authorized"
        BookingStatus::PENDING
      when "incomplete"
        BookingStatus::INCOMPLETE
    end
  end
end
