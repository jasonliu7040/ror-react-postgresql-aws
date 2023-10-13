#Used by Events for building and returning all the various items in an order/param sent to the API
module HandleItem

  def handle_item(res_param)

    if res_param.is_a?(Array)
      items = handle_param_array(res_param)
      {:reservations => items}
    else
      event_hash = process_item(res_param,  setup_variant)
      if event_hash.is_a?(Hash)
        event_hash
      else
        {@cont_name => event_hash}
      end
    end
  end

  def process_item(res_param, var, prod = @product)
    item = if params[:product_id]
             @event.items.where(:product_id => params[:product_id]).first
           else
             @event.items.where(:product_id => prod.id).first
           end
    if item.blank?
      item = @event.items.build(res_param)
      #not sure if needed now
      now_update_item(item, res_param, var, prod)
      if item.errors.present?
        {"errors" => item.errors.messages}
      else
        item
      end
    else
      item.update_attributes res_param
      item
    end
  end
#i couldn't move all of this over to item like i wanted... so this was the best i could do.
  def now_update_item(item, res_param, variant, product)
    item.product = product
    item.shop = current_account
    item.now_update_item(res_param, variant)
    item.save
  end

  def handle_param_array(res_params)
    items = []
    res_params.each do |reservation|
      variant = Variant.where(id: reservation[:variant_id]).first
      product = current_account.products.where(id: variant.product_id).first

      if product.present? && variant.present?
        items << process_item(reservation, variant, product)
      end
    end
  end

  def get_product
    @product = current_account.products.where(id: params[:product_id]).first if params[:product_id]
    if params[:product_id] && @product.blank?
      #be nice to global an error or something here
      render_json_error("No Product Found")
    end
  end

  def add_event
    the_params = params
    @cont_name, @event = find_the_right_event(the_params[:id])
    add_all_day_if_new if @event.new_record?
  end

  def find_the_right_event(params_id)
    if params["controller"] == "waitlists"
      return "waitlist", @account.waitlists.where(cart_token: params_id).first_or_create
    else
      return "reservation", @account.reservations.where(cart_token: params_id).first_or_create
    end
  end

  def add_all_day_if_new
    @event.all_day = false
    @event.save
  end

  def setup_variant
    variant = @product.variants.where(id: params[:reservation][:variant_id]).first
    #should kill this if no start or finish... but what about that product variant that allows no start finish... deal when we get there.

    unless variant.present?
      render_json_error("No Variant Found, and you must have a Variant")
    else
      variant
    end
  end

end
