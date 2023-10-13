class BookingForm < BaseForm
  attribute :order_name, String
  attribute :notes
  attribute :hotel
  attribute :items, Array[BookingItemForm]
  attribute :customers, Array[BookingNameForm]
  attribute :posted_successfully, Boolean, :default => false

  # creates a booking
  def save(shop)
    return false unless valid?

    Booking.transaction do
      booking = shop.bookings.build({})

      items.each do |item|
        booking.booking_items.build(item.build_hash)
        delegate_errors_for_item(item) unless item.valid?
      end

      customers.each do |customer|
        booking.booking_names.build(customer.build_hash)
        delegate_errors_for_name(customer) unless customer.valid?
      end

      first_contact = booking.booking_names.first
      if first_contact
        booking.name = first_contact.name
        booking.email = first_contact.email
      end

      delegate_errors_for_booking(booking) unless booking.valid?

      if errors.any?
        false
      else
        if booking.save
          booking.sync_booking_dates
          Delayed::Job.enqueue NewBookingJob.new(shop.id, booking.id), :priority => 10
          true
        else
          false
        end
      end
    end
  end

private
  def delegate_errors_for_booking(booking)
    errors.add(:order_name, booking.errors[:order_name].first) if booking.errors[:order_name].present?
    errors.add(:notes, booking.errors[:notes].first) if booking.errors[:notes].present?
    errors.add(:hotel, booking.errors[:hotel].first) if booking.errors[:hotel].present?
  end

  def delegate_errors_for_item(item)
    errors.add(:product, item.errors[:product].first) if item.errors[:product].present?
    errors.add(:variant, item.errors[:variant].first) if item.errors[:variant].present?
    errors.add(:quantity, item.errors[:quantity].first) if item.errors[:quantity].present?
    errors.add(:date, item.errors[:date].first) if item.errors[:date].present?
    errors.add(:time, item.errors[:time].first) if item.errors[:time].present?
  end

  def delegate_errors_for_name(name)
    errors.add(:firstname, name.errors[:firstname].first) if name.errors[:firstname].present?
    errors.add(:lastname, name.errors[:lastname].first) if name.errors[:lastname].present?
    errors.add(:email, name.errors[:email].first) if name.errors[:email].present?
    errors.add(:phone, name.errors[:phone].first) if name.errors[:phone].present?
  end
end
