# encoding: UTF-8
# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 20160808095159) do

  create_table "accounts", force: :cascade do |t|
    t.string   "name",       limit: 255
    t.string   "email",      limit: 255
    t.integer  "user_id",    limit: 4
    t.datetime "created_at",             null: false
    t.datetime "updated_at",             null: false
    t.string   "subdomain",  limit: 255
  end

  add_index "accounts", ["user_id"], name: "index_accounts_on_user_id", using: :btree

  create_table "billings", force: :cascade do |t|
    t.string   "vendor_string", limit: 255
    t.string   "vendor_name",   limit: 255
    t.integer  "account_id",    limit: 4
    t.datetime "created_at",                null: false
    t.datetime "updated_at",                null: false
  end

  add_index "billings", ["account_id"], name: "index_billings_on_account_id", using: :btree

  create_table "booking_items", force: :cascade do |t|
    t.integer  "shop_id",                    limit: 4,               null: false
    t.integer  "booking_id",                 limit: 4,               null: false
    t.datetime "start",                                              null: false
    t.datetime "finish",                                             null: false
    t.integer  "product_id",                 limit: 4,               null: false
    t.integer  "external_product_id",        limit: 8,               null: false
    t.string   "sku",                        limit: 255
    t.integer  "variant_id",                 limit: 4,               null: false
    t.integer  "external_variant_id",        limit: 8,               null: false
    t.integer  "quantity",                   limit: 4,   default: 1, null: false
    t.float    "price",                      limit: 24
    t.integer  "lag_added",                  limit: 4
    t.datetime "created_at",                                         null: false
    t.datetime "updated_at",                                         null: false
    t.integer  "line_item_id",               limit: 8
    t.integer  "resource_allocations_count", limit: 4,   default: 0, null: false
    t.integer  "location_id",                limit: 4
  end

  add_index "booking_items", ["booking_id"], name: "index_booking_items_on_booking_id", using: :btree
  add_index "booking_items", ["location_id"], name: "index_booking_items_on_location_id", using: :btree
  add_index "booking_items", ["product_id", "variant_id"], name: "index_booking_items_on_product_id_and_variant_id", using: :btree

  create_table "booking_names", force: :cascade do |t|
    t.integer  "booking_id",            limit: 4
    t.string   "name",                  limit: 255
    t.datetime "created_at",                        null: false
    t.datetime "updated_at",                        null: false
    t.string   "email",                 limit: 255
    t.integer  "incomplete_booking_id", limit: 4
    t.integer  "item_id",               limit: 4
    t.string   "first_name",            limit: 255
    t.string   "last_name",             limit: 255
    t.string   "phone",                 limit: 255
  end

  add_index "booking_names", ["booking_id"], name: "booking_id_index", using: :btree

  create_table "delayed_jobs", force: :cascade do |t|
    t.integer  "priority",   limit: 4,     default: 0, null: false
    t.integer  "attempts",   limit: 4,     default: 0, null: false
    t.text     "handler",    limit: 65535,             null: false
    t.text     "last_error", limit: 65535
    t.datetime "run_at"
    t.datetime "locked_at"
    t.datetime "failed_at"
    t.string   "locked_by",  limit: 255
    t.string   "queue",      limit: 255
    t.datetime "created_at",                           null: false
    t.datetime "updated_at",                           null: false
  end

  add_index "delayed_jobs", ["priority", "run_at"], name: "delayed_jobs_priority", using: :btree

  create_table "email_events", force: :cascade do |t|
    t.integer  "shop_id",     limit: 4,     null: false
    t.integer  "booking_id",  limit: 4,     null: false
    t.string   "email",       limit: 255,   null: false
    t.datetime "occurred_at",               null: false
    t.string   "event",       limit: 255,   null: false
    t.string   "response",    limit: 255
    t.integer  "attempt",     limit: 4
    t.text     "reason",      limit: 65535
    t.string   "event_type",  limit: 255
    t.datetime "created_at",                null: false
    t.datetime "updated_at",                null: false
  end

  add_index "email_events", ["shop_id", "booking_id"], name: "index_email_events_on_shop_id_and_booking_id", using: :btree

  create_table "event_dates", force: :cascade do |t|
    t.datetime "start"
    t.datetime "finish"
    t.integer  "shop_id",             limit: 4
    t.integer  "product_id",          limit: 4
    t.integer  "variant_id",          limit: 4
    t.integer  "quantity",            limit: 4,   default: 1
    t.string   "type",                limit: 255, default: "Item"
    t.datetime "created_at",                                       null: false
    t.datetime "updated_at",                                       null: false
    t.boolean  "all_day"
    t.integer  "external_variant_id", limit: 8
    t.integer  "external_product_id", limit: 8
    t.integer  "event_id",            limit: 4
  end

  add_index "event_dates", ["product_id"], name: "index_event_dates_on_product_id", using: :btree
  add_index "event_dates", ["shop_id", "event_id", "product_id", "variant_id", "start", "finish"], name: "event_dates_no_type_product_shop_id_dates", using: :btree
  add_index "event_dates", ["shop_id", "event_id", "product_id", "variant_id"], name: "event_dates_product_shop_id", using: :btree
  add_index "event_dates", ["shop_id", "event_id", "type", "external_product_id", "external_variant_id"], name: "event_dates_product_shop_external", using: :btree
  add_index "event_dates", ["shop_id", "event_id", "type", "product_id", "variant_id", "start", "finish"], name: "event_dates_product_shop_id_dates", using: :btree
  add_index "event_dates", ["shop_id", "event_id", "type", "product_id", "variant_id"], name: "event_dates_shop_prod_var_ids", using: :btree
  add_index "event_dates", ["shop_id"], name: "index_event_dates_on_shop_id", using: :btree
  add_index "event_dates", ["variant_id"], name: "index_event_dates_on_variant_id", using: :btree

  create_table "events", force: :cascade do |t|
    t.string   "type",                limit: 255
    t.integer  "shop_id",             limit: 4
    t.integer  "product_id",          limit: 4
    t.datetime "start"
    t.datetime "finish"
    t.integer  "all_day",             limit: 4
    t.integer  "order_id",            limit: 8
    t.integer  "status",              limit: 4
    t.string   "name",                limit: 255
    t.string   "email",               limit: 255
    t.integer  "customer_id",         limit: 8
    t.datetime "created_at",                                    null: false
    t.datetime "updated_at",                                    null: false
    t.integer  "external_product_id", limit: 8
    t.integer  "external_variant_id", limit: 8
    t.integer  "variant_id",          limit: 4
    t.string   "order_name",          limit: 255
    t.integer  "number_in_party",     limit: 4,     default: 1
    t.text     "notes",               limit: 65535
    t.string   "hotel",               limit: 255
    t.string   "sku",                 limit: 255
    t.string   "phone",               limit: 255
    t.string   "cart_token",          limit: 255
    t.boolean  "attended"
    t.integer  "booking_items_count", limit: 4,     default: 0, null: false
    t.integer  "booking_names_count", limit: 4,     default: 0, null: false
    t.string   "product_summary",     limit: 255
  end

  add_index "events", ["shop_id", "product_id", "start"], name: "index_events_on_shop_id_and_product_id_and_start", using: :btree
  add_index "events", ["shop_id", "product_id", "variant_id", "start", "finish"], name: "events_no_types_product_shop_id_dates", using: :btree
  add_index "events", ["shop_id", "product_id", "variant_id"], name: "index_events_on_shop_id_and_product_id_and_variant_id", using: :btree
  add_index "events", ["shop_id", "type", "external_product_id", "external_variant_id"], name: "events_product_shop_external", using: :btree
  add_index "events", ["shop_id", "type", "product_id", "variant_id", "start", "finish"], name: "events_product_shop_id_dates", using: :btree
  add_index "events", ["shop_id", "type", "product_id", "variant_id"], name: "events_product_variant_id", using: :btree
  add_index "events", ["type", "order_id"], name: "type_order_id_index", using: :btree
  add_index "events", ["type", "shop_id", "product_id", "finish", "start"], name: "availability_index", using: :btree
  add_index "events", ["type", "shop_id"], name: "type_shop_id_index", using: :btree
  add_index "events", ["variant_id"], name: "index_events_on_variant_id", using: :btree

  create_table "flipper_features", force: :cascade do |t|
    t.string   "name",       limit: 255, null: false
    t.datetime "created_at",             null: false
    t.datetime "updated_at",             null: false
  end

  add_index "flipper_features", ["name"], name: "index_flipper_features_on_name", unique: true, using: :btree

  create_table "flipper_gates", force: :cascade do |t|
    t.integer  "flipper_feature_id", limit: 4,   null: false
    t.string   "name",               limit: 255, null: false
    t.string   "value",              limit: 255
    t.datetime "created_at",                     null: false
    t.datetime "updated_at",                     null: false
  end

  add_index "flipper_gates", ["flipper_feature_id", "name", "value"], name: "index_flipper_gates_on_flipper_feature_id_and_name_and_value", unique: true, using: :btree

  create_table "liquid_template_versions", force: :cascade do |t|
    t.integer  "liquid_template_id", limit: 4
    t.text     "body",               limit: 4294967295
    t.datetime "created_at"
    t.integer  "version",            limit: 4,          default: 0
    t.string   "snapshot",           limit: 255
  end

  add_index "liquid_template_versions", ["liquid_template_id"], name: "index_liquid_template_versions_on_liquid_template_id", using: :btree

  create_table "liquid_templates", force: :cascade do |t|
    t.integer  "shop_id",         limit: 4
    t.text     "body",            limit: 4294967295
    t.string   "name",            limit: 255
    t.datetime "created_at",                                         null: false
    t.datetime "updated_at",                                         null: false
    t.string   "subject",         limit: 255
    t.string   "cc",              limit: 255
    t.string   "category",        limit: 255
    t.string   "channel",         limit: 255
    t.string   "to",              limit: 255
    t.string   "bcc",             limit: 255
    t.boolean  "attach_ticket",                      default: false
    t.boolean  "attach_reminder",                    default: true
  end

  add_index "liquid_templates", ["shop_id"], name: "index_liquid_templates_on_shop_id", using: :btree

  create_table "locations", force: :cascade do |t|
    t.integer  "shop_id",    limit: 4
    t.string   "name",       limit: 255
    t.string   "address",    limit: 255
    t.string   "latitude",   limit: 255
    t.string   "longitude",  limit: 255
    t.string   "locality",   limit: 255
    t.string   "country",    limit: 255
    t.datetime "created_at",                          null: false
    t.datetime "updated_at",                          null: false
    t.string   "email",      limit: 255, default: ""
  end

  add_index "locations", ["shop_id"], name: "index_locations_on_shop_id", using: :btree

  create_table "occurrences", force: :cascade do |t|
    t.integer  "schedule_item_id", limit: 4
    t.boolean  "generated",                  default: false, null: false
    t.datetime "start",                                      null: false
    t.datetime "finish"
    t.datetime "cancelled_at"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "occurrences", ["schedule_item_id"], name: "index_occurrences_on_schedule_item_id", using: :btree

  create_table "opening_hours", force: :cascade do |t|
    t.integer  "day_number", limit: 4
    t.time     "start"
    t.time     "finish"
    t.integer  "season_id",  limit: 4
    t.datetime "created_at",           null: false
    t.datetime "updated_at",           null: false
  end

  add_index "opening_hours", ["season_id"], name: "index_opening_hours_on_season_id", using: :btree

  create_table "option_capacities", force: :cascade do |t|
    t.integer  "product_id", limit: 4
    t.string   "option1",    limit: 255
    t.string   "option2",    limit: 255
    t.string   "option3",    limit: 255
    t.integer  "capacity",   limit: 4
    t.datetime "created_at",             null: false
    t.datetime "updated_at",             null: false
  end

  add_index "option_capacities", ["product_id"], name: "index_option_capacities_on_product_id", using: :btree

  create_table "option_durations", force: :cascade do |t|
    t.integer  "product_id",         limit: 4
    t.integer  "option_external_id", limit: 8
    t.string   "value",              limit: 255
    t.integer  "duration",           limit: 4
    t.integer  "low_range",          limit: 4
    t.integer  "high_range",         limit: 4
    t.datetime "deleted_at"
    t.datetime "created_at",                     null: false
    t.datetime "updated_at",                     null: false
  end

  add_index "option_durations", ["product_id"], name: "index_option_durations_on_product_id", using: :btree

  create_table "product_capacities", force: :cascade do |t|
    t.integer  "product_id",  limit: 4
    t.integer  "resource_id", limit: 4
    t.integer  "variant_id",  limit: 4
    t.integer  "quantity",    limit: 4
    t.datetime "created_at",            null: false
    t.datetime "updated_at",            null: false
  end

  add_index "product_capacities", ["product_id"], name: "index_product_capacities_on_product_id", using: :btree
  add_index "product_capacities", ["resource_id"], name: "index_product_capacities_on_resource_id", using: :btree
  add_index "product_capacities", ["variant_id"], name: "index_product_capacities_on_variant_id", using: :btree

  create_table "product_imports", force: :cascade do |t|
    t.integer  "shop_id",                 limit: 4
    t.string   "state",                   limit: 255
    t.integer  "product_count",           limit: 4,     default: 0
    t.integer  "import_count",            limit: 4,     default: 0
    t.string   "profile",                 limit: 255,                 null: false
    t.integer  "mindate",                 limit: 4
    t.string   "lead_time",               limit: 255,   default: "0"
    t.integer  "lag_time",                limit: 4,     default: 0
    t.string   "filename",                limit: 255
    t.datetime "created_at",                                          null: false
    t.datetime "updated_at",                                          null: false
    t.integer  "range_basis",             limit: 4,     default: 0
    t.integer  "range_min",               limit: 4,     default: 0
    t.integer  "range_max",               limit: 4,     default: 0
    t.string   "attachment_file_name",    limit: 255
    t.string   "attachment_content_type", limit: 255
    t.integer  "attachment_file_size",    limit: 4
    t.datetime "attachment_updated_at"
    t.integer  "capacity_type",           limit: 4
    t.integer  "capacity",                limit: 4,     default: 0
    t.text     "capacity_options",        limit: 65535
    t.integer  "duration_type",           limit: 4
    t.integer  "duration",                limit: 4,     default: 0
  end

  add_index "product_imports", ["shop_id"], name: "index_product_imports_on_shop_id", using: :btree

  create_table "product_locations", force: :cascade do |t|
    t.integer  "product_id",  limit: 4
    t.integer  "location_id", limit: 4
    t.datetime "created_at",            null: false
    t.datetime "updated_at",            null: false
  end

  add_index "product_locations", ["location_id"], name: "index_product_locations_on_location_id", using: :btree
  add_index "product_locations", ["product_id"], name: "index_product_locations_on_product_id", using: :btree

  create_table "products", force: :cascade do |t|
    t.integer  "shop_id",                       limit: 4
    t.integer  "product_id",                    limit: 4
    t.string   "product_handle",                limit: 255
    t.string   "product_title",                 limit: 255
    t.string   "product_image_url",             limit: 255
    t.integer  "capacity",                      limit: 4
    t.datetime "created_at",                                                  null: false
    t.datetime "updated_at",                                                  null: false
    t.integer  "external_id",                   limit: 8
    t.text     "settings_yaml",                 limit: 65535
    t.text     "images",                        limit: 65535
    t.datetime "last_sync"
    t.integer  "end_dates",                     limit: 4
    t.text     "excerpt",                       limit: 65535
    t.integer  "capacity_type",                 limit: 4,     default: 0
    t.string   "capacity_option1",              limit: 255
    t.string   "capacity_option2",              limit: 255
    t.string   "capacity_option3",              limit: 255
    t.text     "schedule_yaml",                 limit: 65535
    t.boolean  "scheduled",                                   default: false
    t.string   "profile",                       limit: 255
    t.string   "lead_time",                     limit: 255,   default: "0"
    t.integer  "lag_time",                      limit: 4,     default: 0
    t.boolean  "calendar_display",                            default: false
    t.integer  "items_count",                   limit: 4,     default: 0,     null: false
    t.integer  "variants_count",                limit: 4,     default: 0,     null: false
    t.integer  "mindate",                       limit: 4,     default: 0,     null: false
    t.integer  "location_id",                   limit: 4
    t.string   "type",                          limit: 255
    t.string   "text_color",                    limit: 255,   default: ""
    t.string   "background_color",              limit: 255,   default: ""
    t.string   "border_color",                  limit: 255,   default: ""
    t.datetime "deleted_at"
    t.integer  "min_duration",                  limit: 4,     default: 0,     null: false
    t.integer  "max_duration",                  limit: 4,     default: 0,     null: false
    t.boolean  "hidden",                                      default: false
    t.integer  "booking_items_count",           limit: 4,     default: 0,     null: false
    t.integer  "range_count_basis",             limit: 4,     default: 0
    t.integer  "duration_type",                 limit: 4,     default: 0
    t.integer  "duration",                      limit: 4,     default: 3600
    t.string   "duration_option",               limit: 255
    t.integer  "duration_option_external_id",   limit: 8
    t.integer  "duration_option_position",      limit: 4
    t.boolean  "duration_option_range_variant",               default: false
    t.string   "product_location",              limit: 255
  end

  add_index "products", ["deleted_at"], name: "index_products_on_deleted_at", using: :btree
  add_index "products", ["location_id"], name: "index_products_on_location_id", using: :btree
  add_index "products", ["shop_id", "external_id"], name: "shop_id_external_id_index", using: :btree
  add_index "products", ["shop_id"], name: "index_products_on_shop_id", using: :btree

  create_table "reminder_configs", force: :cascade do |t|
    t.integer  "shop_id",            limit: 4,                   null: false
    t.integer  "duration",           limit: 4,   default: 4320
    t.string   "trigger_type",       limit: 255
    t.integer  "liquid_template_id", limit: 4,                   null: false
    t.datetime "created_at",                                     null: false
    t.datetime "updated_at",                                     null: false
    t.boolean  "cc_location",                    default: false
  end

  create_table "reports", force: :cascade do |t|
    t.string   "name",       limit: 255
    t.text     "fields",     limit: 65535
    t.integer  "shop_id",    limit: 4
    t.datetime "created_at",               null: false
    t.datetime "updated_at",               null: false
  end

  create_table "reservation_items", force: :cascade do |t|
    t.integer  "reservation_id",     limit: 4
    t.integer  "variant_id",         limit: 4
    t.integer  "quantity",           limit: 4, null: false
    t.datetime "start",                        null: false
    t.datetime "finish",                       null: false
    t.integer  "status",             limit: 4
    t.integer  "quantity_available", limit: 4
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "reservation_items", ["reservation_id"], name: "index_reservation_items_on_reservation_id", using: :btree
  add_index "reservation_items", ["variant_id"], name: "index_reservation_items_on_variant_id", using: :btree

  create_table "reservations", force: :cascade do |t|
    t.integer  "shop_id",    limit: 4
    t.string   "cart_token", limit: 255
    t.datetime "expires_at"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "reservations", ["shop_id"], name: "index_reservations_on_shop_id", using: :btree

  create_table "resource_allocations", force: :cascade do |t|
    t.integer  "resource_id",     limit: 4
    t.integer  "booking_item_id", limit: 4
    t.decimal  "allocation",                precision: 2, default: 1
    t.datetime "created_at",                                          null: false
    t.datetime "updated_at",                                          null: false
  end

  add_index "resource_allocations", ["booking_item_id"], name: "index_resource_allocations_on_booking_item_id", using: :btree
  add_index "resource_allocations", ["resource_id"], name: "index_resource_allocations_on_resource_id", using: :btree

  create_table "resource_constraints", force: :cascade do |t|
    t.integer  "resource_id", limit: 4
    t.integer  "product_id",  limit: 4
    t.datetime "created_at",            null: false
    t.datetime "updated_at",            null: false
  end

  add_index "resource_constraints", ["product_id"], name: "index_resource_constraints_on_product_id", using: :btree
  add_index "resource_constraints", ["resource_id"], name: "index_resource_constraints_on_resource_id", using: :btree

  create_table "resource_groups", force: :cascade do |t|
    t.string   "name",        limit: 255
    t.text     "description", limit: 65535
    t.datetime "created_at",                null: false
    t.datetime "updated_at",                null: false
    t.integer  "shop_id",     limit: 4
  end

  add_index "resource_groups", ["shop_id"], name: "index_resource_groups_on_shop_id", using: :btree

  create_table "resource_groups_resources", id: false, force: :cascade do |t|
    t.integer "resource_id",       limit: 4
    t.integer "resource_group_id", limit: 4
  end

  create_table "resources", force: :cascade do |t|
    t.string   "name",          limit: 255
    t.string   "description",   limit: 255
    t.integer  "user_id",       limit: 4
    t.string   "resource_type", limit: 255
    t.datetime "created_at",                null: false
    t.datetime "updated_at",                null: false
    t.integer  "shop_id",       limit: 4
  end

  add_index "resources", ["shop_id", "user_id"], name: "index_resources_on_shop_id_and_user_id", using: :btree
  add_index "resources", ["shop_id"], name: "index_resources_on_shop_id", using: :btree
  add_index "resources", ["user_id"], name: "index_resources_on_user_id", using: :btree

  create_table "roles", force: :cascade do |t|
    t.integer  "account_id", limit: 4
    t.integer  "user_id",    limit: 4
    t.integer  "ranking",    limit: 4
    t.datetime "created_at",           null: false
    t.datetime "updated_at",           null: false
  end

  add_index "roles", ["account_id"], name: "index_roles_on_account_id", using: :btree
  add_index "roles", ["user_id"], name: "index_roles_on_user_id", using: :btree

  create_table "schedule_adjustments", force: :cascade do |t|
    t.integer  "adjustable_id",   limit: 4
    t.string   "adjustable_type", limit: 255
    t.datetime "old_date"
    t.datetime "new_date"
    t.datetime "created_at",                  null: false
    t.datetime "updated_at",                  null: false
  end

  create_table "schedule_items", force: :cascade do |t|
    t.integer  "product_id",    limit: 4
    t.integer  "variant_id",    limit: 4
    t.string   "type",          limit: 255
    t.datetime "start"
    t.datetime "finish"
    t.integer  "duration",      limit: 4
    t.text     "rule",          limit: 65535
    t.datetime "created_at",                  null: false
    t.datetime "updated_at",                  null: false
    t.integer  "schedule_id",   limit: 4
    t.text     "schedule_yaml", limit: 65535
  end

  add_index "schedule_items", ["type", "product_id", "start"], name: "product_id_start_index", using: :btree
  add_index "schedule_items", ["variant_id"], name: "index_schedule_items_on_variant_id", using: :btree

  create_table "schedules", force: :cascade do |t|
    t.integer  "schedulable_id",   limit: 4
    t.string   "schedulable_type", limit: 255
    t.datetime "created_at",                   null: false
    t.datetime "updated_at",                   null: false
  end

  create_table "seasons", force: :cascade do |t|
    t.string   "name",          limit: 255
    t.string   "id_of_season",  limit: 255
    t.date     "start"
    t.date     "finish"
    t.integer  "hourable_id",   limit: 4
    t.string   "hourable_type", limit: 255
    t.datetime "created_at",                null: false
    t.datetime "updated_at",                null: false
  end

  add_index "seasons", ["hourable_id", "hourable_type"], name: "index_seasons_on_hourable_id_and_hourable_type", using: :btree

  create_table "shop_notes", force: :cascade do |t|
    t.integer  "shop_id",           limit: 4
    t.string   "message",           limit: 255, default: "Booking created"
    t.boolean  "was_read",                      default: false
    t.string   "message_type",      limit: 255, default: "Note"
    t.boolean  "actionable",                    default: false
    t.boolean  "action_taken",                  default: false
    t.datetime "created_at",                                                null: false
    t.datetime "updated_at",                                                null: false
    t.integer  "external_order_id", limit: 4
    t.string   "noteable_type",     limit: 255
    t.integer  "noteable_id",       limit: 4
  end

  add_index "shop_notes", ["noteable_id", "noteable_type"], name: "index_shop_notes_on_noteable_id_and_noteable_type", using: :btree
  add_index "shop_notes", ["shop_id"], name: "index_shop_notes_on_shop_id", using: :btree

  create_table "shops", force: :cascade do |t|
    t.integer  "shop_id",              limit: 4,     default: 0,     null: false
    t.string   "site",                 limit: 255
    t.boolean  "processing"
    t.string   "subdomain",            limit: 255
    t.datetime "created_at",                                         null: false
    t.datetime "updated_at",                                         null: false
    t.string   "timezone",             limit: 255
    t.text     "settings_yaml",        limit: 65535
    t.integer  "charge_id",            limit: 8,     default: 0
    t.string   "provider",             limit: 255
    t.string   "uid",                  limit: 255
    t.string   "google",               limit: 255
    t.text     "opening_hours",        limit: 65535
    t.string   "oauth_token",          limit: 255
    t.boolean  "send_reminders",                     default: true
    t.integer  "reminder_time",        limit: 4,     default: 4320
    t.string   "stripe_customer_id",   limit: 255
    t.boolean  "consolidate_bookings",               default: true
    t.string   "email",                limit: 255,   default: ""
    t.string   "owner",                limit: 255,   default: ""
    t.boolean  "reminder_cc_location",               default: false
    t.integer  "bookings_count",       limit: 4,     default: 0,     null: false
  end

  add_index "shops", ["subdomain"], name: "index_shops_on_subdomain", using: :btree

  create_table "terms", force: :cascade do |t|
    t.integer  "product_id",  limit: 4
    t.datetime "start_date"
    t.datetime "finish_date"
    t.datetime "created_at",              null: false
    t.datetime "updated_at",              null: false
    t.string   "name",        limit: 255
  end

  create_table "users", force: :cascade do |t|
    t.string   "email",                  limit: 255, default: "", null: false
    t.string   "encrypted_password",     limit: 255, default: "", null: false
    t.string   "reset_password_token",   limit: 255
    t.datetime "reset_password_sent_at"
    t.datetime "remember_created_at"
    t.integer  "sign_in_count",          limit: 4,   default: 0,  null: false
    t.datetime "current_sign_in_at"
    t.datetime "last_sign_in_at"
    t.string   "current_sign_in_ip",     limit: 255
    t.string   "last_sign_in_ip",        limit: 255
    t.string   "name",                   limit: 255
    t.string   "title",                  limit: 255
    t.datetime "created_at",                                      null: false
    t.datetime "updated_at",                                      null: false
    t.integer  "shop_id",                limit: 4
    t.string   "uuid",                   limit: 255
    t.integer  "role_id",                limit: 4
    t.string   "first_name",             limit: 255
    t.string   "last_name",              limit: 255
    t.string   "confirmation_token",     limit: 255
    t.datetime "confirmed_at"
    t.datetime "confirmation_sent_at"
    t.string   "unconfirmed_email",      limit: 255
    t.string   "invitation_token",       limit: 255
    t.datetime "invitation_created_at"
    t.datetime "invitation_sent_at"
    t.datetime "invitation_accepted_at"
    t.integer  "invitation_limit",       limit: 4
    t.integer  "invited_by_id",          limit: 4
    t.string   "invited_by_type",        limit: 255
    t.integer  "invitations_count",      limit: 4,   default: 0
  end

  add_index "users", ["confirmation_token"], name: "index_users_on_confirmation_token", unique: true, using: :btree
  add_index "users", ["invitation_token"], name: "index_users_on_invitation_token", unique: true, using: :btree
  add_index "users", ["invitations_count"], name: "index_users_on_invitations_count", using: :btree
  add_index "users", ["invited_by_id"], name: "index_users_on_invited_by_id", using: :btree
  add_index "users", ["shop_id"], name: "index_users_on_shop_id", using: :btree

  create_table "variants", force: :cascade do |t|
    t.integer  "product_id",          limit: 4
    t.integer  "variant_id",          limit: 4
    t.integer  "external_id",         limit: 8
    t.string   "title",               limit: 255
    t.float    "price",               limit: 24
    t.float    "compare_at_price",    limit: 24
    t.string   "sku",                 limit: 255
    t.text     "options_yaml",        limit: 65535
    t.text     "settings_yaml",       limit: 65535
    t.float    "duration",            limit: 24
    t.integer  "duration_units",      limit: 4
    t.integer  "all_day",             limit: 4
    t.datetime "last_sync"
    t.datetime "created_at",                                        null: false
    t.datetime "updated_at",                                        null: false
    t.datetime "deleted_at"
    t.string   "option1",             limit: 255
    t.string   "option2",             limit: 255
    t.string   "option3",             limit: 255
    t.integer  "party_size",          limit: 4,     default: 1
    t.time     "start_time"
    t.time     "finish_time"
    t.boolean  "ignore",                            default: false
    t.integer  "booking_items_count", limit: 4,     default: 0,     null: false
  end

  add_index "variants", ["deleted_at"], name: "index_variants_on_deleted_at", using: :btree
  add_index "variants", ["external_id"], name: "index_variants_on_external_id", using: :btree
  add_index "variants", ["product_id"], name: "index_variants_on_product_id", using: :btree
  add_index "variants", ["product_id"], name: "product_id_index", using: :btree

  create_table "versions", force: :cascade do |t|
    t.string   "item_type",  limit: 255,   null: false
    t.integer  "item_id",    limit: 4,     null: false
    t.string   "event",      limit: 255,   null: false
    t.string   "whodunnit",  limit: 255
    t.text     "object",     limit: 65535
    t.datetime "created_at"
  end

  add_index "versions", ["item_type", "item_id"], name: "index_versions_on_item_type_and_item_id", using: :btree

  add_foreign_key "booking_items", "locations"
  add_foreign_key "flipper_gates", "flipper_features", name: "flipper_gates_flipper_feature_id_fk"
  add_foreign_key "occurrences", "schedule_items"
  add_foreign_key "product_locations", "locations"
  add_foreign_key "product_locations", "products"
  add_foreign_key "reservation_items", "reservations"
  add_foreign_key "reservation_items", "variants"
  add_foreign_key "reservations", "shops"
end
