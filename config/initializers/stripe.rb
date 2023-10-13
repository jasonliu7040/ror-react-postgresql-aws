StripeEvent.configure do |events|
  events.subscribe 'charge.failed' do |event|
    Rails.logger.info event.inspect
    # event.class       #=> Stripe::Event
    # event.type        #=> "charge.failed"
    # event.data.object #=> #<Stripe::Charge:0x3fcb34c115f8>
  end

  events.all do |event|
    Rails.logger.info event.inspect

    # Handle all event types - logging, etc.
  end
end