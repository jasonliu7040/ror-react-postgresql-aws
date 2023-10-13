require 'test_helper'

class CreateEmailEventJobTest < ActiveSupport::TestCase
  test 'it creates an email event' do
    assert_difference "EmailEvent.count", 3 do
      json = JSON.parse %q(
        [{
          "email":"john.doe@sendgrid.com",
          "timestamp":1337197600,
          "smtp-id":"<4FB4041F.6080505@sendgrid.com>",
          "event":"processed",
          "shop":"test",
          "booking":"1"
        }, {
          "email":"john.doe@sendgrid.com",
          "timestamp":1337966815,
          "category":"newuser",
          "event":"click",
          "url":"http://sendgrid.com",
          "shop":"test",
          "booking":"1"
        }, {
          "email":"john.doe@sendgrid.com",
          "timestamp":1337969592,
          "smtp-id":"<20120525181309.C1A9B40405B3@Example-Mac.local>",
          "event":"processed",
          "shop":"test",
          "booking":"1"
        }]
      )

      CreateEmailEventJob.new(json).perform
    end
  end
end
