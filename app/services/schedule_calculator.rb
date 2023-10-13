class ScheduleCalculator
  def initialize(account, start, finish, product_ids)
    raise Exception.new("Nil account") if account.nil?
    raise Exception.new("Nil start date") if start.nil?
    raise Exception.new("Nil finish date") if finish.nil?
    raise Exception.new("Nil product_ids") if product_ids.nil?

    @account = account
    @product_ids = product_ids
    @start = start
    @finish = finish
  end

  def schedule
    []
  end
end
