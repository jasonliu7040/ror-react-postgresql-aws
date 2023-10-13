require 'test_helper'

class ChooserControllerTest < ActionController::TestCase
  setup do
    mock_out :get, "products/count.xml"
    set_shopify_session
  end
  test "should gets search with no terms i get a 403" do
    get :search
    assert_response 403
  end

  test "should search products" do
    mock_out :get, "products.xml?limit=250&page=1"
    mock_out :get, "products.xml?limit=6&page=1"
    mock_out :get, "products.xml?limit=6&page=2"
    mock_out :get, "products.xml?limit=6&page=3"
    mock_out :get, "products.xml?limit=6&page=4"
    mock_out :get, "products.xml?title=%25Black%25"
    get :search, {:format => :json, :term => "Black"}
    assert_response :success
  end
  test "should get products" do
    mock_out :get, "products.xml?limit=15&page=1"
    get :products
    assert_response :success
  end

  test "should get products" do
    mock_out :get, "products/1111.xml"
    get :product, {:format => :json, :id => 1111}
    assert_response :success
  end

  test "should get available" do
    mock_out :get, "products.xml?limit=15&page=1"
    get :available
    assert_response :success
  end
  test "should get variant_options" do
    get :variant_options, {:format => :js, :product_id => 1}
    assert_response :success
  end

  test "should 404 when asked for a product id not in the db" do
    get :variant_options, {:format => :json, :product_id => 1111}
    assert_response 404
  end
end
