class ItemsController < ApplicationController
  before_filter  :get_reservation
  before_filter :get_item, except: [:index]
  def index
    @items = @reservation.items
  end

  def show
    respond_to do |format|
      format.ics do
        @calendar = Icalendar::Calendar.new
        @calendar.add_event @item.ical
        @calendar.publish
        @calendar_output = @calendar.to_ical
      end
      format.html
    end
  end

  def edit
    @order = @item.event
    @booking_names = @item.booking_names
  end

  def update
    if @item.present?
      if @item.update_attributes(item_params)
        respond_to do |format|
          format.json do
            render :json => {:reservation => @reservation}
          end
          format.html do
            redirect_to events_url, :notice => "Save successful"
          end
        end
      else
        respond_to do |format|
          format.json do
            render_json_error("Item was not saved", 412, @item.errors.messages)
          end
          format.html
        end

      end
    else
      respond_to do |format|
        format.html
        format.json do
          render_json_error("Item was not found")
        end

      end

    end
  end

  def destroy
    if @item.present?
      @item.destroy
      render :json => {:item => "Item #{params[:id]} Destroyed"}
    else
      render_json_error("Item was not found")
    end
  end
  private
  def get_reservation

    @reservation = @account.reservations.where(:cart_token => params[:reservation_id]).first
  end
  def get_item
    @item = if @reservation.present? && params[:reservation_id].present?
              @reservation.items.where(:id => params[:id]).first
            else
              @account.items.where(:id => params[:id]).first
            end
  end
  def item_params
    params.require(:item).permit(
      :variant_id,
      :quantity,
      :start,
      :finish,
      {:booking_names_attributes => [:id, :name, :email, :_destroy]}
      )
  end
end
