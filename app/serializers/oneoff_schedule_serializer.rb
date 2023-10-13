class OneoffScheduleSerializer < ActiveModel::Serializer
  attributes :id,
             :duration,
             :start,
             :finish

  def start
    object.start.strftime("%Y-%m-%d %H:%M") if object.start.present?
  end

end