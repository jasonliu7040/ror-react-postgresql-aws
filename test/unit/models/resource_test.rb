require 'test_helper'

class ResourceTest < ActiveSupport::TestCase
  test "the habtm resource group" do
    assert resources(:one).resource_groups.count > 0
  end

  test "creates the habtm resource group" do
    res = resources(:one)
    mm = res.resource_groups(:two)
    res.resource_groups << mm
    assert res.resource_groups.count > 1
  end

  test "adds the user's name" do
    shop = shops(:test)
    res = shop.resources.create({"name"=>"philip James", "description"=>"Welder", "resource_type"=>"Staff", "user_id"=>"1"})
    assert_equal User.find(1).name, res.name
  end

  # test "has base season plus one holiday season" do
  #   assert_equal 2, resources(:one).seasons.count, "Update test if you add more"
  # end

  # test "can find Thursday's from hour" do
  #   assert_equal 12, resources(:one).seasons.first.opening_hours.order(:day_number)[4].start.hour
  # end

  # test "can get the schedule for a bunch of resources in one fail swoop" do
  #   assert resources(:one).seasons.between(Date.today, Date.today + 7).present?
  # end
end
