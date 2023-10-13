class Api::V1::AvailabilitySerializer < Api::V1::BaseSerializer
  attributes :variant_id, :available, :code, :message
end