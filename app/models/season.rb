# A Season was used due to the use of IceCube and product schedules everywhere. Path of least resistance
# So think of a Season as a Resource's Base Schedule. It's what (in an ideal world) you WANT them to work.
# Since people's lives get in the way, we created ScheduleAdjustment that will allow the ShopOwner to
# adjust the Season for days where they won't work their usual shifts.
class Season < ActiveRecord::Base
  belongs_to :hourable, polymorphic: true
  has_many :opening_hours
  # attr_accessible :finish, :hourable_id, :hourable_type, :id_of_season, :name, :start
  accepts_nested_attributes_for :opening_hours
  scope :current, -> {where('finish > :today and start < :today', :today => Date.today).limit(1)}
  scope :between, lambda {|a_start, a_finish| where('finish > ? and start < ?', a_start, a_finish)}
end
