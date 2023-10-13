require 'test_helper'

class TemplatesControllerTest < ActionController::TestCase
  setup do
    set_shopify_session
    mock_out :get, 'shop.xml'
  end

  [:index, :site, :email].each do |the_action|
    test "should get index like #{the_action}" do
      get the_action
      assert_response :success
    end
  end

  [:edit, :show].each  do |the_action|
    test "should get #{the_action}" do
      get the_action, id: liquid_templates(:one).id
      assert_response :success
    end
  end

  test 'doesnt put the update' do
    put :update, {id: liquid_templates(:one).id, template: {id: liquid_templates(:one).id, body: ''}}
    assert_response :redirect # redirect to template edit page
  end

  test 'put the update' do
    put :update,{id: liquid_templates(:one).id, template: {id: liquid_templates(:one).id, body: "<!DOCTYPE html PUBLIC \"-//W3C//DTD XHTML 1.0 Transitional//EN\" \"http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd\">\r\n<html xmlns=\"http://www.w3.org/1999/xhtml\">\r\n<head>\r\n<meta content=\"text/html; charset=utf-8\" http-equiv=\"Content-Type\" />\r\n<title></title>\r\n\r\n\r\n<!--[if gte mso 6]>\r\n  <style>\r\n      table.kmButtonBarContent {width:100% !important;}\r\n      table.kmButtonCollectionContent {width:100% !important;}\r\n  </style>\r\n<![endif]-->\r\n<style type=\"text/css\">\r\n  @media only screen and (max-width: 480px) {\r\n    body, table, td, p, a, li, blockquote {\r\n      -webkit-text-size-adjust: none !important;\r\n    }\r\n    body {\r\n      width: 100% !important;\r\n      min-width: 100% !impor"}} #, :template_version => 1
    assert_response :redirect
  end

  test 'put the update with preview' do
    put :update,{id: liquid_templates(:one).id, template: {id: liquid_templates(:one).id, body: "<!DOCTYPE html PUBLIC \"-//W3C//DTD XHTML 1.0 Transitional//EN\" \"http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd\">\r\n<html xmlns=\"http://www.w3.org/1999/xhtml\">\r\n<head>\r\n<meta content=\"text/html; charset=utf-8\" http-equiv=\"Content-Type\" />\r\n<title></title>\r\n\r\n\r\n<!--[if gte mso 6]>\r\n  <style>\r\n      table.kmButtonBarContent {width:100% !important;}\r\n      table.kmButtonCollectionContent {width:100% !important;}\r\n  </style>\r\n<![endif]-->\r\n<style type=\"text/css\">\r\n  @media only screen and (max-width: 480px) {\r\n    body, table, td, p, a, li, blockquote {\r\n      -webkit-text-size-adjust: none !important;\r\n    }\r\n    body {\r\n      width: 100% !important;\r\n      min-width: 100% !impor"}, commit: "Preview"} #, :template_version => 1
    assert_response :redirect
  end
end
