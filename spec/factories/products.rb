FactoryGirl.define do
  factory :product do |f|
    sequence(:product_title) { |n| "product #{n}" }
    capacity_type 0
    capacity 10
    external_id 1003832167
    f.association :shop, :subdomain => 'rspec'

    initialize_with { Product.find_or_create_by_external_id(1003832167)}
  end
end
