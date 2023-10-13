class OldBlackout < Event
  # hash used on the calendar view
  validates_presence_of :start
  # attr_accessible :external_product_id, :external_variant_id, :product_id, :variant_id, :all_day, :start, :finish
  #==Scopes
  scope :between, lambda {|start, finish| where('finish > ? and start < ?', start, finish).all}

  def overlaps?(the_s, the_f)
    (start - Time.parse(the_f.to_s)) * (Time.parse(the_s.to_s) - finish) >= 0
  end

  def to_calendar_hash
    {
      :id => "blackout-#{self.id}",
      :url => "/blackouts/#{id}/edit",
      :event_type => "blackout",
      :status => 3,
      :product_id => product_id,
      :variant_id => variant_id,
      :start => datetime_array(start),
      :end => datetime_array(finish),
      :all_day => all_day,
      :title => product ? "#{product.product_title} Blacked Out" : "Blacked Out"
    }
  end

  def ical
    the_event_e = Icalendar::Event.new
    the_event_e.dtstart = Icalendar::Values::DateTime.new(start)
    the_event_e.dtend =  Icalendar::Values::DateTime.new(finish)
    the_event_e.summary = "Blackout"
    the_event_e
  end

end
