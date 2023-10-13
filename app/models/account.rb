class Account < ActiveRecord::Base
  belongs_to :user
  has_one :billing
  has_many :roles
#  # attr_accessible :email, :name

  #role helper methods due to delegate not working
  def owners
    roles.owners
  end

  def staff
    roles.staff
  end

  def admins
    roles.admins
  end
end
