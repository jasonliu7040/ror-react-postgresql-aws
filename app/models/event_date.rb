class EventDate < ActiveRecord::Base
  include BookThatAppUtils
  include Interval

  before_save :populate_external_ids

  belongs_to :shop
  belongs_to :product
  belongs_to :variant
  belongs_to :event

  # attr_accessible :finish, :quantity, :start, :type, :shop_id, :product_id, :variant_id, :product, :variant, :all_day

private
  def populate_external_ids
    self.external_product_id = self.product.external_id if self.product && self.external_product_id.nil?
    self.external_variant_id = self.variant.external_id if self.variant && self.external_variant_id.nil?
  end
end
