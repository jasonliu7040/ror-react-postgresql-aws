class ConvertOneoffSchedulesToRecurringSchedules < ActiveRecord::Migration
  def change
    @logger = Logger.new('log/schedule_converting')
    OneoffSchedule.all.each do |item|
      schedule = IceCube::Schedule.new(item.start) do |s|
        s.add_recurrence_rule(IceCube::Rule.daily.count(1))
      end
      recurring_item = RecurringSchedule.new(
          schedule_id: item.schedule_id,
          product_id: item.product_id,
          duration: item.duration,
          variant_id: item.variant_id,
          schedule_yaml: schedule.to_yaml)
      if recurring_item.save
        @logger.info('RecurringScheduleID'){ recurring_item.id }
      else
        @logger.info('FAILED'){ item.id }
      end
    end
  end

end
