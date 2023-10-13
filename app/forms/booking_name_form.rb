class BookingNameForm < BaseForm
  attribute :firstname
  attribute :lastname
  attribute :email
  attribute :phone

  validates :firstname, :lastname, :email, presence: true

  def name
    "#{firstname} #{lastname}"
  end

  def build_hash
    atts = attributes
    atts.delete(:shop)
    atts.delete(:phone)
    atts.delete(:firstname)
    atts.delete(:lastname)

    the_keys = atts.stringify_keys
    the_keys["name"] = name

    the_keys
  end
end
