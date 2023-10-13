class TestsController < ApplicationController
  layout 'test'

  def index
  end

  def availability
    @products = Product.includes([:location, :option_durations]).all
  end

  def availability2
    @products = Product.all
  end

  def missing_day
  end

  def scheduled_times
    @products = Product.all
  end

  def opening_hours
    @products = Product.where(:profile => 'appt')
  end

  def highlight_duration
    @products = Product.includes(:location).where(:profile => 'product')
  end

  def recurring_select
    session[:return_to] = '/tests/recurring_select'
    @product = Product.first
    if @product.recurrences.empty?
      @product.recurrences.build({})
    end
    respond_to do |format|
      format.html {render :layout => 'application'}
    end
  end

  def calendar
    @template = @account.template('calendar')
    assigns  = @account.products.produce_hash(@account, params)
    @content = @template.render(assigns)
  end

  def upcoming_events
    @products = Product.all
  end

  def time_range
    @products = Product.all
  end

  def order_status_page
  end
end


