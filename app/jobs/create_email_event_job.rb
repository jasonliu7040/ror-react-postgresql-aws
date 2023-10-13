class CreateEmailEventJob < LogExceptionJob.new(:event_json)
  include BookThatAppUtils

  def logged_perform
    self.event_json.each do |event|
      # only track events that include shop and booking ids
      shop = Shop.find_by_subdomain(event['shop'])
      next unless shop

      booking = event['booking']
      next unless booking

      # build the new event and save it
      shop.email_events.build({booking_id: booking.to_i,
                               email: event['email'],
                               attempt: event['attempt'].to_i,
                               occurred_at: Time.at(event['timestamp'].to_i).to_datetime,
                               event: event['event'],
                               response: event['response'],
                               reason: event['reason'],
                               event_type: event['type']
                              }).save
    end
  end
end
