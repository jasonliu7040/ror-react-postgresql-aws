require 'chronic'

class BookingsController < ApplicationController
  include SpecificRendering
  include SettingsHelper

  before_filter :account_required, :find_products, except: [:send_reminders]
  skip_before_filter :verify_authenticity_token, :only => [:sms]


  def index
    redirect_to events_path
  end

  def new
    # Used by old code
    @booking = current_account.bookings.build
    bi = @booking.booking_items.build
    bi.resource_allocations.build

    # Used by react
    @isTrialAccount = current_account.charge_id == -1
    @shopId = current_account.id
    @reminder_templates = reminder_templates_for_select
  end

  def create
    @booking = current_account.bookings.build(booking_params)
    respond_to do |format|
      if @booking.save
        flash[:notice] = "Booking saved"
        format.html { redirect_to edit_booking_path(@booking) }
        format.js { render json: { id: @booking.id, message: flash.notice } }
      else
        format.html { render :action => "new" }
        format.js do
          render json: { errors: @booking.errors.full_messages, message: "Failed to save!" },
                 status: :unprocessable_entity
        end
      end
    end
  end

  def show
    @booking = current_account.bookings.find(params[:id])
    redirect_to booking_path(@booking)
  end

  def edit
    begin
      @booking = current_account.bookings.find(params[:id])

      @booking.booking_items.includes([:product, :resources]).each do |bi|
        if bi.resource_allocations.empty?
          bi.resource_allocations.build
        end
      end

      # Used by react
      @isTrialAccount = current_account.charge_id == -1
      @shopId = current_account.id
      @reminder_templates = reminder_templates_for_select

    rescue ActiveRecord::RecordNotFound
      flash[:error] = "Booking #{params[:id]} not found"
      redirect_to(events_url)
    end
  end

  def update
    if params[:incomplete_booking].present?
      b = params[:incomplete_booking]
      @booking = current_account.incomplete_bookings.find(b[:id])
      @booking.type = "Booking"
    else
      b = booking_params
      begin
        @booking = current_account.bookings.find(b[:id])
      rescue ActiveRecord::RecordNotFound
        flash[:error] = "Booking #{b[:id]} not found"
        redirect_to(events_url)
        return
      end
    end

    if params[:delete]
      @booking.destroy
      redirect_to(events_url)
    else
      respond_to do |format|
        if @booking.update_attributes(b)
          @booking.sync_booking_dates
          format.html { redirect_to edit_booking_path(@booking), :message => "Booking saved" }
          format.js   { render json: { booking: BookingSerializer.new(@booking.reload, root: false).as_json, message: "Booking saved" } }
        else
          #flash[:model] = @booking
          #redirect_to :action => :edit
          format.html { render :edit }
          format.js do
            render json: { errors: @booking.errors.full_messages, message: "Failed to save!" },
                   status: :unprocessable_entity
          end
        end
      end
    end
  end

  def email_activity
    @booking = current_account.bookings.find(params[:id])
    @email_events = current_account.email_events.where(booking_id: params[:id])

    respond_to do |format|
      format.html { render :layout => nil }
      format.js { render json: { email_events: @email_events } }
    end
  end

  # echo '' | curl -X POST -H 'Content-type: text/xml' -H 'X-SHOPIFY-SHOP-DOMAIN: legros-parker-and-harris6290.myshopify.com' -d @- http://legros-parker-and-harris6290.bookthatapp.dev:3005/bookings/reminder
  def reminder
    if params[:id].nil?
      render :text => "Missing id param", :status => 400
      return
    end

    Delayed::Job.enqueue BookingReminderEmailJob.new(current_account.id, params[:id]), :priority => 5

    render :nothing => true, :status => 200
  end

  def sms
    if params[:id].nil?
      render :text => "Missing id param", :status => 400
      return
    end

    booking = current_account.bookings.find_by_id(params[:id])
    unless booking
      render :text => "Booking #{params[:id]} not found", :status => 404
      return
    end

    shop = booking.shop
    template = shop.template("sms")
    message = template.render({"shop" => shop.external_shop, "booking" => booking})

    respond_to do |format|
      format.js {
        begin
          unless Rails.env.test?
            sms = $twilio.account.sms.messages.create(:body => message, :to => booking.phone, :from => "+13217326105")
          end

          #puts sms.sid
          render :nothing => true, :status => 200
        rescue Twilio::REST::RequestError => e
          render :text => e.message, :status => 500
        end
      }
    end
  end

  def send_reminders
    params = send_reminders_params
    booking_ids = params[:booking_ids]
    template_id = params[:template_id]

    if booking_ids.present? && template_id.present?
      Delayed::Job.enqueue BookingRemindersJob.new(current_account.id, booking_ids, template_id), :priority => 5
      render :json => {message: 'Reminders sent'}, status: 200
    else
      render :json => {message: 'No bookings selected'}, status: 404
    end
  end

  def ticket
    booking = current_account.bookings.find_by(:id => params[:id])
    if booking.present?
      @content = booking.render_ticket
      respond_to do |format|
        format.html { render :layout => 'barebones' }
        format.pdf do
          kit = PDFKit.new(@content)
          send_data(kit.to_pdf, :filename => "ticket_#{booking.id}.pdf", :type => 'application/pdf', :disposition => 'inline')
        end
      end
    else
      redirect_to root_url, :error => 'Booking not found'
    end
  end

  def attendance
    booking = current_account.bookings.where(:id => params[:id]).first

    respond_to do |format|
      format.json {
        if booking.present?
          if booking.update_attributes(:attended => (params[:attended] == 'true'))
            render :text => "Booking updated", :status => 200
          else
            render :text => "Booking update failed", :status => 500
          end
        else
          render :text => "Booking not found", :status => 404
        end
      }
    end
  end

  private
  def find_products
    @products = current_account.products.order(:product_title)
    @variants = []
    @resources = current_account.resources.order(:name)
  end


  def booking_params
    params.require(:booking).permit(
        :id,
        :product_id,
        :variant_id,
        :all_day,
        :start,
        :finish,
        :order_name,
        :sku,
        :hotel,
        :notes,
        :status,
        :name,
        :email,
        :phone,
        :number_in_party,
        {:booking_names_attributes => [
            :id,
            :name,
            :email,
            :phone,
            :_destroy]},
        {:booking_items_attributes => [
            :id,
            :shop_id,
            :start,
            :finish,
            :product_id,
            :variant_id,
            :quantity,
            :location_id,
            {:resource_allocations_attributes => [
                :id,
                :resource_id,
                :_destroy]},
            :_destroy
        ]}
    )
  end

  def send_reminders_params
    params.require(:reminders).permit(:template_id, :booking_ids => [])
  end
end
