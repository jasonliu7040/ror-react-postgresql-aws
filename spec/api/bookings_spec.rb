require 'rails_helper'

describe Api::V1::BookingsController, type: :api do
  context :index do
    before do
      5.times{ FactoryGirl.create(:booking) }
    end

    it 'retrieves bookings' do
      get api_v1_bookings_path, format: :json
      expect(last_response.status).to be(200)

      # it_returns_resources(root: 'bookings', number: 5)
    end
  end
end