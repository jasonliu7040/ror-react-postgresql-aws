class EmailEvent < ActiveRecord::Base
  belongs_to :shop, inverse_of: :email_events
  belongs_to :booking, inverse_of: :email_events
end
