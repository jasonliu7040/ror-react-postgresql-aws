class IsAvailableValidator < ActiveModel::Validator
  def validate(record)
    if record.event.is_a?(Waitlist)
      true
    else
      #here because new records get it after.
      unless record.product.blank?
        record.external_product_id = record.product.external_id    if record.external_product_id.blank?
        record.external_variant_id = record.variant.external_id    if record.external_variant_id.blank?
        avail = AvailabilityCalculator2.new(record.shop, record.start, record.finish, [record.external_product_id])
        muck, something = avail.calculate

        real_quantity =
          if record.new_record?
            record.quantity
          else
            if record.changes["quantity"].present?
              record.changes["quantity"][1] - record.changes["quantity"][0]
            else
              record.quantity - record.quantity
            end
          end
        unless avail.has_capacity?(record.variant, real_quantity) #should this be what errors?
          #here is where we would put whether to waitlist
          if record.shop.allow_waitlist == true
            #send them back a note to waitlist not reserve...
            record.event.update_attribute(:type, "Waitlist")
          else
            record.errors[:availability] << "Current Quantity would put this Item over capacity"
          end
        end
      else
        record.errors[:product] << "Is not a valid Product id"
      end
    end
  end
end
