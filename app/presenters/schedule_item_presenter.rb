class ScheduleItemPresenter < Presenter
  include PresenterHelper

  def calendar_json(start, finish, title)
    occurrences = @object.occurrences(start, finish)
    events = []

    occurrences.each_with_index   do |occurrence, index|
      time = format_time(occurrence[:start])
      event = CalendarItemPresenter.new.item_json(
          index,
          time,
          time,
          title.to_s
      )
      events.push(event)
    end
    events
  end

end
