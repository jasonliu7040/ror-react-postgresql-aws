require 'test_helper'

class ProductsControllerTest < ActionController::TestCase
  setup do
    set_shopify_session
    @the_product = products(:one_off_date_product)
  end

  test "index page shows up" do
    get :index
    assert_response :success
  end

  test "can has search on index" do
    get :index, :search => "one_product"
    assert_response :success
    assert_not_nil assigns(:products)
  end

  test "edit page" do
    mock_out(:get, "products/100383216.xml")
    mock_out :get, "variants/666/metafields.xml?key=config&namespace=bookthatapp"
    mock_out :get, "variants/666/metafields/666.xml"
    mock_out :delete, "variants/666/metafields/666.xml"
    get :edit, :id => @the_product.id
    assert_response :success
    assert_not_nil assigns(:product)
  end

  #no clue how xml errors look for fixtures that is why new wasn't added here
  symbols_array = [{:meth => :edit, :id_used => :id}, {:meth => :show, :id_used => :id}]
  symbols_array.each do |symb|
    test "#{symb.to_s} page redirects on bad id" do
#      mock_out(:get, "products/123.xml")
      get symb[:meth], symb[:id_used] => 123
      assert_response :redirect
    end
  end

  test "doesn't get new if no external id is passed" do
    get :new
    assert_response :redirect
  end

  test "new redirects if there is no external_id that belongs to shop" do
    FakeWeb.register_uri(:get, "https://test.myshopify.com/admin/products/1234123459989.xml", {:body => "Post not found",  :status => ["404", "Not Found"]})
    get :new, :external_id => 1234123459989
    assert_response :redirect
  end

  test "redirects a deleted product when trying to get new" do
    mock_out(:post, "products/333333/metafields.xml")
    mock_out :get, "products/333333.xml"
    get :new, :external_id => 333333 #if it changes, you will have to change here; fixtures hate deleted_at
    assert_response :redirect
  end

  test "gets new page, without a product external id in DB, successfully" do
    mock_out :get, "products/381987351.xml"
    get :new, :external_id => 381987351
    assert_response :success
    assert_select "option", {:content => "Resources"}, {count: 0}
  end

  test "product gets redirected if it exists in DB" do
    mock_out :post, "products/27763452/metafields.xml"
    get :new, :external_id => @the_product.external_id
    assert_redirected_to edit_product_path(@the_product)
  end

  test "gets new page with resources successfully" do
    sign_out_shopify
    set_shopify_session(:legros)
    mock_out :get, "products/100383216.xml", "legros-parker-and-harris6290"
    get :new, :external_id => @the_product.external_id
    assert_response :success
    #not sure this ever worked as there is no 'option with the word Resources' check git history.
    assert_select "a", {:content => "Edit Handle"}
  end

  test "fixing Rollbar 281 not sure what errors yet, but is a nil" do
    mock_out :get, "products/381987351.xml"
    assert_no_difference "Product.count" do
      post :create, {"product" => {
          "max_duration" => "0",
          "min_duration" => "-1",
          "schedule_yaml" => "---\r\n =>start_date: 2014-10-11 23:10:15.182264761 Z\r\n:rrules: []\r\n:exrules: []\r\n:rtimes: []\r\n:extimes: []\r\n",
          "background_color" => "",
          "id" => "",
          "option_capacities_attributes" => {
            "0" => {
              "capacity" => "0",
              "option1" => "Default"
            }
          },
          "capacity" => "1",
          "product_handle" => "goprohero3dayrental",
          "product_locations_attributes" => {
          },
          "lag_time" => "360",
          "calendar_display" => "0",
          "capacity_type" => "0",
          "lead_time" => "1",
          "profile" => "product",
          "border_color" => "",
          "text_color" => "",
          "variants_attributes" => {
            "0" => {
              "sku" => "goprohero3plusB",
              "title" => "Default",
              "external_id" => "894911435",
              "all_day" => "1",
              "ignore" => "0",
              "duration" => "1.0",
              "settings_yaml" => "",
              "party_size" => "1",
              "option2" => "",
              "option3" => "",
              "option1" => "Default"
            }
          },
          "product_image_url" => "",
          "product_title" => "GoPro Hero 3+ Black - Day",
          "product_id" => "",
          "scheduled" => "0",
          "mindate" => "0",
          "external_id" => "381987351"
        },
        "utf8" => "",
        "ga_client_id" => "1256239073.1413068297",
        "controller" => "products",
        "configuration_options" => [
                                  "Title"
                                 ],
        "rrule" => {
          "0" => {
            "rule_type" => "IceCube::DailyRule",
            "interval" => "1",
            "hour" => "",
            "time" => ""
          }
        }
      }
    end
  end

  test "fixing rollbar 148" do
    mock_out_all_products_and_variants
    assert_no_difference "Product.count" do
      post :create, {"product" => {
        "max_duration" => "0",
        "min_duration" => "1",
        "schedule_yaml" => "---\r\n:start_date: 2014-09-25 06:53:26.284371395 Z\r\n:rrules: []\r\n:exrules: []\r\n:rtimes: []\r\n:extimes: []\r\n",
        "background_color" => "",
        "id" => "",
        "option_capacities_attributes" => {
          "0" => {
            "capacity" => "1",
            "option1" => "Default Title"
          }
        },
        "capacity" => "1",
        "product_handle" => "kategori-1",
        "product_locations_attributes" => {
        },
        "lag_time" => "0",
        "calendar_display" => "0",
        "capacity_type" => "1",
        "lead_time" => "0",
        "profile" => "product",
        "border_color" => "",
        "text_color" => "",
        "variants_attributes" => {
          "0" => {
            "sku" => "",
            "title" => "Test",
            "external_id" => "860554195",
            "all_day" => "0",
            "ignore" => "0",
            "duration_units" => "2",
            "duration" => "1.0",
            "settings_yaml" => "",
            "party_size" => "1",
            "option2" => "",
            "option3" => "",
            "option1" => "Default Title"
          }
        },
        "product_image_url" => "",
        "product_title" => "Kategori 1",
        "product_id" => "",
        "scheduled" => "0",
        "mindate" => "0",
        "external_id" => "100383216"
      },
      "utf8" => "",
      "ga_client_id" => "1041520537.1411627892",
      "controller" => "products",
      "configuration_options" => [
                                "Title"
                               ],
      "rrule" => {
        "0" => {
          "rule_type" => "IceCube::DailyRule",
          "interval" => "1",
          "hour" => "",
          "time" => ""
        }
      }}
    end
    assert_response :success
  end
  test "creates a new Product for shop" do
    mock_out(:post, "products/1111/metafields.xml")
    mock_out(:get, "products/1111.xml")
    mock_out(:put, "products/1111.xml")
    the_string = ":start_date: #{Date.today} 12:00:00 Z\n:duration: 720\n:rrules:\n- :validations:\n  :rule_type: IceCube::MinutelyRule\n  :interval: 12\n  :until:  2014-08-27 14:00:00 Z\n:exrules: []"
    post :create,
         product:{ min_duration: "",
                   capacity: 1,
                   external_id: 1111,
                   schedule_attributes: {
                       recurring_items_attributes: {
                           '0' => {schedule_yaml: the_string}
                       }
                   }
         },
         :configuration_options => {:m0 => "zero", :m1 => "one", :m2 => "two"}

    assert_redirected_to edit_product_path(assigns(:product))
    assert_equal the_string, assigns(:product).schedule.recurring_items.first.schedule_yaml
  end
  test "blank resource contraints in params doesn't stop a Product from being created " do
    mock_out(:post, "products/1111/metafields.xml")
    mock_out(:get, "products/1111.xml")
    mock_out(:put, "products/1111.xml")
    the_string = ":start_date: #{Date.today} 12:00:00 Z\n:duration: 720\n:rrules:\n- :validations:\n  :rule_type: IceCube::MinutelyRule\n  :interval: 12\n  :until:  2014-08-27 14:00:00 Z\n:exrules: []"
    assert_no_difference "ProductCapacity.count" do
      post :create, :product => {
                      :min_duration => "",
                      :capacity => 1,
                      :external_id => 1111,
                      schedule_attributes: {
                          recurring_items_attributes: {
                              '0' => {schedule_yaml: the_string}
                          }
                      },
                      :resource_constraints_attributes => {0 => {:resource_id => ""}}
                  }, :configuration_options => {:m0 => "zero", :m1 => "one", :m2 => "two"}
    end

    assert_redirected_to edit_product_path(assigns(:product))
    assert_not_equal the_string, assigns(:product).schedule_yaml
    assert_equal the_string, assigns(:product).schedule.recurring_items.first.schedule_yaml
  end

  test "proper product capacities in params saves successfully on Product create" do
    mock_out(:post, "products/1111/metafields.xml")
    mock_out(:get, "products/1111.xml")
    mock_out(:put, "products/1111.xml")
    the_string = ":start_date: #{Date.today} 12:00:00 Z\n:duration: 720\n:rrules:\n- :validations:\n  :rule_type: IceCube::MinutelyRule\n  :interval: 12\n  :until:  2014-08-27 14:00:00 Z\n:exrules: []"
    the_resource = resources(:three)
    assert_difference ["ResourceConstraint.count", "Schedule.count", "RecurringSchedule.count"] do
      post :create,
           product: {
               min_duration: "",
               capacity: 1,
               external_id: 1111,
               schedule_attributes: {
                   recurring_items_attributes: {
                       '0' => {schedule_yaml: the_string}
                   }
               },
               resource_constraints_attributes:
                   { '0' => { resource_id: the_resource.id} }
           },
           configuration_options: { m0: "zero", m1: "one", m2: "two"}
    end

    assert_redirected_to edit_product_path(assigns(:product))
    assert_not_equal the_string, assigns(:product).schedule_yaml
    assert_equal the_string, assigns(:product).schedule.recurring_items.first.schedule_yaml
  end


  test "doesn't create a new Product" do
    mock_out(:post, "products/1111/metafields.xml")
    mock_out(:get, "products/1111.xml")
    mock_out(:put, "products/1111.xml")
    post :create, :product => {:capacity => 1, :external_id => 1111}, :configuration_options => {:m0 => "zero", :m1 => "one", :m2 => "two"}
    assert_not_nil assigns(:product).errors

  end
  test " updates the product" do
    mock_product_post#    mock_out :post, "products/100383216/metafields.xml"
    mock_out(:put, "products/100383216.xml")
    mock_out :get, "products/100383216.xml"
    put :update, :id => @the_product.id, :product => {:profile => "appt"}, :configuration_options => {:m0 => "zero", :m1 => "one", :m2 => "two"}
    assert_redirected_to edit_product_path(assigns(:product))
  end

  test "rollbar 242 for nil option i think" do
    mock_variant_post 7
    mock_product_post 7
    mock_out :get, "products/7.xml"
    mock_out :put, "products/7.xml"
    mock_out :get, "variants/666.xml"
    FakeWeb.register_uri(:post, 'https://test.myshopify.com/admin/variants/666/metafields.xml', {})

    put :update, {
      "product" => {
        "max_duration" => "7",
        "min_duration" => "1",
        "background_color" => "#FFFFFF",
        "id" => "7",
        "option_capacities_attributes" => {
          "1" => {
            "capacity" => "1",
            "option2" => "",
            "option1" => "Camp & Breakfast (tour included)"
          },
          "0" => {
            "capacity" => "1",
            "option2" => "",
            "option1" => "Farm Tour + Lunch"
          }
        },
        "capacity" => "10",
        "product_handle" => "siembra-tres-vidas",
        "product_locations_attributes" => {
        },
        "lag_time" => "1440",
        "calendar_display" => "0",
        "capacity_type" => "0",
        "mindate" => "1",
        "profile" => "activity",
        "border_color" => "#000000",
        "schedule_attributes" => {
          "id" => "3",
          "oneoff_items_attributes" => {
            "0" => {
              "start" => "2014-09-21 10:45",
              "id" => "1",
              "_destroy" => "false"
            }
          },
          "recurring_items_attributes" => {
              "0" => {
                  "schedule_yaml" => " =>start_date: 2014-09-01 03:25:00 Z\r\n:rrules:\r\n- :validations:\r\n    :month_of_year:\r\n    - 1\r\n    - 2\r\n    - 3\r\n    - 4\r\n    - 5\r\n    - 6\r\n    - 7\r\n    - 8\r\n    - 9\r\n    - 10\r\n    - 11\r\n    - 12\r\n    :day:\r\n    - 0\r\n    - 2\r\n    - 3\r\n    - 4\r\n    - 5\r\n    - 6\r\n    :hour_of_day:\r\n    - 3\r\n    :minute_of_hour:\r\n    - 5\r\n  :rule_type: IceCube::MonthlyRule\r\n  :interval: 1\r\n  :until:  2014-09-30 00:00:00 Z\r\n:exrules: []"
              }
          }
        },
        "text_color" => "#000000",
        "variants_attributes" => {
          "0" => {
            "start_time(4i)" => "09",
            "start_time(2i)" => "1",
            "finish_time(5i)" => "00",
            "finish_time(2i)" => "1",
            "finish_time(3i)" => "1",
            "duration" => "6",
            "finish_time(1i)" => "2000",
            "id" => "9",
            "sku" => "",
            "finish_time(4i)" => "17",
            "title" => "Farm Tour + Lunch / Camp & Breakfast",
            "start_time(1i)" => "2000",
            "party_size" => "10",
            "option2" => "1",
            "option3" => "",
            "start_time(3i)" => "1",
            "start_time(5i)" => "00",
            "all_day" => "0",
            "ignore" => "0",
            "duration_units" => "1",
            "settings_yaml" => "",
            "option1" => "2",
            "external_id" => "7"
          }
        },
        "product_image_url" => "https://cdn.shopify.com/s/files/1/0617/6725/products/2793310_1_e852d187-d04f-443d-b2d7-3f0bff89b3cd.jpg?v=1409524294",
        "product_title" => "Siembra Tres Vidas",
        "product_id" => "",
        "scheduled" => "1",
        "lead_time" => "0",
        "external_id" => "7"
      },
      "utf8" => "",
      "ga_client_id" => "353192914.1409540477",
      "controller" => "products",
      "configuration_options" => [
                                "Camping",
                                "Room with Shared Bathroom"
                               ],
      "rrule" => {
        "0" => {
          "rule_type" => "IceCube::MonthlyRule",
          "moy" => "12",
          "hour" => "3",
          "interval" => "1",
          "time" => "5",
          "dow" => "6"
        }
      },
      "authenticity_token" => "D7C8OMNTyGyqgSxOJz086mQGzhE66JfckFAjefkp/2U=",
      "action" => "update",
      "commit" => "Save",
      "id" => "7",
      "_method" => "put"
    }
    assert_response :redirect
  end

  test "destroy product" do
    mock_out :get, "products/1.xml"
    mock_out :get, "products/1/metafields.xml"
    mock_out :get, "variants/1/metafields.xml?key=config&namespace=bookthatapp"
    mock_out :get, "products/1/metafields.xml?key=config&namespace=bookthatapp"
    mock_product_post 1
    mock_out :delete, "products/1/metafields/1.xml"
    delete :destroy, {:id => 1}
    assert_redirected_to "/products"
  end

  test "updates and resets variants" do
    mock_variant_post
    mock_out(:get, "variants/666/metafields.xml?key=config&namespace=bookthatapp")
    mock_out(:get, "variants/233592770.xml")
    mock_product_post
    mock_out(:delete, "variants/666/metafields/666.xml")
    mock_out :get, :"products/100383216.xml"
    put :update, :id => @the_product.id, :product => {}, :reset_variants => true
    assert_response :redirect
  end

  test "rollbar 452 made right" do
    mock_variant_post 7
    mock_product_post 7
    mock_out :get, "products/7.xml"
    mock_out :put, "products/7.xml"
    mock_out :get, "variants/666.xml"
    FakeWeb.register_uri(:post, 'https://test.myshopify.com/admin/variants/666/metafields.xml', {})

    put :update, {id: 7,
      "product" => {
        "max_duration" => "0",
        "min_duration" => "0",
        "background_color" => "#46d6db",
        "id" => "7",
        "option_capacities_attributes" => {
          "0" => {
            "capacity" => "1",
            "option1" => "Default Title"
          }
        },
        "capacity" => "10",
        "product_handle" => "beginners-upholstery-1",
        "product_locations_attributes" => {
            "0" => {
                "location_id" => "754"
            }
        },
        "lag_time" => "0",
        "calendar_display" => "0",
        "capacity_type" => "0",
        "mindate" => "0",
        "profile" => "class",
        "border_color" => "",
        "schedule_attributes" => {
          "id" => "3",
          "oneoff_items_attributes" => {
            "10" => {
              "start" => "2015-03-29 10:00",
              "id" => "6654",
              "_destroy" => "false"
            },
            "1416861487219" => {
              "start" => "",
              "id" => "",
              "_destroy" => "1"
            },
            "1416861472906" => {
              "start" => "2014-11-29 10:00",
              "id" => "",
              "_destroy" => "false"
            },
            "1" => {
              "start" => "2014-12-14 10:00",
              "id" => "6648",
              "_destroy" => "false"
            },
            "0" => {
              "start" => "2014-12-07 10:00",
              "id" => "6685",
              "_destroy" => "false"
            },
            "3" => {
              "start" => "2015-01-17 10:00",
              "id" => "6162",
              "_destroy" => "false"
            },
            "2" => {
              "start" => "2014-12-20 10:00",
              "id" => "6165",
              "_destroy" => "false"
            },
            "5" => {
              "start" => "2015-02-07 10:00",
              "id" => "6584",
              "_destroy" => "false"
            },
            "4" => {
              "start" => "2015-01-25 10:00",
              "id" => "6583",
              "_destroy" => "false"
            },
            "7" => {
              "start" => "2015-02-21 10:00",
              "id" => "6586",
              "_destroy" => "false"
            },
            "6" => {
              "start" => "2015-02-15 10:00",
              "id" => "6585",
              "_destroy" => "false"
            },
            "9" => {
              "start" => "2015-03-14 10:00",
              "id" => "6652",
              "_destroy" => "false"
            },
            "8" => {
              "start" => "2015-03-07 10:00",
              "id" => "6705",
              "_destroy" => "false"
            }
          },
          "recurring_items_attributes" => {
              "0" => {
                "schedule_yaml" => ":start_date: 2014-10-28 10:00:00 Z\r\n:rrules: []\r\n:exrules: []",
              }
          }
        },
        "text_color" => "",
        "variants_attributes" => {
          "0" => {
            "sku" => "",
            "start_time(2i)" => "1",
            "finish_time(1i)" => "2000",
            "title" => "Default Title",
            "finish_time(2i)" => "1",
            "external_id" => "7",
            "id" => "9",
            "all_day" => "1",
            "finish_time(3i)" => "1",
            "ignore" => "0",
            "start_time(1i)" => "2000",
            "duration" => "6.0",
            "party_size" => "1",
            "settings_yaml" => "",
            "start_time(3i)" => "1",
            "option2" => "",
            "option3" => "",
            "option1" => "Default Title"
          }
        },
        "product_image_url" => "https://cdn.shopify.com/s/files/1/0417/5857/products/Footstool_4_57c268ab-c0a6-4425-bbb8-1ef3e2d494ea.jpeg?v=1409742656",
        "product_title" => "Beginners Upholstery",
        "product_id" => "",
        "scheduled" => "1",
        "lead_time" => "0",
        "external_id" => "7"
      },
      "utf8" => "",
      "ga_client_id" => "1553636138.1408522595",
      "resource_search" => "",
      "configuration_options" => [
        "Title"
      ],
      "rrule" => {
        "0" => {
          "rule_type" => "IceCube::DailyRule",
          "interval" => "1",
          "hour" => "",
          "time" => ""
        }
      },
      "authenticity_token" => "uUEHllQTXZxDw9eZfxvhf9kUBfVa4eGYEkzxO122vGE=",
      "commit" => "Save",
      "_method" => "put"
  }
    assert :success
  end
end
