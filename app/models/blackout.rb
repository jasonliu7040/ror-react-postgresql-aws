class Blackout < EventDate
  # hash used on the calendar view
  # attr_accessible :external_product_id, :external_variant_id
  #==Scopes
  scope :between, lambda {|start, finish| where('finish > ? and start < ?', start, finish).all}
  before_save :adjust_finish

  def adjust_finish
    if self.all_day && self.finish.hour == 0 && self.finish.min == 0 && self.finish.sec == 00
      self.finish = self.finish.end_of_day
    end
  end
  # validates :start, :blackouts_collide => true

  def to_calendar_hash
    {
      :id => "blackout-#{id}",
      :url => "/blackouts/#{id}/edit",
      :event_type => "blackout",
      :status => 3,
      :product_id => product_id,
      :variant_id => variant_id,
      :start => datetime_array(start),
      :end => datetime_array(finish),
      :all_day => all_day,
      :resource_id => calendar_resource_id,
      :title => product.nil? ? 'Global Blackout' : "#{product.product_title} #{'/' + variant.title unless variant.nil?}"
    }
  end

  def calendar_resource_id
    "P#{product_id}:L"
  end

  def ical
    the_event_e = Icalendar::Event.new
    the_event_e.dtstart = Icalendar::Values::DateTime.new(start)
    the_event_e.dtend =  Icalendar::Values::DateTime.new(finish)
    the_event_e.summary = "Blackout"
    the_event_e
  end

  def dates_do_not_collide
  end
end
