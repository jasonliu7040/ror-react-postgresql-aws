require 'test_helper'

class AccountTest < ActiveSupport::TestCase
  setup do
    @account = accounts(:test)
    @hawaii = accounts(:aloha)
  end
  test "can find one owner" do
    assert_equal "Jim Jones", @account.owners.first.user.name
  end

  test "can find multiple owners" do
    assert_equal 2, @hawaii.owners.count
  end

  test "has staff" do
    assert_equal 2, @account.staff.count
  end

  test "has one admin" do
    assert_equal 1, @hawaii.admins.count
  end
end
