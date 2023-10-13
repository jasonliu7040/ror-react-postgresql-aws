require 'chronic'

class OrdersController < ApplicationController
  before_filter  :find_products

  def index
    redirect_to events_path
  end

  def show
    @booking = @account.bookings.find(params[:id])
    respond_to do |format|
      format.html {redirect_to(edit_booking_path(@booking))}
      format.ics do
        @calendar = Icalendar::Calendar.new
        @calendar.add_event @booking.ical
        @calendar.publish
        @calendar_output = @calendar.to_ical
      end
    end

  end

  def new
    @booking = @account.orders.build
    @items = @booking.items.build
    @booking_names = @items.booking_names.build
    start = Time.now
    finish = start + 1.hour

    if params[:all_day].present?
      @items.all_day = 0
      @items.all_day = 1 if params[:all_day] == "true"
    end

    if params[:start].present?
      start = Chronic.parse(params[:start])
    end

    if params[:finish].present?
      finish = params[:finish].present? ? Chronic.parse(params[:finish]) : @start + 1.day
    end

    @items.start = start
    @items.finish = finish
  end
#does this do an item too?
  def create
    order_params = the_order_params.except('id')
    order_params[:items_attributes]["0"].merge!("shop_id" => @account.id)
    @booking = @account.orders.build(order_params)
#    TODO: Why won't items attribute show up, so screw it i'm putting it normally or gsubbing the thing
    @booking.all_day = false unless params[:order][:all_day].present?
    respond_to do |format|
      if @booking.save
        flash[:notice] = "Booking saved"
        @variants = Variant.all(:conditions => {:product_id => @booking.product})
        format.html { redirect_to events_path }
        format.xml  { render :xml => @booking, :status => :created, :location => @booking }
        format.js
      else
        @items = @booking.items.first
        @booking_names = @items.booking_names
        @variants = Variant.all(:conditions => {:product_id => @booking.product})
        format.html { render :action => "new" }
        format.xml  { render :xml => @booking.errors, :status => :unprocessable_entity }
        format.js
      end
    end
  end

  def edit
    begin
      @booking = flash[:model] ? flash[:model] : @account.bookings.find(params[:id])
      lookup_variants()
      render "bookings/edit"
    rescue ActiveRecord::RecordNotFound
      flash[:error] = "Booking not found"
      redirect_to(events_url)
    end
  end

  def lookup_variants
    @variants = Variant.all(:conditions => {:product_id => @booking.product})
  end

  def update
    if params[:incomplete_booking].present?
      b = params[:incomplete_booking]
      @booking = @account.incomplete_bookings.find(b[:id])
      @booking.type = "Booking"
    else
      b =  params[:booking]
      @booking = @account.bookings.find(b[:id])
    end


    lookup_variants()

    if params[:delete]
      @booking.delete
      redirect_to(events_url)
    elsif params[:reminder]

        # @items = @booking.items.first
        # @booking_names = @items.booking_names
        # @variants = Variant.all(:conditions => {:product_id => @booking.product})

      #@booking.send_reminder
      render "bookings/edit"
    else
      if @booking.update_attributes(b)
        redirect_to edit_booking_path(@booking), :notice => "Booking saved"
      else
        #flash[:model] = @booking
        #redirect_to :action => :edit
        render "bookings/edit"
      end
    end
  end

  def email_activity
    @booking = @account.bookings.find(params[:id])
    key = "bta.booking:#{current_subdomain}.#{params[:id]}"
    #    redis = Redis.new(:host => '54.210.156.107', :port => 6379)
    unless Rails.env.development? ||Rails.env.test?
      @email_activity = ($redis.smembers(key) || []).map {|val| ActiveSupport::JSON.decode(val)} #.sort_by{|key, val| val.}
    end


    respond_to do |format|
      format.html { render :layout => nil }
    end
  end

  # echo '' | curl -X POST -H 'Content-type: text/xml' -H 'X-SHOPIFY-SHOP-DOMAIN: legros-parker-and-harris6290.myshopify.com' -d @- http://legros-parker-and-harris6290.bookthatapp.dev:3005/bookings/reminder
  def reminder
    if params[:id].nil?
      render :text=>"Missing id param", :status => 400
      return
    end

    booking = @account.bookings.find_by_id(params[:id])
    unless booking
      render :text=>"Booking #{params[:id]} not found", :status => 404
      return
    end

    Delayed::Job.enqueue BookingReminderEmailJob.new(booking.shop.id, booking.id), :priority => 10
    # BookingReminderEmailJob.new(booking.id).perform

    render :nothing => true, :status => 200
  end

  def sms
    if params[:id].nil?
      render :text=>"Missing id param", :status => 400
      return
    end

    booking = @account.bookings.find_by_id(params[:id])
    unless booking
      render :text=>"Booking #{params[:id]} not found", :status => 404
      return
    end

    shop = booking.shop
    template = shop.template("sms")
    message = template.render({"shop" => shop.external_shop, "booking" => booking});

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

  def ticket
    booking = @account.bookings.where(:id => params[:id])
    if booking.present?
      @content = @account.template("ticket").render({"shop" => @account.external_shop, "booking" => booking.first})
      respond_to do |format|
        format.html {render :layout => 'barebones', :action => "ticket", :controller => "bookings"}
        format.pdf do
          kit = PDFKit.new(@content)
          send_data(kit.to_pdf, :filename => "#{booking.first.id}.pdf", :type => 'application/pdf', :disposition => 'inline')
        end
      end

    else
      redirect_to root_url, :error => "This is not your booking or booking not found"
    end
  end

private
  def find_products
    @products = Product.all(:conditions => {:shop_id => @account.id}, :order => "product_title")
    @variants = []
  end

  def the_order_params
    params.require(:order).permit(
    :id,
    :order_name,
    :sku,
    :hotel,
    :notes,
    :status,
    :email,
    :phone,
    :number_in_party,
    {:items_attributes => [
      :product_id,
      :variant_id,
      :all_day,
      :start,
      :finish,
      :booking_names_attributes => [
        :name,
        :email,
        :id,
        :_destroy
      ]
    ]}
    )
  end
end
