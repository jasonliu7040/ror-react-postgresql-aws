class Term < ActiveRecord::Base
  belongs_to :product

  has_one :schedule, as: :schedulable, :dependent => :destroy
  accepts_nested_attributes_for :schedule, :reject_if => :all_blank, :allow_destroy => true

  has_many :schedule_items, through: :schedule
  accepts_nested_attributes_for :schedule_items, :reject_if => :all_blank, :allow_destroy => true

  delegate :shop, to: :product

  after_initialize :default_values

  validates :start_date, :finish_date, presence: true
  validate :start_date_cannot_be_greater_than_finish_date

  def occurrences(start = nil, finish = nil)
    start ||= self.start_date
    finish ||= self.finish_date
    # self.schedule.occurrences_between(start, finish)
    []
  end


  private

  def default_values
    self.start_date ||= Time.now.midnight
  end

  def start_date_cannot_be_greater_than_finish_date
    return if [self.start_date, self.finish_date].any?{ |a| a.blank? }
    if start_date > finish_date
      errors.add(:start_date, "can't be greater than finish date")
    end
  end
end
