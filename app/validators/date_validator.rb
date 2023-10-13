class DateValidator < ActiveModel::Validator
  def validate(record)
    the_end = record.dt_end
    the_start = record.dt_start
    if the_end.present?
      if the_end < the_start
        record.errors[:dt_end] << "The end date can't be before the start date. Pick a date after #{the_start}"
      end
    end
  end
end
