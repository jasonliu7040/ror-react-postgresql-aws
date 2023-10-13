require 'test_helper'

class ResourceConstraintTest < ActiveSupport::TestCase
  test "the product resource_one has resource constraints" do
    product = products(:resource_one)
    assert product.resource_constraints.present?
    assert product.resources.present?
  end
end
