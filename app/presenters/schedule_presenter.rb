class SchedulePresenter < Presenter
  include PresenterHelper

  def calendar_json(start, finish, title, color)
    events = []
    return events if @object.blank?
    @object.schedule_items.each {|s| events += ScheduleItemPresenter.new(s).calendar_json(start, finish, title) }
    [ { events: events, color: color } ]
  end

end