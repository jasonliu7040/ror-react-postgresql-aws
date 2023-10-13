require 'test_helper'

class ReportsHelperTest < ActionView::TestCase
  include ReportsHelper

  test "display all product variants" do
    prod = Product.last
    prod_id = prod.id
    @product_id = prod_id
    @the_data = ReportsParameters.new({products: @product_id, variants: prod.variants.first.id})
    assert display_product_variants.grep(/value='10'/).present?, "Should be some options but it's blank"
  end

  test "all day variants only show" do
    assert all_day_variants_only?(Booking.first), "Should exist"
  end
end
