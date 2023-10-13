class NotificationsController < ApplicationController
  before_filter :ensure_not_blacklisted

  def index
    @shop = @account

    respond_to do |format|
      format.html do
        @action_items = @shop.shop_notes.action_items.order('created_at DESC').page params[:page]
      end
    end
  end

  def throw
    if Rails.env.test?

      if params[:ce]
raise        ActiveResource::ClientError.new @response
      else
        raise ActiveResource::UnauthorizedAccess
      end
    else
      redirect_to "http://www.bookthatapp.com"
    end

  end
end
