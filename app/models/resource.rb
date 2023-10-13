class Resource < ActiveRecord::Base
  belongs_to :shop
  belongs_to :user

  has_and_belongs_to_many :resource_groups

  # has_many :product_capacities, :dependent => :destroy
  # has_many :products, :through => :product_capacities

  has_many :resource_allocations, inverse_of: :resource, :dependent => :destroy # mapping to booking_items
  has_many :booking_items, through: :resource_allocations

  has_many :resource_constraints, inverse_of: :resource, :dependent => :destroy # mapping to products
  has_many :products, through: :resource_constraints

  # has_many :seasons, as: :hourable
  # has_many :opening_hours, :through => :seasons

  # attr_accessible :description, :name, :resource_type, :user_id, :user

  before_create :add_name_of_user

  TYPES_OF_RESOURCES = [["Staff", "Staff"], ["Equipment", "Equipment"], ["Room", "Room"]] #array of arrays of types.

  def add_name_of_user
    if self.user_id.present?
      self.name = self.user.name
    end
  end

  def available?(start, finish)
    !resource_allocations.joins(:booking_item).exists?(['finish > ? and start < ?', start, finish])
  end

  # def current_season
  #   today = Date.today
  #   seasons.current.first
  # end
  #
  # def self.all_schedules_between(start, finish, info_hash)
  #   #iterate over schedule and create start/end dates for each day between start, finish
  #   #pump that into an array at each 1/2 hour mark
  #   #send that array through get_occurence hash
  #   opening_hours_array = self.build_schedule(start, finish)
  #   opening_hours_array.flatten.map do |occurrence, index|
  #     #don't hardcode half an hour here
  #     self.get_occurrence_hash(occurrence, 1800, name, index, info_hash[:bookings], info_hash[:format])
  #   end
  # end
  #
  # def self.build_schedule(start, finish)
  #   duration = self.duration_in_seconds
  #   the_schedules = includes(:seasons).where('seasons.finish > ? and seasons.start < ?', start, finish)
  #   opening_hours_array = the_schedules.map do |res|
  #     res.opening_hours.active.order(:day_number)
  #   end
  #   opening_hours_array
  #   #build each week's schedule from Opening Hour type objects
  #   # Date.commercial(start.year, start.to_date.cweek, opening_hours_array.first[0].day_number + 1)
  #   # pass each OHour through datetime_squence
  #   #dates_array.map
  # end
  #
  # def self.duration_in_seconds
  #   1800 #half hour for now
  # end
  #
  # def self.get_occurrence_hash(occurrence, blah, name, index, bookings, format)
  #
  # end
  # def self.datetime_sequence(a_start, a_stop)
  #   dates = [a_start]
  #   step = self.duration_in_seconds
  #   while dates.last < (a_stop - step)
  #     dates << (dates.last + step)
  #   end
  #   return dates
  # end

  def to_liquid
    {
        'id' => id,
        'name' => name
    }
  end
end
