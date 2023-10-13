FactoryGirl.define do
  factory :booking_item do |f|
    f.association :shop, :subdomain => 'rspec'
    f.start   { 1.day.from_now }
    f.finish   { 2.days.from_now }
    f.quantity 1

    f.association :booking
    f.association :product
    f.association :variant
  end
end


