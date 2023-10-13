class Location < ActiveRecord::Base
  belongs_to :shop

  has_many :product_locations, dependent: :destroy
  has_many :products, through: :product_locations

  has_many :booking_items
  has_many :bookings, through: :booking_items

  geocoded_by :address
  after_validation :geocode, :if => :address_changed?

  def to_liquid
    {
        'id' => id,
        'name' => name,
        'email' => email,
        'address' => address,
        'latitude' => latitude,
        'longitude' => longitude,
        'map_image' => "http://maps.google.com/maps/api/staticmap?size=450x300&sensor=false&zoom=16&markers=#{latitude}%2C#{longitude}",
        'map' => "http://maps.google.com/?q=#{Rack::Utils.escape(address.squish)}"
    }
  end
end
