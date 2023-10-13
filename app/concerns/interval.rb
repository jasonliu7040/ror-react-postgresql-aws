module Interval
  extend ActiveSupport::Concern

  included do
    validates_presence_of :start, :finish

    # Return a scope for all interval overlapping the given interval, including the given interval itself
    if Rails.env.production?
      scope :overlapping, lambda {|start_date, finish_date| {
          :conditions => ['(TIMEDIFF(start, ?) * TIMEDIFF(?, finish)) >= 0', finish_date, start_date]
      } }
    else
      scope :overlapping, lambda {|start_date, finish_date| {
          :conditions => ['finish > ? and start < ?', start_date, finish_date]
      } }
    end
  end

  # Check if a date range overlaps this interval
  def overlaps?(start_date, finish_date)
    (start - finish_date) * (start_date - finish) >= 0
  end
end
