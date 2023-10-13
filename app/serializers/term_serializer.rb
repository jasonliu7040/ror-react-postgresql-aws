class TermSerializer < ActiveModel::Serializer
  attributes :id,
             :start_date,
             :finish_date,
             :name,
             :product_id,
             :schedule_attributes

  def schedule_attributes
    ScheduleSerializer.new(object.schedule, root: false)
  end

  def start_date
    object.start_date.strftime("%Y-%m-%d %H:%M") if object.start_date.present?
  end

  def finish_date
    object.finish_date.strftime("%Y-%m-%d %H:%M") if object.finish_date.present?
  end
end
