class Event < ActiveRecord::Base
  include BookThatAppUtils

  belongs_to :shop
  belongs_to :product
  belongs_to :variant

  has_many :event_dates
  has_many :items

  before_validation :default_finish_date

  before_save :swap_dates, :if => Proc.new { |event| event.start > event.finish if event.start.present? && event.finish.present? }
  before_save :adjust_all_day, :if => Proc.new { |event| event.all_day_booking? if event.start.present? }
  before_save :populate_external_ids

  #just make sure you pass it scoped to shop
  scope :old_blackouts, lambda {|start, finish| where(:type => "OldBlackout").where('events.finish > ? and events.start < ?', start, finish)}

  def duration_in_seconds
    (self.start - self.finish).round
  end

  def reschedule(start_date)
    duration = duration_in_seconds
    self.start = start_date
    self.finish = start_date + duration
  end

  def adjust_all_day
    self.start = self.start.to_datetime.beginning_of_day
    self.finish = self.finish.to_datetime.end_of_day
  end

  def swap_dates
    self.start, self.finish = self.finish, self.start
  end

  def default_finish_date
    if self.finish.nil?
      self.finish = self.start + 1.day if self.start
    end
  end

  def populate_external_ids
    self.external_product_id = self.product.external_id if self.product && self.external_product_id.nil?
    self.external_variant_id = self.variant.external_id if self.variant && self.external_variant_id.nil?
  end

  def all_day_booking?
    self.all_day == 1
  end

  def overlaps?(s, f)
    (start - Time.parse(f.to_s)) * (Time.parse(s.to_s) - finish) >= 0
  end
end
