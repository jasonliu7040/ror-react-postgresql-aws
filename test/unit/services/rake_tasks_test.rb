require 'test_helper'
require 'rake'

Rails.application.load_tasks

class RakeTaskTest < ActiveSupport::TestCase
  test "try out the rake task too" do
    mock_out :get, "shop.xml"
    assert_difference "ActionMailer::Base.deliveries.count" do
      Rake::Task['bookthatapp:send_reminders'].invoke
    end
  end
end
