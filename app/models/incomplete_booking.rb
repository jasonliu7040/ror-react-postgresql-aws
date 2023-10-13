class IncompleteBooking < Event
  has_many :booking_names, :dependent => :destroy
  has_many :shop_notes, as: :noteable
  after_create :send_notifier

  after_destroy :mark_action_item_actioned
  accepts_nested_attributes_for :booking_names, :reject_if => lambda {|n| n[:name].blank? }, :allow_destroy => true

  def send_notifier
    shop.notifier("START DATE NEEDED", {:actionable => true, :noteable_id => id, :noteable_type => "Event"})
  end

  def mark_action_item_actioned
    #probably should put incomplete_booking_id in notification i think, so i can search on it and mark as actionable. with appropriate association, me thinks.
  end
end
