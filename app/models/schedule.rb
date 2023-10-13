class Schedule < ActiveRecord::Base
  # attr_accessible :title, :body
  belongs_to :schedulable, polymorphic: true

  has_many :schedule_items, :dependent => :destroy
  accepts_nested_attributes_for :schedule_items, :allow_destroy => true

  has_many :oneoff_items, :dependent => :destroy, class_name: 'OneoffSchedule'
  accepts_nested_attributes_for :oneoff_items, :reject_if => :all_blank, :allow_destroy => true

  has_many :recurring_items, :dependent => :destroy, class_name: 'RecurringSchedule'
  accepts_nested_attributes_for :recurring_items, :reject_if => :all_blank, :allow_destroy => true

  def occurrences_between(start, finish)
    result = []

    unless $flipper[:new_ui].enabled?(self.schedulable.shop)
      oneoff_items.each do |schedule|
        result += schedule.occurrences(start, finish)
      end
    end


    if $flipper[:new_ui].enabled?(self.schedulable.shop)
      recurring_items.each do |schedule|
        result += schedule.occurrences(start, finish)
      end
    else
      item = recurring_items.first
      if item.present?
        result += item.occurrences(start, finish)
      end
    end


    result
  end

  def occurrences_between_for_variant(start, finish, variant, duration)
    occurrences = Set.new

    self.class.trace_execution_scoped(['Schedule#occurrences_between_for_variant - oneoff dates']) do # new_relic trace
      unless $flipper[:new_ui].enabled?(self.schedulable.shop)
        oneoff_items.where(:start => start..finish).each do |item|
          occurrences += item.occurrences(start, finish, variant, duration)
        end
      end
    end

    self.class.trace_execution_scoped(['Schedule#occurrences_between_for_variant- recurring occurrences']) do # new_relic trace
      if $flipper[:new_ui].enabled?(self.schedulable.shop)
        recurring_items.each do |item|
          occurrences += item.occurrences(start, finish)
        end
      else
        item = recurring_items.first
        if item.present?
          occurrences += item.occurrences(start, finish)
        end
      end

    end

    occurrences.sort {|a, b| a[:start] <=> b[:start]}
  end
end
