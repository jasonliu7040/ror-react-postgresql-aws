class BaseForm
  include Virtus.model
  include ActiveModel::Validations

  attribute :shop, Shop

  def shop=(value)
    value.is_a?(Shop) ? super : super(Shop.find_by_subdomain(value))
  end

  def to_liquid
    test = {}
    test['start'] = 'blah blah'

    result = attributes.clone()
    result.delete(:shop)
    result['errors'] = errors if errors.any?
    #binding.pry
    result['errors_messages'] = errors.messages.stringify_keys if errors.any?
    result['items'] = result[:items][0].build_hash if result[:items].present?
    result["customers"] = result[:customers][0].build_hash if result[:customers].present?
    #puts result
    result.stringify_keys
  end
end
