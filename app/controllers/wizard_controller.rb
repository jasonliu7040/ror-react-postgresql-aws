class WizardController < ApplicationController
  def index
    @products = Product.find(:all, :conditions => {:shop_id => @account.id})
    respond_to do |format|
      format.html { render :layout => false }
    end
  end
end
