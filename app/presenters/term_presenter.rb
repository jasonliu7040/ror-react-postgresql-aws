class TermPresenter < Presenter
  include PresenterHelper

  def calendar_json
    color = random_color
    sources = [ { events: [
        {
            start: format_time(@object.start_date),
            end: format_time(@object.finish_date),
            title: @object.name.to_s
        }],
        color: color
    }]

    sources += SchedulePresenter.new(@object.schedule).calendar_json(@object.start_date, @object.finish_date, @object.name, color)
    sources
  end

end
