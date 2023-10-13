FactoryGirl.define do
  factory :variant do |f|
    f.sequence(:title) { |n| "variant #{n}" }
    duration 60
    duration_units 0 # minutes
    external_id 233592770
  end
end
