require 'set'

# Used to show the availability of products and variants in the Shops and carts.
class AvailabilityController < ApplicationController
  include BookThatAppUtils

  respond_to :json
  before_filter :account_required, :cors_preflight_check
  after_filter :cors_set_access_control_headers
  skip_before_filter :verify_authenticity_token

  # http://legros-parker-and-harris6290.bookthatapp.dev:3005/availability?start=2011-09-30&end=2011-12-13&products=27763492,27763452
  # http://legros-parker-and-harris6290.bookthatapp.dev:3002/availability.json?callback=jQuery17107292171649169177_1352676359342&format=json&start=2012-12-01&_=1352676666566&products=27763442
  # http://legros-parker-and-harris6290.bookthatapp.dev:3005/availability?callback=jQuery17107292171649169177_1352676359342&format=json&start=2012-12-01&_=1352676666566&products=27763442
  # http://legros-parker-and-harris6290.bookthatapp.dev:3002/availability.html?start=2012-12-01&end=2013-12-13&products=27763442&_=1
  def index
    @start = date_from_ymd(params[:start])
    unless @start.present?
      render :text => 'Required parameter missing: start. Ensure it is a proper date and is not empty', :status => 400, :callback => params[:callback]
      return
    end

    default_finish = @start.advance(:months => 2)
    if params[:finish].present?
      finish = date_from_ymd(params[:finish], default_finish)
    else
      finish = date_from_ymd(params[:end], default_finish) # 'end' parameter is deprecated (use 'finish' now)
    end

    # check date range isn't too wide
    days = (finish - @start).to_i
    if days > 180
      Rails.logger.warn 'Date range greater than 180 days'
      # render :text => 'Date range can not be greater than 180 days', :status => 400, :callback => params[:callback]
      # return
    end

    product_ids = product_params()

    if @account.subdomain == 'the-pms-package'
      products = Product.includes([:variants]).all(:conditions => {:shop_id => @account.id, :id => @product_ids}).map do |product|
        {
            :id => product.external_id,
            :handle => product.product_handle,
            :title => product.product_title,
            :capacity => product.capacity,
            :capacity_type => product.capacity_type,
            :variant_capacities => [],
            :option_capacities => [],
            :variants => [],
            :scheduled => product.scheduled,
            :schedule => [],
            :bookings => [],
            :lag => product.lag_time,
            :resources => []
        }
      end

      @json_response = {:products => products, :blackouts => [], :allocation => []}
    else
      products, blackouts, resources = @account.lookup_availability(@start, finish, product_ids)
      @json_response = {:products => products, :blackouts => blackouts, :allocation => resources}
    end

    respond_to do |format|
      format.json do
        render :json => @json_response, :callback => params[:callback]
      end
      format.html do
        format.html
      end
    end
  end

  # http://legros-parker-and-harris6290.bookthatapp.dev:3005/availability/capacity?variants=%5B%7B%22variant%22%3A%2221169262%22%2C%22start%22%3A%2202%2F27%2F2012%22%2C%22finish%22%3A%2202%2F28%2F2012%22%7D%5D
  def capacity
    logger.info "Checking capacity for #{@account.subdomain}"

    result = []
    if params.has_key?(:variants)
      ActiveSupport::JSON.decode(params[:variants]).each do |c|
        id = c["variant"].to_i
        variant = Variant.find_by_external_id(id)
        if variant
          begin
            start = c["start"].to_time
            finish = c["finish"].blank? ? variant.advance_default_duration(start) : c["finish"].to_time
            calculator = AvailabilityCalculator2.new(@account, start, finish, [variant.product.id])
            products, blackouts = calculator.calculate()
            bookings = variant.booking_count(start, finish)

            logger.info "==> Capacity #{variant.capacity}/Bookings: #{bookings}"

            result << {
                :id => variant.external_id,
                :capacity => variant.capacity,
                :booking_count => bookings,
                :blacked_out => blackouts,
                :start => datetime_array(start),
                :finish => datetime_array(finish)
            }
          rescue ArgumentError => e
            logger.warn "Dodgy argument: #{e.message}"
            result << {
                :id => variant.external_id,
                :capacity => 0,
                :booking_count => 0
            }
          end
        else
          logger.info "Variant #{id} not found"
        end
      end

      respond_to do |format|
        format.json do
          render :json => {:variants => result}, :callback => params[:callback], :content_type => "text/javascript"
        end
      end
    else
      render :text => "Required parameters missing: 'variants'", :status => 403
    end
  end

  #http://legros-parker-and-harris6290.bookthatapp.dev:3005/availability/schedule.json?callback=jQuery172033240348286926746_1351538480134&start=2012-10-28T00%3A00%3A00&end=2012-12-09T00%3A00%3A00&_=1351538546455&handle=slurpee-machine-double
  #http://legros-parker-and-harris6290.bookthatapp.dev:3002/availability/schedule.json?callback=jQuery17201891189778689295_1361057220009&start=2013-01-27T00%3A00%3A00&end=2013-03-10T00%3A00%3A00&handle=black-organza-storage-bag&variant=233592770
  # the store front calendar and event table widget use this endpoint
  def schedule
    product_ids = product_params()

    scheduler = CalendarScheduler.new(@account, params, product_ids)

    begin
      respond_to do |format|
        format.json {render scheduler.in_json_format}
        format.ics {@calendar_output = scheduler.in_ics_format}
        format.html {@schedule, @blackouts = scheduler.in_html_format}
      end
    rescue ActionController::UnknownFormat
      Rails.logger.info "treating unknown format request as json (referer: '#{request.env['HTTP_REFERER']}')"
      render json: scheduler.in_json_format[:json]
    end
  end

  def preview
    results = []

    begin
      # timezone is GMT
      start = Time.zone.parse(params[:start])
      finish = Time.zone.parse(params[:end])
      title = params[:title]
      yaml = params[:schedule]
      duration = params[:duration].to_i

      index = 0
      params[:dates].split(',').map{|t| Time.parse(t)}.each do |d|
        index += 1

        result = CalendarItemPresenter.new.item_json( index, datetime_array(d), datetime_array(d + duration), title )

        #result.delete('end') if all_day

        results << result
      end

      ice_schedule = nil
      if yaml.present?
        ice_schedule = IceCube::Schedule.from_yaml(yaml)
        all_day = ice_schedule.duration.nil?
        ice_schedule.occurrences_between(start, finish).each do |occurrence| # occurrence is a Time instance (UTC)
          index += 1

          start_time = all_day ? occurrence.midnight : occurrence
          end_time = all_day ? occurrence.end_of_day : occurrence + ice_schedule.duration

          result = CalendarItemPresenter.new.item_json( "1-#{index}", datetime_array(start_time), datetime_array(end_time), title, all_day )

          results << result
        end unless ice_schedule.recurrence_rules.empty?

      end

      summary = ice_schedule.to_s
    rescue Exception => e
      summary = "Preview not available (error: #{e.message})"
      logger.error "Error parsing schedule yaml: #{e.message}"
      logger.error "Broken YAML: #{params[:schedule]}"
    end

    respond_to do |format|
      #format.html do
      #  render :json => {:summary => summary, :schedule => results}, :callback => params[:callback]
      #end
      format.json do
        render :json => {:summary => summary, :schedule => results}
      end
    end
  end

protected

  def product_params
    product_ids = Set.new

    if params[:variant] && !params[:variant].blank?
      v = Variant.find_by_external_id(params[:variant])
      product_ids << v.product.external_id if v
    end

    if params[:handle] && !params[:handle].blank?
      #same as 172ish in the if path clause
      p = @account.products.find_by_product_handle(params[:handle])
      product_ids << p.external_id if p
    end

    if params[:products].present?
      product_ids << params[:products].split(',')
    end

    if product_ids.empty?
      # no params specified - are we on the product page?
      if request.referrer
        url = URI.parse(request.referrer)
        path = url.path
        if path =~ /\/products\// # use handle
          handle = path.split('/').last
          p = Product.find_by_shop_id_and_product_handle(@account.id, handle)
          product_ids << p.external_id if p
        else
          # nothing specified - default to all products
          product_ids = @account.products.where(:hidden => false).pluck(:external_id)
        end
      end
    end

    ::NewRelic::Agent.add_custom_attributes(:products => product_ids)

    product_ids.to_a
  end

  def cors_set_access_control_headers
    headers['Access-Control-Allow-Origin'] = '*'
    headers['Access-Control-Allow-Methods'] = 'POST, GET, OPTIONS'
    headers["Access-Control-Allow-Headers"] = "Content-type, X-Requested-With, X-Prototype-Version"
  end

  def cors_preflight_check
    if request.method == :options
      headers['Access-Control-Allow-Origin'] = '*'
      headers['Access-Control-Allow-Methods'] = 'POST, GET, OPTIONS'
      headers['Access-Control-Allow-Headers'] = 'X-Requested-With, X-Prototype-Version'
      render :text => '', :content_type => 'text/plain'
    end
  end
end
