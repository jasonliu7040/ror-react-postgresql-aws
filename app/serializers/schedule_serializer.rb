class ScheduleSerializer < ActiveModel::Serializer
  attributes :id,
             :oneoff_items_attributes,
             :recurring_items_attributes

  def oneoff_items_attributes
    object.oneoff_items.map{|i| OneoffScheduleSerializer.new(i, root: false) }
  end

  def recurring_items_attributes
    object.recurring_items.map{|i| RecurringScheduleSerializer.new(i, root: false) if i.id.present? }.compact
  end

end