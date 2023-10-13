class ChargesController < ApplicationController
  force_ssl if Rails.env.production?
  include SpecificRendering

  def index
    @charges = []
    @delete_products_count = @account.products.count - Bookthatapp::Application.config.limited_plan_max_products

    @account.external do
      begin
        charges = ShopifyAPI::RecurringApplicationCharge.all || []
        @charges = charges
      rescue ActiveResource::Redirection
        @msg = "There is a problem with your Shopify plan so we are unable to show the charge history at this time. Please login to your Shopify Account for further instructions."
      end
    end
  end

  def installation
    if current_account.stripe_customer_id.nil?
      @stripe_charges = []
    else
      @customer_card = Stripe::Customer.retrieve(current_account.stripe_customer_id)
      @stripe_charges = Stripe::Charge.all(customer: @customer_card.id)
    end

    @account.external do
      @charges = ShopifyAPI::ApplicationCharge.all || []
    end

  end

  def confirm
    @account.external do
      charge = ShopifyAPI::RecurringApplicationCharge.find(params[:charge_id])
      if charge
        if charge.status == 'accepted'
          charge.activate
          @account.update_attribute :charge_id,  params[:charge_id].to_i
          redirect_to events_path(:subdomain => @account.subdomain)
        else
          flash[:notice] = 'Declined'
          redirect_to :action => 'index'
        end
      else
        flash[:notice] = 'Invalid subscription request'
        redirect_to :action => 'index'
      end
    end
  end

  def cancel
    @account.external do
      charge = ShopifyAPI::RecurringApplicationCharge.current
      if charge
        flash[:notice] = 'Your subscription has been cancelled.'
        @account.update_attribute :charge_id, -1
        charge.cancel
      else
        flash[:notice] = 'Subscription not found.'
      end
    end

    redirect_to :action => 'index'
  end

  def approve_install
    @account.external do
      charge = ShopifyAPI::ApplicationCharge.create(
          :name => 'BookThatApp Installation',
          :return_url => install_charges_url(:subdomain => current_subdomain),
          :price => Bookthatapp::Application.config.install_price,
          :test => Rails.env.development? || @account.subdomain == "legros-parker-and-harris6290")

      return redirect_to charge.confirmation_url
    end
  end

  def install # called after approve_install
    @account.external do
      charge = ShopifyAPI::ApplicationCharge.find(params[:charge_id])
      if charge.status == "accepted"
        charge.activate
        Notifier.install_email(@account).deliver_now
        flash[:notice] = "Your payment has been processed. Please check your email for a confirmation message and next steps."
      else
        flash[:notice] = "Payment request declined."
      end
      redirect_to :action => 'installation'
    end
  end

  def cancel_pending
    @account.external do
      charge = ShopifyAPI::RecurringApplicationCharge.find(params[:id])
      if charge
        charge.cancel
        flash[:notice] = 'Pending charge cancelled.'
      end
    end
    redirect_to :action => 'index'
  end

  def subscribe
    @account.external do
      charge = ShopifyAPI::RecurringApplicationCharge.create(
          :name => 'BookThatApp Subscription',
          :return_url => confirm_charges_url(:subdomain => current_subdomain),
          :price => Bookthatapp::Application.config.price,
          # :trial_days => Bookthatapp::Application.config.trial_period,
          :test => Rails.env.development? || @account.subdomain == "legros-parker-and-harris6290")

      return redirect_to charge.confirmation_url
    end
  end

  def stripe_install
    token = params[:stripeToken] # Get the credit card details submitted by the form
    redirect_to :action => :installation if token.nil?

    begin
      customer_id = current_account.stripe_customer_id
      if customer_id.nil?
        # Create a Customer
        customer = Stripe::Customer.create(
          :card => token,
          :description => "#{current_account.subdomain}",
          :email => params[:email]
        )
        customer_id = customer.id

        # Save the customer ID
        current_account.stripe_customer_id = customer_id
        current_account.save
      end

      # Charge the Customer
      stripe_install_charge(customer_id)

      flash[:notice] = "Payment success"
      redirect_to :action => :install_survey

    rescue  Stripe::InvalidRequestError => ire
      flash[:notice] = "#{ire.message}"
      redirect_to :action => :installation
    rescue Stripe::CardError => ce
      flash[:notice] = "#{ce.message}"
      redirect_to :action => :installation
    end
  end

  def stripe_install_charge(customer_id)
    charge = Stripe::Charge.create(
        :amount => (Bookthatapp::Application.config.install_price * 100).to_i, # amount in cents
        :currency => "usd",
        :customer => customer_id,
        :description => "BookThatApp Installation: #{current_account.subdomain}",
        :metadata => {:account => current_account.subdomain}
    )

    $gabba.transaction(charge.id, Bookthatapp::Application.config.install_price) if Rails.env.production?
  end

  def stripe_repeat_install
    stripe_install_charge(current_account.stripe_customer_id)
  end

  def stripe_delete_customer
    cu = Stripe::Customer.retrieve(current_account.stripe_customer_id)
    cu.delete

    current_account.stripe_customer_id = nil
    current_account.save

    redirect_to :action => :installation
  end

  # stripe webhook
  def cancelled

  end

  def install_survey

  end
end
