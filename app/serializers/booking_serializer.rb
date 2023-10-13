class BookingSerializer < ActiveModel::Serializer
  attributes :id, :created_at, :updated_at, :shop_id, :phone, :hotel, :name, :email, :order_name, :status, :notes,
             :items, :customers, :product_summary

  def customers
    object.booking_names
  end

  def items
    object.booking_items.map{|i| BookingItemSerializer.new(i, root: false) }
  end

  def product_summary
      summary = object.product_summary || ''

      unless object.start.nil?
        if object.start.hour == 0 && object.start.min == 0
          summary += " #{I18n.localize(object.start.to_date.utc, :format => :short)}"
        else
          summary += " #{I18n.localize(Time.at(object.start.to_time.utc), :format => :short)}"
        end
      end

      summary += " #{object.email}"
      summary
  end
end