require 'test_helper'

class SeasonTest < ActiveSupport::TestCase
  setup do
    @resource = resources(:four)
  end
  # test "can get current season " do
  #   assert @resource.current_season.present?
  # end
  #
  # test "gets between" do
  #   assert @resource.seasons.current.present?, "should get seasons for today's date"
  # end
end
