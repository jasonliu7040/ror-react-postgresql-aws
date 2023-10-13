class TermsPresenter < Presenter

  def calendar_json
    eventSources = []
    @object.includes(:schedule, schedule: [:schedule_items]).each do |o|
      eventSources += TermPresenter.new(o).calendar_json
    end
    eventSources
  end

end