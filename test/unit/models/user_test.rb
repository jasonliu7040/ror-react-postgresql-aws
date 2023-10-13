require 'test_helper'

class UserTest < ActiveSupport::TestCase
  test "identifies as an admin on user" do
    assert users(:one).is_admin?
  end

  test "refutes is an admin" do
    refute users(:staff_one).is_admin?
  end
end
