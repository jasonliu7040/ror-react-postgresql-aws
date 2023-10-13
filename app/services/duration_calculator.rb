class DurationCalculator
  def initialize(product)
    @product = product
    @option_durations = product.option_durations
    @duration_v2 = $flipper[:duration_v2].enabled?(product.shop)
  end

  #
  # returns duration (in seconds) based on variant options (duration v2) or duration variant value
  #
  def duration(variant)
    duration = 3600 # default 1 hour

    if @duration_v2
      if @product.duration_type == 0 # product based duration
        duration = @product.duration
      else # variant option based duration
        # find option duration that matches the values for this variant
        # TODO - should match on option external id, not the value, since the value can be changed
        od = @option_durations.first{|od| od.value == variant.option1 || od.value == variant.option2 || od.value == variant.option3 }
        duration = od.duration if od
      end
    else
      # previously duration + units was stored on each variant

      duration = variant.duration # default is minutes

      case variant.duration_units
        when 1 # hours
          duration = duration * 60
        when 2 # days
          duration = duration * 24 * 60
        when 3 # weeks
          duration = duration * 7 * 24 * 60
        when 4 # months
          duration = duration * 4.2 * 7 * 24 * 60
      end

      duration = duration * 60  # multiply by 60 to convert to secs
    end

    duration
  end

  def duration_minutes(variant)
    duration(variant)/60
  end
end