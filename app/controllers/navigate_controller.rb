class NavigateController < ApplicationController
  before_filter :return_unauthorized_status

  def bookings
    if @the_shop.nil?
      not_found
    else
      booking = @the_shop.events.find_by_order_id(@external_id)
      if booking
        redirect_to @the_url + "#{booking.class.to_s.downcase}s/#{booking.id}/edit"
      else
        flash[:notice] = "No booking found for order #{@external_id}"
        redirect_to @the_url + "events"
      end
    end
  end

  def products
    product = @the_shop.products.find_by_external_id(@external_id.to_i)
    if product
      redirect_to "#{@the_url}products/#{product.id}/edit"
    else
      redirect_to @the_url + "products"
    end
  end

private
  def return_unauthorized_status
    if !params.has_key?(:shop)
      render :nothing => true, :status => 503
    else
      if !/^www/.match(request.host)
        render :nothing => true, :status => 503
      else
        grab_defaults
      end
    end
  end
  def grab_defaults
    @shop_sub = params[:shop].split('.').first
    @the_shop = Shop.find_by_subdomain(@shop_sub)
    @external_id = params[:id] || ""
    @the_url = "#{request.protocol}#{@shop_sub}.#{DOMAIN}/"
  end
end
