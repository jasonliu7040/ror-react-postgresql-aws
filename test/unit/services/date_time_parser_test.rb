require 'test_helper'

class AvailabilityCalculatorTest < ActiveSupport::TestCase
  test 'isodate' do
    account = shops(:new_york) # "America/New_York"
    datestr = '2013-12-11T18:30'

    parser = account.datetime_parser
    assert_not_nil(parser.zone)

    dt = parser.parse(datestr)
    assert_not_nil(dt)
    assert_equal(Time.utc(2013, 12, 11, 18, 30, 0), dt)

    account = shops(:test) # "Canberra"
    datestr = '2014-03-29T10:00'
    parser = account.datetime_parser
    dt = parser.parse(datestr)
    assert_equal(Time.utc(2014, 03, 29, 10, 0, 0), dt)
  end

  test 'canberra' do
    # ActiveSupport::TimeZone.new("Canberra")
    # "dd/mm/yy"

    datestr = '07/12/2013'
    account = shops(:test)
    dt = account.datetime_parser.parse(datestr)
    assert_not_nil(dt)
    assert_equal(Time.utc(2013, 12, 7, 0, 0, 0), dt)
  end

  test 'theschool' do
    datestr = '2014-05-25T18:30'
    account = shops(:test) # 'dd/mm/yy'
    p = account.datetime_parser
    dt = p.parse(datestr)
    assert p.has_time?, "Parsing ISO8601 formatted date should recognize time"
    assert_not_nil(dt)
    assert_equal(Time.utc(2014, 5, 25, 18, 30, 0), dt)
  end

  test 'dotseparator' do
    datestr = '30.05.2014'
    account = shops(:test)
    p = DateTimeParser.new(account, 'dd.mm.yy')
    dt = p.parse(datestr)
    assert_not_nil(dt)
    assert_equal(Time.utc(2014, 5, 30, 0, 0, 0), dt)
  end

  test 'dashseparator' do
    datestr = '17-06-2014'
    account = shops(:test)
    p = DateTimeParser.new(account, 'dd-mm-yy')
    dt = p.parse(datestr)
    assert_not_nil(dt)
    assert_equal(Time.utc(2014, 6, 17, 0, 0, 0), dt)
  end
end
