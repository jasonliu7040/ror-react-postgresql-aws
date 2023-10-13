class ResourceGroup < ActiveRecord::Base
  belongs_to :shop

  has_and_belongs_to_many :resources

  # has_many :seasons, as: :hourable

  # attr_accessible :description, :name

#  after_create :shovel_resource

  def shovel_resource
    self << self.resource
  end
end
