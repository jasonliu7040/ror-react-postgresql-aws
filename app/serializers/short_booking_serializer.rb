class ShortBookingSerializer < ActiveModel::Serializer
  attributes :id,
             :start,
             :finish,
             :order_name,
             :created_at,
             :product_title,
             :name,
             :status

  def created_at
    I18n.localize(object.created_at.to_date, :format => :short)
  end

  def start
    I18n.localize(object.start.to_date, :format => :short)
  end

end