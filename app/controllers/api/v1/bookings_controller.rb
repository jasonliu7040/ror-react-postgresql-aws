class Api::V1::BookingsController < Api::V1::BaseController
  def show
    booking = @account.bookings.find(params[:id])
    render(json: Api::V1::BookingSerializer.new(booking).to_json)
  end

  def index
    # bookings = apply_filters(@account.bookings.all, params)
    bookings = @account.bookings.all

    render(
        json: ActiveModel::ArraySerializer.new(
            bookings,
            each_serializer: Api::V1::BookingSerializer,
            root: 'bookings'
        )
    )
  end
end