include BookThatAppUtils

# Used to sanitize the Reports Parameters
class ReportsParameters
  def initialize(params)
    @start = date_from_ymd(params[:start], DateTime.now.beginning_of_day)
    @finish = date_from_ymd(params[:finish], (@start + 1.month).end_of_day)
    @parms = params
    @product_id = product_id
    @report_id = report_id
  end

  def order_by
    @parms[:order_by] || 'start'
  end

  def order_type
    @parms[:order_type] || 'ASC'
  end

  def order_name
    name = @parms[:order_name] || ''
    add_pound_sign_or_return_blank(name)
  end

  def start
    @start.to_date
  end

  def finish
    @finish.to_date
  end

  def date_range()
    result = {}

    start_time = DateTime.new(@start.year, @start.month, @start.day, 0, 0, 0)
    finish_time = DateTime.new(@finish.year, @finish.month, @finish.day, 23, 59, 59)

    if (date_type == 'finish')
      result[:finish] = start_time..finish_time
    else
      result[:start] = start_time..finish_time
    end

    result
  end

  def report_id
    @parms[:report_id] || ''
  end

  def date_type
    @parms[:date_type] || 'start'
  end

  def profile
    @parms[:profile] || ''
  end

  def product_id
    @parms[:products] || ''
  end

  def variant_id
    @parms[:variants] || ''
  end

  def resource_id
    @parms[:resources] || ''
  end

  def name
    @parms[:name] || ''
  end

  def ordering
    case order_by
      when 'products.product_title'
        "#{order_by} #{order_type}"
      when 'name'
        "booking_names.#{order_by} #{order_type}"
      when 'order_name'
        "e1.#{order_by} #{order_type}"
      else
        "booking_items.#{order_by} #{order_type}"
    end
  end

  def generate_filename(prefix)
    "#{prefix}-#{@start.strftime('%F')}_#{@finish.strftime('%F')}#{'_' + order_name unless order_name.blank?}"
  end
end
