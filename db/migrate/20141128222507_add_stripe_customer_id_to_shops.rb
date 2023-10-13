class AddStripeCustomerIdToShops < ActiveRecord::Migration
  def change
    add_column :shops, :stripe_customer_id, :string
  end
end
