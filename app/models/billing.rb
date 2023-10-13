class Billing < ActiveRecord::Base
  belongs_to :account
  # attr_accessible :vendor_string, :vendor_name
  def is_stripe?
    vendor_name == "Stripe"
  end

  def is_shopify?
    vendor_name == "Shopify"
  end
end
