class CreateScheduleForProducts < ActiveRecord::Migration
  def up
    Product.where(scheduled: true).each do |product|
      schedule = product.build_schedule
      product.oneoff_schedules.each do |oneoff|
        schedule.schedule_items << oneoff
      end
      if product.schedule_yaml.present?
        schedule.schedule_items << RecurringSchedule.new(schedule_yaml: product.schedule_yaml)
      end
      product.save
    end
  end

  def down
  end
end
