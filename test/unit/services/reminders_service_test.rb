require 'test_helper'

class RemindersServiceTest < ActiveSupport::TestCase

  setup do
    mock_out :get, "shop.xml"
    @gav_booking = events(:gav)
    @three_days_for_scheduled_daily_product_booking = events(:three_days_for_scheduled_daily_product)
    @booking_with_different_times = events(:with_different_times)
  end

  test 'should send emails before event starts' do
    time = @gav_booking.start - 3.days
    assert_difference "ActionMailer::Base.deliveries.count", 1 do
      SendRemindersJob.new(time).perform
    end
    mail = ActionMailer::Base.deliveries.last
    assert_equal 'email before event', mail['Subject'].to_s
  end

  test 'should send emails before event ends' do
    time = @gav_booking.finish - 3.days
    assert_difference "ActionMailer::Base.deliveries.count", 1 do
      SendRemindersJob.new(time).perform
    end
    mail = ActionMailer::Base.deliveries.last
    assert_equal 'email before event', mail['Subject'].to_s
  end

  test 'should send emails after event starts' do
    # also should send sms (see tests logs)
    time = @three_days_for_scheduled_daily_product_booking.start + 3.days
    assert_difference "ActionMailer::Base.deliveries.count", 1 do
      SendRemindersJob.new(time).perform
    end
    mail = ActionMailer::Base.deliveries.last
    assert_equal 'email after event', mail['Subject'].to_s
  end

  test 'should send emails after event ends' do
    # also should send sms (see tests logs)
    time = @three_days_for_scheduled_daily_product_booking.finish + 3.days
    assert_difference "ActionMailer::Base.deliveries.count", 1 do
      SendRemindersJob.new(time).perform
    end
    mail = ActionMailer::Base.deliveries.last
    assert_equal 'email after event', mail['Subject'].to_s
  end

  test 'should not send emails' do
    # also should send sms (see tests logs)
    time = @three_days_for_scheduled_daily_product_booking.finish + 4.days
    assert_difference "ActionMailer::Base.deliveries.count", 0 do
      SendRemindersJob.new(time).perform
    end
  end

  test 'should send emails for booking item which has different start time' do
    item = booking_items(:dif_times2)
    time = item.start - 3.days
    assert_difference "ActionMailer::Base.deliveries.count", 1 do
      SendRemindersJob.new(time).perform
    end
    mail = ActionMailer::Base.deliveries.last
    assert_equal 'email before event', mail['Subject'].to_s
  end

  test 'should send emails for booking item which has different finish time' do
    item = booking_items(:dif_times2)
    time = item.finish + 3.days
    assert_difference "ActionMailer::Base.deliveries.count", 2 do
      SendRemindersJob.new(time).perform
    end
    mail = ActionMailer::Base.deliveries.last
    assert_equal 'email after event', mail['Subject'].to_s
  end

  test 'should send emails with correct templates' do
    item = booking_items(:dif_times3)
    time = item.finish + 3.days
    assert_difference "ActionMailer::Base.deliveries.count", 2 do
      SendRemindersJob.new(time).perform
    end
    mail_for_shop11 = ActionMailer::Base.deliveries[-1]
    mail_for_shop1 = ActionMailer::Base.deliveries[-2]
    assert_equal 'email after event', mail_for_shop1['Subject'].to_s
    assert_equal 'email after event', mail_for_shop11['Subject'].to_s

    assert_match /template for 11 shop/, mail_for_shop11.body.encoded
    assert_no_match /template for 1 shop/, mail_for_shop11.body.encoded
    assert_match /template for 1 shop/, mail_for_shop1.body.encoded
    assert_no_match /template for 11 shop/, mail_for_shop1.body.encoded
  end

end