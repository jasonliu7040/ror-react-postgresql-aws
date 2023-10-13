class JavascriptsController < ApplicationController
  before_filter :current_account
  before_filter :set_settings

  skip_before_filter :verify_authenticity_token
  #
  # Installed into from each shop via a ScriptTag, bta.js
  # bootstraps the widgets on the product and cart page.
  #
  def bta
    @path = params[:path_prefix] || '/apps/bookthatapp'

    unless Rails.env.development?
      fresh_when :last_modified => @account.updated_at, :etag => @account
    end
  end

  def wizard
  end

  #
  # Called from the product page
  #
  define_method('bta-product') do
  end

  #
  # Called from the cart page
  #
  define_method('bta-cart') do
  end

  #
  # Called from the order status page
  #
  define_method('bta-order-status') do
  end

private
  def set_settings
    if @account
      @settings = @account.settings
    else
      render :nothing => true, :status => 404
    end
  end
end
