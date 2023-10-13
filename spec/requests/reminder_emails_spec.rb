require 'rails_helper'

describe "ReminderEmails" do
  describe "GET /reminder_emails" do
    it "emails a reminder when viewing a booking" do
      FactoryGirl.create(:booking)
      visit booking_path
      click_link "reminder"
    end
  end
end
