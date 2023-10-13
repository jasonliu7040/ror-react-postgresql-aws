class ScheduleItem < ActiveRecord::Base
  belongs_to :variant
  belongs_to :schedule

  scope :for_products, lambda { |product_ids| joins(:schedule).where("schedules.schedulable_id IN (?) AND schedules.schedulable_type = 'Product'", product_ids) }
end
