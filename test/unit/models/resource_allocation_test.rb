require 'test_helper'

class ResourceAllocationTest < ActiveSupport::TestCase
  test "availability" do
    # fixture has these dates set up
    start = DateTime.new(2015, 8, 18, 9)
    finish = DateTime.new(2015, 8, 18, 10)
    assert_equal(false, resources(:one).available?(start, finish), 'resource one should not be available')

    start = DateTime.now.utc
    finish = 1.hour.from_now
    assert_equal(true, resources(:one).available?(start, finish), 'resource should be available')
  end
end
