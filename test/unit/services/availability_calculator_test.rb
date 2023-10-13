require 'test_helper'

class AvailabilityCalculatorTest < ActiveSupport::TestCase
  setup do
    @shop = shops(:test)
    @start = Time.now.beginning_of_month
    @finish = Time.now.end_of_month + 2.days
    @product = products(:scheduled_daily_product)
    @blackout_product = products(:blackout_product)
  end

  def generate_calculator_results(prod = @product)
    calculator = if prod.is_a?(Array)
                   AvailabilityCalculator2.new(@shop, @start, @finish, prod)
                 else
                   AvailabilityCalculator2.new(@shop, @start, @finish, [prod.external_id])
                 end
    @products, @blackouts = calculator.calculate
  end

  test "the daily product has bookings" do
    generate_calculator_results #@calculator

    assert_not_nil(@products)
    bookings = @products.first[:bookings]
    assert_not_empty(bookings)
  end

  test "has a blackout" do
    @products, @blackouts = AvailabilityCalculator2.new(@shop, @start, @finish + 3.months, [@blackout_product]).calculate
    assert_not_empty(@blackouts, "Blackout empty")
  end

  test "raises an error on a new AvailabilityCalculator object" do
    calculator = AvailabilityCalculator2.new(@shop, @start, @finish, [])
    assert_raise RuntimeError do
      calculator.has_capacity?(1, 1)#some bogus number
    end
  end

  test "has_capacity? returns true" do
    booker = events(:tomorrow_for_one_off_date_product).product
    calculator = AvailabilityCalculator2.new(@shop, @start, @finish, [booker.id])
    m, u = calculator.calculate
    assert calculator.has_capacity?(booker.variants.first, 2)
  end

  test "variant based availability passes" do
    booker = products(:hook_product)
    calculator = AvailabilityCalculator2.new(@shop, @start, @finish, [booker.id])
    m, u = calculator.calculate
    assert calculator.has_capacity?(booker.variants.first, 2)
  end

  test "show schedules when appropriate" do
    generate_calculator_results
    assert_not_empty @products.first[:schedule] #products have schedules
  end

  test "weird edge case of using start that isn't time dot now or a range" do
    @start = Time.now + 4.minutes
    generate_calculator_results
    assert_not_empty @products.first[:schedule]
  end

  test "maps variants and populates in output too" do
    generate_calculator_results(products(:product1))
    assert_not_empty @products.first[:variants]
  end

  test "pass no product id and still pass" do
    calculator = AvailabilityCalculator2.new(@shop, @start, @finish + 3.months, [])
    products, blackouts = calculator.calculate
    assert_not_empty(blackouts, "Blackout empty")

  end

  test "has an empty available filter" do
    generate_calculator_results
    result = AvailableFilter2.new(@products, @blackouts).filter
    assert_empty(result)
  end

  test "the daily product filters results" do
    generate_calculator_results(@shop.products.map{ |p| p.id })
    result = AvailableFilter2.new(@products, @blackouts).filter
    assert_not_empty(result)
  end

  test "a product with bookings and a new person tries to add a reservation shows fully booked" do
    reservation_product = products(:product1) #(:reservation_one) making a booking product do the same
    generate_calculator_results(reservation_product) #@calculator

    assert_not_nil(@products)
    bookings = @products.first[:bookings]
    assert_not_empty(bookings)
  end
end
