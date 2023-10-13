class ShopsController < ApplicationController
  before_filter  :current_timezone

  def update
    s = params[:shop]
    @shop = Shop.find(s[:id])

    if @shop.update_attributes(s)
      redirect_to '/settings', :notice => "Locations saved"
    end
  end

  def locations
    @shop = @account
    @locations = @account.locations.order(:name)
    respond_to do |format|
      format.html { render :layout => nil }
    end
  end
end
