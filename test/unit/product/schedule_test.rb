require 'test_helper'

class ScheduleTest < ActiveSupport::TestCase
  test 'should accept oneoff_schedules' do
    now = Time.now
    mock_out :put, 'products/100383216.xml'
    mock_out :get, 'products/100383216.xml'
    mock_product_post 100383216

    p = products(:one_off_date_product)
    bi = booking_items(:tomorrow_for_one_off_date_product_booking_item)

    p.build_schedule
    p.schedule.oneoff_items.build({:start => bi.start})

    assert p.save, 'Should be able to save'
    assert_equal 1, p.schedule.oneoff_items.size

    calculator = AvailabilityCalculator2.new(shops(:test), bi.start.beginning_of_day, bi.finish.end_of_day, [p.id])
    products, blackouts = calculator.calculate()

    assert_not_empty products, 'No products found'

    index = products.index{|h| h[:handle] == p.product_handle }
    assert (not index.nil?), 'Product with a one off schedule not found'

    result = products[index]
    assert_not_empty result[:schedule], 'Availability result[:schedule] should have oneoff date'
  end

  test 'should accept recurring_schedules' do
    yaml = "---\n:start_date: 2016-07-08 06:16:48.346501678 +00:00\n:rrules:\n- :validations:\n    :day_of_month:\n    - 15\n  :rule_type: IceCube::MonthlyRule\n  :interval: 2\n:exrules: []\n:rtimes: []\n:extimes: []\n"
    p = products(:hook_product)
    p.build_schedule
    mock_out :get, 'products/27763452.xml'
    mock_product_post 27763452
    p.schedule.recurring_items.build(:rule => IceCube::Schedule.from_yaml(yaml))
    assert p.save, 'Should be able to save'
    assert_equal 1, p.schedule.recurring_items.size
  end

  test 'one off schedule with bookings does the correct things' do
    item = schedule_items(:tomorrow)
    item.variant_id = 1
    item.start = DateTime.now + 4.day
    assert    item.save
  end
end
