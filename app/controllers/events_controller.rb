#Used to show calendar on /events page and to also unschedule
class EventsController < ApplicationController
  before_filter :ensure_not_blacklisted
  include SpecificRendering

  def index
    respond_to do |format|
      format.html do
        @latest_bookings = current_account.bookings.where('created_at < ?', (Time.now + 1.days).to_date).order('created_at desc').limit(5)
        @next_bookings = current_account.bookings.where('start >= ?', Time.now.to_date).order('start asc').limit(5)
        @products = current_account.products.order("product_title")
        @product_count = @products.count
        @booking_count = current_account.bookings.count
        @booking_count_by_month = booking_counts_for_last_months(12)
        @revenue = current_account.booking_items.select('sum(quantity*price) as booking_sum').first['booking_sum'] || 0
      end

      format.json do
        start = params[:start].present? ? DateTime.parse(params[:start]) : DateTime.now
        finish = params[:end].present? ? DateTime.parse(params[:end]) : DateTime.now + 1.month
        product_id = params[:product]
        find_bookings = params[:booking].blank? || params[:booking] == 'true' || (params[:booking] == 'false' && params[:blackout] == 'false')
        find_blackouts = params[:blackout].blank?|| params[:blackout] == 'true' || (params[:booking] == 'false' && params[:blackout] == 'false')
        find_available = true

            bookings = []
        if find_bookings
          bookings = booking_items(start, finish, product_id)
        end

        blackouts = []
        if find_blackouts
          blackouts = blackouts(start, finish, product_id)
        end

        available = []
        if find_available
          available = available(start, finish, product_id)
        end

        result = []
        (bookings + blackouts + available).uniq.each do |event|
          result << event.to_calendar_hash
        end

        @results = result

        render :json => {:events => @results}, :callback => params[:callback]
      end
    end
  end

  def booking_items(start, finish, product_id)
    items = current_account.booking_items.joins(:booking).where('(? <= booking_items.finish) AND (booking_items.start <= ?)', start, finish)
    items = items.where(:booking_items => {:product_id => product_id}) unless product_id.blank?
    items
  end

  def blackouts(start, finish, product_id)
    # EventDate based
    edbo = current_account.blackouts.where('(? <= finish) AND (start <= ?)', start, finish)
    edbo = edbo.where(:product_id => [product_id, nil]) if product_id.present?

    # Event based
    ebo = Event.where(:shop_id => current_account.id, :type => "OldBlackout").where('(? <= finish) AND (start <= ?)', start, finish)
    ebo = ebo.where(:product_id => [product_id, nil]) if product_id.present?

    edbo.all + ebo.all
  end

  def available(start, finish, product_ids)
    # current_account.seasons
    []
  end

  def resources
    respond_to do |format|
      format.json do
        items = current_account.booking_items.
            joins('LEFT JOIN locations ON locations.id = booking_items.location_id').
            joins(:product).
            select('booking_items.*, product_title, locations.name as location_name').
            order('location_name asc').group_by{ |item| item.location_id }
        blackout_items = current_account.blackouts.joins(:product).
            select('event_dates.*, product_title, "" as location_name')

        resources = []
        if items[nil].present?
          items[nil] += blackout_items
        else
          items[nil] = blackout_items
        end

        items.each_pair do |location_id, location_items|
          location_items.each do |b|
            if params[:product_id].blank? || (params[:product_id].present? && params[:product_id] == b.product_id.to_s)
              resources.push({ id: b.calendar_resource_id,
                               title: b.product_title,
                               location: b['location_name'].to_s })
            end
          end
        end

        if params[:product_id].present? && resources.blank?
          product = Product.where(id: params[:product_id]).first
          resources.push({ id: product.calendar_resource_id,
                           title: product.product_title,
                           location: '' }) if product.present?
        end

        render :json => { :resources => resources.uniq }
      end
    end
  end

  private

  def booking_counts_for_last_months(months)
    cnts = current_account.bookings.count_by_month((Time.now-5.months).beginning_of_month)

    booking_counts = {}
    (0...months).each do |num|
      beginning_of_month = (Time.now-num.months).beginning_of_month.strftime('%Y-%m-%d')
      count_for_month = cnts.find{ |c| c['beginning_of_month'] == beginning_of_month}
      booking_counts[beginning_of_month] = (count_for_month) ? count_for_month['cnt'] : 0
    end

    booking_counts
  end
end

# class Available
#
# end
