class OpeningHour < ActiveRecord::Base
  belongs_to :season
  # attr_accessible :day_number, :from, :season_id, :to

  scope :active, -> { where('opening_hours.start != ?', nil)}

  def get_occurrence_hash(duration, the_product_handle, index, booking_array, format)
    blank_duration = duration.blank?
    # do i have to iterate each date here?
    start_time = blank_duration ? start.midnight : start
    end_time = blank_duration ? occurrence.end_of_day : start.advance(:seconds => duration)
    muck = {:start_time => start_time, :end_time => end_time, :url => "/products/#{the_product_handle}?start=#{start_time.to_i * 1000}&end=#{end_time.to_i * 1000}", :duration => duration, :format => format}
    handle_date(muck, index, booking_array)
  end
end
