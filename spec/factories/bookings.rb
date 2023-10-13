FactoryGirl.define do
  factory :booking do |f|
    sequence(:name) { |n| "#{n}" }
    f.association :shop, :subdomain => 'rspec'

    after(:build) do |booking|
      booking.booking_items << FactoryGirl.build(:booking_item, :booking => booking)
    end
  end
end
