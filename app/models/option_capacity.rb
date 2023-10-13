class OptionCapacity < ActiveRecord::Base
  belongs_to :product, :touch => true
  validates_presence_of :capacity
  validates_numericality_of :capacity, :only_integer => true, :greater_than_or_equal_to => 0

  after_commit :sync_variant_metafields, :if => :persisted?

  # TODO: delete this method after booking_item
  def matches?(variant)
    #logger.info "'#{product.product_handle}': option1 is nil" if option1.nil?

    result = variant.nil? ? false : true
    #rollbar 242
    result = result && option1.include?(variant.option1) unless option1.nil? || product.capacity_option1.nil? || variant.option1.nil?
    result = result && option2.include?(variant.option2) unless option2.nil? || product.capacity_option2.nil? || variant.option2.nil?
    result = result && option3.include?(variant.option3) unless option3.nil? || product.capacity_option3.nil? || variant.option3.nil?

    #logger.info "Match result: #{result}"

    result
  end

  def sync_variant_metafields
    product.variants.all.each do |variant|
      variant.resync_metafields if matches?(variant)
    end
  end
end
