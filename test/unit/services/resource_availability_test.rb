require 'test_helper'

class ResourceAvailabilityCalculatorTest < ActiveSupport::TestCase
  setup do
    @account = shops(:test)
    @start = Time.now.beginning_of_month
    @finish = Time.now.end_of_month + 2.days
    @product = products(:resource_one)
    @blackout_product = products(:blackout_product)
  end

  def generate_calculator_results(prod = @product)
    calculator = if prod.is_a?(Array)
                   AvailabilityCalculator2.new(@account, @start, @finish, prod)
                 else
                   AvailabilityCalculator2.new(@account, @start, @finish, [prod.external_id])
                 end
    @products, @blackouts = calculator.calculate
  end

  test "the resource product has availability" do
    generate_calculator_results #@calculator

    assert_not_nil(@products)

    # bookings = @products.first[:bookings]
    # assert_not_empty(bookings)
  end

  # test "has a blackout" do
  #   @products, @blackouts = AvailabilityCalculator.new(@account, @start, @finish + 3.months, [@blackout_product]).calculate
  #   assert_not_empty(@blackouts, "Blackout empty")
  # end

  # test "raises an error on a new AvailabilityCalculator object" do
  #   calculator = AvailabilityCalculator.new(@account, @start, @finish, [])
  #   assert_raise RuntimeError do
  #     calculator.has_capacity?(1, 1)#some bogus number
  #   end
  # end

  # test "has_capacity? returns true" do
  #   booker = events(:tomorrow_for_one_off_date_product).product
  #   calculator = AvailabilityCalculator.new(@account, @start, @finish, [booker.id])
  #   m, u = calculator.calculate
  #   assert calculator.has_capacity?(booker.variants.first, 2)
  # end

  # test "has_capacity? returns false" do
  #   booker = event_dates(:three)
  #   calculator = AvailabilityCalculator.new(@account, @start, @finish, [booker.product.id])
  #   m, u = calculator.calculate
  #   refute calculator.has_capacity?(booker.product.variants.first, 2), 'Should not have capacity'
  # end

  # test "variant based availability passes" do
  #   booker = products(:hook_product)
  #   calculator = AvailabilityCalculator.new(@account, @start, @finish, [booker.id])
  #   m, u = calculator.calculate
  #   assert calculator.has_capacity?(booker.variants.first, 2)
  # end

  # test "show schedules when appropriate" do
  #   generate_calculator_results
  #   assert_not_empty @products.first[:schedule] #products have schedules
  # end

  # test "weird edge case of using start that isn't time dot now or a range" do
  #   @start = Time.now + 4.minutes
  #   generate_calculator_results
  #   assert_not_empty @products.first[:schedule]
  # end

  # test "map_capacities populates" do
  #   generate_calculator_results(products(:hook_product))
  #   assert_not_empty @products.first[:variant_capacities]
  # end

  # test "maps variants and populates in output too" do
  #   generate_calculator_results(products(:product1))
  #   assert_not_empty @products.first[:variants]
  # end

  # test "pass no product id and still pass" do
  #   calculator = AvailabilityCalculator.new(@account, @start, @finish + 3.months, [])
  #   products, blackouts = calculator.calculate
  #   assert_not_empty(blackouts, "Blackout empty")

  # end

  # test "has an empty available filter" do
  #   generate_calculator_results
  #   result = AvailableFilter.new(@products, @blackouts).filter
  #   assert_empty(result)
  # end

  # test "the daily product filters results" do
  #   generate_calculator_results(@account.products.map{ |p| p.id })
  #   result = AvailableFilter.new(@products, @blackouts).filter
  #   assert_not_empty(result)
  # end

  # test "a product with bookings and a new person tries to add a reservation shows fully booked" do
  #   reservation_product = products(:product1) #(:reservation_one) making a booking product do the same
  #   generate_calculator_results(reservation_product) #@calculator

  #   assert_not_nil(@products)
  #   bookings = @products.first[:bookings]
  #   assert_not_empty(bookings)
  # end

  # test "send a product with a date spanning Reservations, waitlists, orders and Bookings. all should appear but waitlist" do
  #   skip "Add this test back when we start on Reservation and bookings with no items has been figured out"
  #   # prod = products(:has_all_four_types)
  #   # gen = AvailabilityCalculator.new(@account, @start, @finish + 2.month, [prod.external_id])
  #   # produ, black = gen.calculate
  #   # assert_equal 3, produ[0][:bookings].count
  # end

  # test "a product with capacity_type 3 (resources) shows a guy is available when he should be" do
  #   product = products(:resource_one)
  #   generate_calculator_results(product)
  #   assert_not_nil(@products)
  #   bookings = @products.first[:bookings]
  #   assert_empty(bookings)
  # end
end
