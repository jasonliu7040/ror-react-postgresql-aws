class User < ActiveRecord::Base
  # Include default devise modules. Others available are:
  # :confirmable #, :lockable, :timeoutable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :trackable, :validatable

  # Setup accessible (or protected) attributes for your model
#  # attr_accessible :email, :password, :password_confirmation, :remember_me
#  attr_accessible :title, :name, :shop_id, :role_id
  belongs_to :shop
  has_many :resources
  has_many :roles
  has_many :seasons, as: :hourable

  ROLES = {:admin => 0, :staff => 1}

  def is_admin?
    ROLES[:admin] == role_id
  end
end
