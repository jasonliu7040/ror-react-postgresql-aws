FactoryGirl.define do
  factory :shop do |f|
    subdomain "rspec"
    site "https://35b63cb98175322a555e035845626664:7f3f8c39b54fd74ccd06cd448965f34c@test.myshopify.com/admin"
    oauth_token "35b63cb98175322a555e035845626664:7f3f8c39b54fd74ccd06cd448965f34c"
    timezone { Time.zone }
    settings_yaml "--- !ruby/object:OpenStruct\ntable:\n  :wizard: inactive\n  :quantity_range: 'no'\n  :message_booked_out: Booked Out\n  :message_blacked_out: Blacked Out\n  :message_unscheduled: Not Scheduled\n  :message_unavailable: Unavailable\n  :df: dd/mm/yy\n"

    initialize_with { Shop.find_or_create_by_subdomain(subdomain)}
  end
end
