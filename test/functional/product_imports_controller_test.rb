require 'test_helper'

class ProductImportsControllerTest < ActionController::TestCase
  setup do
    set_shopify_session(:legros)
  end

  test 'import new product' do
    skip 'failing'

    mock_out(:get, "shop.xml", 'legros-parker-and-harris6290')
    mock_out_with_response(:get, 'products.xml?handle=601-clog-top', 'legros-parker-and-harris6290', 'products_601_clog_top.xml')
    mock_out_with_response(:get, 'products.xml?handle=zolla-keller-navy-silk-evening-suit', 'legros-parker-and-harris6290', 'products_empty.xml')
    mock_variant_post_direct 233592776, 'legros-parker-and-harris6290'
    mock_product_post 100383222, 'legros-parker-and-harris6290'

    existing = Product.find_by_product_handle('601-clog-top')
    if existing
      existing.without_versioning :destroy
    end

    pi = ProductImport.new({profile: 'product', lead_time: '1', lag_time: 1, mindate: '1'})
    pi.shop = @shop
    assert pi.state == 'pending', "State is not pending but is #{pi.state}"

    attachment = fixture_file_upload('product_import_test.csv')
    pi.attachment = attachment
    pi.save!
    pi.start

    assert pi.state == 'running'

    pi.reload
    assert_equal 2, pi.product_count, 'product count should be 2'

    # ... and dj runs now ...

    pi = ProductImport.find(pi.id)
    assert_equal 1, pi.import_count, 'import count should be 1' # file contains 1 handles that doesn't exist in the shop

    product = Product.find_by_product_handle('601-clog-top')
    assert_not_nil product, 'new product not found after import'
    assert_equal pi.profile, product.profile, 'new product profile should match import profile'
    assert_equal pi.lead_time, product.lead_time, 'new product lead_time should match import lead_time'
    assert_equal pi.lag_time, product.lag_time, 'new product lag_time should match import lag_time'
    assert_equal pi.mindate, product.mindate, 'new product mindate should match import mindate'
  end

  test 'import new product with invalid mime type' do
    skip 'failing'

    mock_out(:get, "shop.xml", 'legros-parker-and-harris6290')
    mock_out_with_response(:get, 'products.xml?handle=601-clog-top', 'legros-parker-and-harris6290', 'products_601_clog_top.xml')
    mock_out_with_response(:get, 'products.xml?handle=zolla-keller-navy-silk-evening-suit', 'legros-parker-and-harris6290', 'products_empty.xml')
    mock_variant_post_direct 233592776, 'legros-parker-and-harris6290'
    mock_product_post 100383222, 'legros-parker-and-harris6290'

    existing = Product.find_by_product_handle('601-clog-top')
    if existing
      existing.without_versioning :destroy
    end

    pi = ProductImport.new({profile: 'product', lead_time: '1', lag_time: 1, mindate: '1'})
    pi.shop = @shop
    assert pi.state == 'pending', "State is not pending but is #{pi.state}"

    attachment = fixture_file_upload('product_import_test.xlsx')
    pi.attachment = attachment

    exception = assert_raises(ActiveRecord::RecordInvalid) { pi.save! }
    assert_equal('Validation failed: Attachment file name File must be of filetype .csv, Attachment File must be of filetype .csv', exception.message )
  end
end
