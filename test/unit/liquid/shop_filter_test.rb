require 'test_helper'

class ShopFilterTest < ActiveSupport::TestCase
  test "asset_url" do
    shop = shops(:test)
    assert shop.template("all_for_testing").render({})
  end
end
