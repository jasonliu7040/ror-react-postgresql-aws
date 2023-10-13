class CalendarItemPresenter < Presenter

  def item_json(index, start, finish, title, all_day=false)
    result = {
        :id => "#{index}",
        :title => title,
        :start => start,
        :end => finish,
        :allDay => all_day
    }
    result.delete('end') if all_day
    result
  end

end
