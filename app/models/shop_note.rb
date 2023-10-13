class ShopNote < ActiveRecord::Base
  belongs_to :noteable, polymorphic: true
  belongs_to :shop
  # attr_accessible :action_taken, :actionable, :message, :message_type, :shop_id, :was_read, :noteable_id, :noteable_type

  def self.notes
    where(:message_type => "Note")
  end

  def self.action_items
    where(:message_type => "Action")
  end

  def mark_as_read
    update_attribute(:was_read, true)
  end
  #Left here just in case we need to blow all the action items out and start again.
  # def the_notifier(shop_id)
  #   shop = Shop.where(id: shop_id).first
  #   if shop.present?
  #     shop.shop_notes.action_items.destroy_all
  #     shop.bookings.incomplete.each do |d|
  #       shop.notifier("START DATE NEEDED", {:actionable => true, :noteable_id => d.id, :noteable_type => "Event"})
  #     end
  #   end
  # end
end
