class BlackoutsCollideValidator < ActiveModel::Validator
  def validate(record)
    black_outs = Blackout.between(record.start, record.finish)
    ids = black_outs.map(&:product_id)
    if ids.count > 0
      the_ids = partition_nils(ids)
      message = if the_ids[0].present?
                  "collides with another global Blackout"
                else
                  "collides with an existing Blackout" if product_matches(black_outs.map(&:variant_id), record, the_ids[1])
                #    for the Product #{record.product_id}#{ add_variant_message(record.variant_id) } with the same date
                end
      record.errors[:start] << message if message.present?
    end
  end

  def product_matches(black_out_variants, record, the_ids)
    if the_ids.include?(record.product_id)
      var_id = record.variant_id
      if var_id.present?
        has_variants(black_out_variants, var_id)
      else
        true # blackout on all variants
      end
    end
  end

  def partition_nils(ids)
    ids.partition { |d| d.nil? }
  end

  def has_variants(variants_array, the_variant_id)
    var_ids = partition_nils(variants_array)
    var_ids[1].include?(the_variant_id)
  end

  def add_variant_message(var_id)
    "and Variant #{var_id}" if var_id.present?
  end
end

#id of products - means we have products with blackouts in this date range
#of those product_ids is one the one we are looking
# if yes, and the record has a varaint
# iterate through the list of blakcouts for variant_id and does it match?
#if yes and the record has no variant
# collision, send true
