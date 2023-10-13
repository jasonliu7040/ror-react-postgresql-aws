require 'test_helper'

class BillingTest < ActiveSupport::TestCase
  setup do
    @account = accounts(:test)
    @billing = @account.billing
  end

  test "has a billing" do
    assert @account.billing.present?, "Where is the billing object?"
  end

  test "defines if it is a stripe payment plan" do
    assert @billing.is_stripe?, "finds out if it is a Stripe billing"
  end

  test "defines if it is a shopify payment plan" do
    assert accounts(:aloha).billing.is_shopify?, "finds out if it is a Shopify billing"
  end
end
