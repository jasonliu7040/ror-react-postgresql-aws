module ReportsHelper
  def display_product_search_options
    @product_id = params[:products] || ''

    products = @account.products.order('product_title')

    profile = params[:profile]
    products = products.where("profile = '#{profile}'") if profile.present?

    opts = ['<option value="">Select...</option>']
    products.each do |product|
      opts << "<option value='#{product.id}' #{"selected='selected'" if product.id.to_s == @product_id} data-external-id=#{product.external_id}>#{product.product_title}</option>"
    end
    opts.join(' ').html_safe
  end

  def display_product_variants
    opts = []
    Variant.where(:product_id => @product_id).each do |variant|
      opts << "<option value='#{variant.id}' data-external-id='#{variant.external_id}' #{"selected='selected'" if variant.id.to_s == @the_data.variant_id}>#{variant.title}</option>"
    end
    opts.join(' ').html_safe
  end

  def display_resources
    @resource_id = params[:resources] || ''
    opts = ['<option value="">Select Resource...</option>']
    @available_resources.each do |resource|
      opts << "<option value='#{resource.id}' #{"selected='selected'" if resource.id.to_s == @resource_id}>#{resource.name}</option>"
    end
    opts.join(' ').html_safe
  end

  def all_day_variants_only?(booking)
    booking.booking_items.all?{|bi| bi.variant.all_day != 0}
  end

  def fields_for_select
    Report::FIELDS.map{|key, val| [val[:text], key]}
  end

  def field_render(field_key, item)
    text = ''
    case field_key
      when Report::EVENT_ORDER_ID
        if item.booking.order_id.blank?
          text += "<a href='https://#{current_shop.url}/admin/orders/#{item.booking.order_id}' target='_blank'><span class='nowrap'>#{ item.booking.order_name.blank? ? "View Order" : item.booking.order_name }</span></a>"
        end
      when Report::CUSTOMER_EMAIL
        text += report_customer_email(item)
      when Report::CUSTOMER_CONTACTS
        text += report_customer_email(item)
        if item.booking.phone.present?
          text += '<br/>'
          text += report_customer_phone(item)
        end
      when Report::CUSTOMER_PHONE
        if item.booking.phone.present?
          text += report_customer_phone(item)
        end
      when Report::START
        text += report_start_date(item)
      when Report::FINISH
        text += report_finish_date(item)
      when Report::BOOKING_ID
        if item.booking.is_a?(Booking)
          text +=  "<span class='nowrap'><i class='no-print m-r-xs fa #{item.booking.status == 2 ? 'fa-calendar' : 'fa-clock-o'}'></i>#{link_to item.booking.id, edit_booking_path(item.booking), title: item.booking.status == 2 ? 'Confirmed' : 'Reserved'}</span>"
        end
      when Report::START_FINISH
        text += report_start_date(item)
        if item.variant.all_day? && item.start.to_date < item.finish.to_date || !item.variant.all_day?
          text += ' - <br/>'
          text += report_finish_date(item)
        end
      when Report::QUANTITY
        text += item.quantity.to_s
      when Report::NOTES
        text +=  item.booking.notes
      when Report::PRODUCT_WITH_VARIANT
        text +=  "#{item.product.product_title}/#{item.variant.title}"
      when Report::CUSTOMER_NAME
        text +=  item.booking.name
      when Report::PRODUCT_TITLE
        text +=  item.product.product_title
      when Report::VARIANT_TITLE
        text +=  item.variant.title
      else
        text += item[field_key]
    end
    text.html_safe
  end

  def report_customer_email(item)
    "<span class='nowrap'><i class='no-print m-r-xs fa fa-envelope'></i>#{ mail_to item.booking.email, item.booking.name, :subject => item.booking.product_title }</span>"
  end

  def report_customer_phone(item)
    "<span class='nowrap'><i class='no-print fa fa-phone m-r-xs'></i><a href='tel:#{ item.booking.phone }'>#{ item.booking.phone }</a></span>"
  end

  def report_start_date(item)
    if item.variant.all_day?
      "<span class=nowrap'>#{ I18n.localize(item.start.to_date, :format => :short) }</span>"
    else
      "<span class='nowrap'>#{ I18n.localize(item.start, :format => :short) }</span>"
    end
  end

  def report_finish_date(item)
    if item.variant.all_day?
      "<span class=nowrap'>#{ I18n.localize(item.finish.to_date, :format => :short) }</span>"
    else
      "<span class='nowrap'>#{ I18n.localize(item.finish, :format => :short) }</span>"
    end
  end

end
