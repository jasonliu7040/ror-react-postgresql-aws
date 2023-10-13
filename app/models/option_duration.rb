class OptionDuration < ActiveRecord::Base
  acts_as_paranoid
  belongs_to :product
  after_save do
    product.resync_metafields
  end
end
