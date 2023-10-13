class ShortProductSerializer < ActiveModel::Serializer
  self.root = false
  attributes :id,
             :product_title,
             :location_id,
             :title,
             :default_times


  def title
    object.product_title
  end

  def default_times

    if scope && scope[:show_default_times]
      object.default_times
    end
  end

end
