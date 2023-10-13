include BookThatAppUtils

#Reports for the Shop Owner to see how their Scheduled sessions look. runsheet and enrollment have PDF functionality.
class ReportsController < ApplicationController
  before_filter :ensure_not_blacklisted, :adjust_dates_if_order_name, :load_resources
  before_filter :find_report, only: [:edit, :update, :destroy]

  include SpecificRendering

  def runsheet
    @reports = current_account.reports
    @report = Report.new
    filter_bookings
    handle_response
    @fields ||= []
  end

  def enrollments
    @enrollments = []

    if params[:start].present? # start is present when a course is selected
      @filter = EnrollmentFilter.new(current_account, params)
      @the_data = ReportsParameters.new(params) # this is only here because #handle_response uses it for the generate_filename method
      @booking_names = @filter.filter

      @booking_names.each do |booking_name|
        booking = booking_name.booking
        @enrollments << Enrollment.new(booking_id: booking_name.booking_id,
                                       name: booking_name.name,
                                       phone: booking_name.phone || booking.phone,
                                       email: booking_name.email,
                                       attended: booking.attended,
                                       payment_status: booking.status,
                                       class_name: booking.product_summary)
      end

      @total = @enrollments.size
      @enrollments = Kaminari.paginate_array(@enrollments).page(params[:page]).per(50)
    else
      start = DateTime.now.beginning_of_day
      finish = start.advance(:months => 6).end_of_day
      params[:start] = start.strftime('%Y-%m-%d')
      params[:finish] = finish.strftime('%Y-%m-%d')
      params[:profile] = 'class'
      params[:order_by] = 'name'
      params[:order_type] = 'ASC'

      @the_data = ReportsParameters.new(params)
      @total = 0
    end

    handle_response
  end

  def gantt
    unless params[:start].present?
      start = Time.now
      params[:start] = start
      params[:finish] = start + 1.week
    end

    unless params[:products].present?
      @product = current_account.products.first
      params[:products] = @product.id
      params[:variants] = @product.variants.first.id
    else
      @product = Product.find(params[:products])
    end

    filter_bookings
    handle_response
  end

  def create
    report = current_account.reports.new(report_params)
    respond_to do |format|
      if report.save
        format.html { redirect_to action: :index, notice: 'Report created' }
        format.js do
          render json: { message: 'Report created', report: report }, status: :created
        end
      else
        format.html { render :new, notice: 'Failed' }
        format.js do
          render json: { message: 'Failed to create', errors: report.errors }, status: :unprocessable_entity
        end
      end
    end
  end

  def edit
  end

  def update
    if @report.update_attributes(report_params)
      redirect_to action: :index, notice: 'Report updated'
    else
      render :edit, notice: 'Failed'
    end
  end

  def index
    @reports = current_account.reports
  end

  def new
    @report = current_account.reports.new
  end

  def destroy
    flash[:notice] = "Report deleted."
    @report.destroy
    redirect_to action: :index
  end


  private

  def find_report
    @report = current_account.reports.where(id: params[:id]).first
  end

  def report_params
    params[:report][:fields].delete_if(&:blank?) if params[:report][:fields].present?
    params.require(:report).permit(:name, fields: [])
  end

  def get_start_and_finish(start = params[:start], finish = params[:finish])
    @start = (start.blank? ? DateTime.now.beginning_of_day : DateTime.parse(start).beginning_of_day)
    @finish = (finish.blank? ? @start + 1.month : DateTime.parse(finish).end_of_day)
  end

  def handle_response
    @bookings = [] unless @bookings.present?

    respond_to do |format|
      format.xls {response.headers['Content-Disposition'] = "attachment; filename=\"#{@the_data.generate_filename(request[:action])}.xls\"" }

      format.html do
        @bookings = Kaminari.paginate_array(@bookings, {total_count: @bookings.size}).page(params[:page]).per(50)
      end

      format.pdf do
        render = render_to_string(action: 'runsheet-pdf.html.erb', layout: 'barebones') #This messed up tests but action file path is deprecated. live with warnings for now. #, :formats => [:html], :handlers => ["erb"])
        kit = PDFKit.new(render)
        send_data(kit.to_pdf,
                  :filename => "#{@the_data.generate_filename(request[:action])}.pdf",
                  :type => 'application/pdf',
                  :disposition => 'inline')
      end
    end
  end

  def has_start_and_handle
    if params.has_key?(:start) && params.has_key?(:handle)
      @start = (DateTime.parse(params[:start]))
      @product = Product.find_by_shop_id_and_product_handle(@account.id, params[:handle])
      @bookings = @product.bookings.where({:start => @start}).order('name DESC') unless @product.blank?
      @total = @bookings.present? ? @bookings.map(&:number_in_party).reduce(:+)  : 0
    end
  end

  def filter_bookings
    filter = ReportsParameters.new(params)
    @the_data = filter

    events = @account.booking_items.where(filter.date_range).includes([:booking, :variant]).order(filter.ordering)

    # manually specify join condition to avoid paranoia adding deleted_at clause
    events = events.joins('
          INNER JOIN events ON events.id = booking_items.booking_id AND events.type IN ("Booking")
          INNER JOIN variants ON variants.id = booking_items.variant_id
          INNER JOIN products ON products.id = booking_items.product_id
          LEFT JOIN booking_names ON booking_names.booking_id = events.id
    '
    )

    product_id = filter.product_id
    events = events.where(:product_id => product_id) if product_id.present?

    variant_id = filter.variant_id
    events = events.where(:variant_id => variant_id) if variant_id.present?

    resource_id = filter.resource_id
    events = events.joins(:resource_allocations).where(:resource_allocations => {:resource_id => resource_id}) if resource_id.present?

    order_name = filter.order_name
    events = events.where('events.order_name = ?', order_name) if order_name.present?

    customer_name = filter.name

    events = events.where('booking_names.name like ?', "%#{customer_name}%") if customer_name.present?

    profile = filter.profile
    events = events.where("products.profile = '#{profile}'") if profile.present?

    if params[:report_id].present?
      report = current_account.reports.where(id: params[:report_id]).first
      @fields = report.fields if report.present?
    else
      @fields = [Report::BOOKING_ID, Report::EVENT_ORDER_ID, Report::START_FINISH, Report::CUSTOMER_CONTACTS, Report::PRODUCT_WITH_VARIANT, Report::QUANTITY, Report::NOTES]
    end

    total = events.map(&:quantity).reduce(:+).to_i #nil becomes 0

    @bookings, @total = events, total
  end

  def adjust_dates_if_order_name
    # check if an order name is specified - if so make sure date range is wide enough to include it
    order_name = params[:order_name]
    if order_name.present?
      maxmin = @account.bookings.where(:order_name => add_pound_sign_or_return_blank(order_name)).select('MAX(finish) AS `maximum`, MIN(start) AS `minimum`').first
      unless maxmin.minimum.nil?
        parms_start_date = date_from_ymd(params[:start], DateTime.now.beginning_of_day)
        parms_finish_date = date_from_ymd(params[:start], DateTime.now.end_of_day)
        params[:start] = date_to_ymd(maxmin.minimum) if parms_start_date > maxmin.minimum
        params[:finish] = date_to_ymd(maxmin.maximum) if parms_finish_date < maxmin.maximum
      end
    end
  end

  def load_resources
    @available_resources = current_account.resources.order(:name)
  end
end

class Enrollment
  include Virtus.model
  attribute :booking_id, Integer
  attribute :booking_item_id, Integer
  attribute :name, String
  attribute :email, String
  attribute :phone, String
  attribute :attended, Boolean
  attribute :payment_status, Integer
  attribute :class_name, String
end

class EnrollmentFilter
  include Virtus.model

  def initialize(shop, params)
    @shop = shop
    @start = DateTime.parse(params[:start])
    @product_id = params[:products]
  end

  def filter
    BookingName.where(booking_id: @shop.bookings.joins(:booking_items).where('booking_items.start = ? and booking_items.product_id in (?)', start, product_id)).order('booking_names.name ASC')
  end

  def start
    @start
  end

  def product_id
    @product_id
  end
end