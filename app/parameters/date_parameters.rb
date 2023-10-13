include BookThatAppUtils
#currently just used in Proxy Controller to format the date input
#based on if there is a "booking-param" or just "param (like start or finish)"
class DateParameters
  def initialize(shop, params)
    @shop = shop
    @params = params
    @df = @shop.select_date_format
  end
  def parse
    start = set_date "start", Time.now
    finish = set_date("finish", start + 1.months)
    return start, finish
  end

  def date_param(param)
    begin
      DateTime.strptime(param, @df)
    rescue ArgumentError
      Chronic.parse(param)
    end
  end

  def set_date(arg = "start", replacement_date)
    the_date = if @params.has_key?(arg)
                 date_param @params[arg]
               elsif @params.has_key?("booking-#{arg}")
                 date_param @params["booking-#{arg}"]
               end

    the_date ||  replacement_date
  end
end
