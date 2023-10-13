require 'test_helper'

class RecurringScheduleTest < ActiveSupport::TestCase
  setup do
    @recurring_schedule = schedule_items(:recurring_13)
  end

  test "gets correct occurrences" do
    occurrences = @recurring_schedule.occurrences(Time.new(2016,01,01), Time.new(2016,12,01))
    occurrences = occurrences.map{ |o| o[:start].getutc() }
    expected_starts = [
                        Time.utc(2016, 01, 18, 9, 00),
                        Time.utc(2016, 01, 19, 9, 00),
                        Time.utc(2016, 01, 20, 9, 00)
    ]
    assert_equal expected_starts.sort, occurrences.sort
  end
end
