class BookingName < ActiveRecord::Base
  belongs_to :booking, :inverse_of => :booking_names, :counter_cache => true, :touch => true  # touch to update booking updated_at which is used as cache key

  # validates_presence_of [:name, :email]
  validates_presence_of [:name]
  # validates_format_of :email, :with => /\A[^@\s]+@([^@\s]+\.)+[^@\s]+\z/

  # TODO: review
  belongs_to :incomplete_booking
  belongs_to :item, :touch => true

  def to_liquid
    if first_name.nil?
      first_name = name.split(' ').first
    end

    if last_name.nil?
      last_name = name.split[1..-1].join(' ')
    end

    {
        'first_name' => first_name,
        'last_name' => last_name,
        'phone' => phone
    }
  end
end