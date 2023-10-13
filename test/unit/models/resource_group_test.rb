require 'test_helper'

class ResourceGroupTest < ActiveSupport::TestCase
  setup do
    @resource_group = resource_groups(:one)
  end
  # test "has an easter season" do
  #   assert_equal "easter-time", @resource_group.seasons.first.id_of_season
  # end
  # test "can get Monday's opening hours" do
  #   assert_equal 12, @resource_group.seasons.first.opening_hours.order(:day_number)[1].start.hour
  # end
end
