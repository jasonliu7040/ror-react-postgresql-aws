require 'test_helper'

class ScheduleTest < ActiveSupport::TestCase
  test 'gets empty array if there is no rules' do
    occurrences = schedules(:schedule).occurrences_between(Time.new(2016, 01, 01), Time.new(2016, 12, 01))
    occurrences = occurrences.map{ |o| o[:start].getutc() }
    assert_equal [], occurrences
  end

  test 'gets empty array if schedule_yaml is empty' do
    occurrences = schedules(:schedule_with_empty_yaml).occurrences_between(Time.new(2016, 01, 01), Time.new(2016, 12, 01))
    occurrences = occurrences.map{ |o| o[:start].getutc() }
    assert_equal [], occurrences
  end
end
