class Role < ActiveRecord::Base
  belongs_to :account
  belongs_to :user
  # attr_accessible :ranking
  ROLE_TYPES = {:owner => 0, :admin => 1, :staff => 2}

  scope :owners, -> {where(ranking: ROLE_TYPES[:owner])}
  scope :staff, -> {where(ranking: ROLE_TYPES[:staff])}
  scope :admins, -> {where(ranking: ROLE_TYPES[:admin])}
end
