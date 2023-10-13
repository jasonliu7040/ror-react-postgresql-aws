class ProductCapacity < ActiveRecord::Base
  # attr_accessible :quantity, :resource_id, :variant_id
  belongs_to :product
  belongs_to :variant
  belongs_to :resource
end
