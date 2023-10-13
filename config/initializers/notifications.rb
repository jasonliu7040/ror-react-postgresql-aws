# ActiveSupport::Notifications.subscribe do |name, start, finish, id, payload|
#   Rails.logger.debug(["notification:", name, start, finish, id, payload].join(" "))
# end

#Grabs any Notification with the regex of shopnotes
#As we get more and more notifications, we can expand this. May need to eventually break out this create into
#different methods based on Note or Action types.

# ActiveSupport::Notifications.subscribe /shopnotes/ do |name, start, finish, id, payload|
#   shop_note_hash = {:message => payload[:message], :shop_id => payload[:shop_id], :noteable_id => payload[:noteable_id], :noteable_type => payload[:noteable_type]}
#   shop_note_hash.merge!({:message_type => "Action", :actionable => true}) if payload[:actionable]
#   ShopNote.create(shop_note_hash)
# end
