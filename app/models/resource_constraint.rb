#
# Models the association between a product and a resource
#
class ResourceConstraint < ActiveRecord::Base
  # # attr_accessible :title, :body
  belongs_to :resource
  belongs_to :product
  belongs_to :variant
end
