class BlackoutSerializer < ActiveModel::Serializer
  attributes :id,
             :start,
             :finish,
             :variant_id,
             :product_id,
             :all_day

  def start
    object.start.strftime("%Y-%m-%d %H:%M") if object.start.present?
  end

  def finish
    object.finish.strftime("%Y-%m-%d %H:%M") if object.finish.present?
  end

  def all_day
    object.all_day || false
  end


end
