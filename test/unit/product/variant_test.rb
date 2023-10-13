require 'test_helper'

class VariantTest < ActiveSupport::TestCase
  setup do
    @variant = variants(:hook_variant)
  end
# This method and the method in the products are now reports_helper helper methods.
  # test "iterate through print options, since it is in js" do
  #   assert Variant.iterate_and_print_options(@variant.product_id, @variant.id).present?
  # end

  test "to liquid works" do
    m = @variant.to_liquid
    assert m.present?, "should render smoothly"
  end
  test "gets external variant" do
    mock_out :get, "variants/65985862.xml"
    assert @variant.external_variant.present?
  end

  test "hits the product cap 0 area" do
    variant = variants(:variant1)
    assert variant.variant_bookings(Date.today, Date.today + 40)
  end
end
