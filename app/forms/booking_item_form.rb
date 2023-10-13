class ShopDateCoercer
  def self.call(input)
    coerced = begin
      Virtus.coercer[input.class].to_date(input)
    rescue ::Coercible::UnsupportedCoercion
      nil
    end

    coerced.is_a?(::Date) ? coerced : nil
  end
end


class BookingItemForm < BaseForm
  attribute :product, Product
  attribute :variant, Variant
  attribute :quantity, Integer
  attribute :product_id, Integer
  attribute :variant_id, Integer
  attribute :date, Date
  attribute :time, Time

  validates :product, :variant, :quantity, :start, :time, presence: true

  def product=(value)
    value.is_a?(Product) ? super : super(Product.find(value))
  end

  def product_id
    product.id
  end

  def variant=(value)
    value.is_a?(Variant) ? super : super(Variant.find(value))
  end

  def variant_id
    variant.id
  end

  def start
    datepart = date.is_a?(Date) ? date : product.shop.datetime_parser.parse(date)
    DateTime.new(datepart.year, datepart.month, datepart.day, time.hour, time.min, time.sec)
  end

  def finish
    variant.advance_default_duration(start)
  end

  def build_hash
    atts = attributes

    keys = atts.stringify_keys
    keys["product_id"] = keys["product"][:id]
    keys["variant_id"] = keys["variant"][:id]
    keys["start"] = start
    keys["finish"] = finish

    keys.delete("date")
    keys.delete("time")

    keys
  end
end
