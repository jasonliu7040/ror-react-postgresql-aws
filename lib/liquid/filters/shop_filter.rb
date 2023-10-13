module ShopFilter

  def asset_url(input)
    "http://static.shopify.com/s/files/#{resources_dir}/assets/#{input}"
  end

  def files_url(input)
    "http://static.shopify.com/s/files/#{resources_dir}/files/#{input}"
  end


  def global_asset_url(input)
    req = @context.registers[:request]
    "http://static.shopify.com/s/global/#{input}"
  end

  def shopify_asset_url(input)
    "http://static.shopify.com/s/shopify/#{input}"
  end

  def script_tag(url)
    %(<script src="#{url}" type="text/javascript"></script>)
  end

  def stylesheet_tag(url, media="all")
    %(<link href="#{url}" rel="stylesheet" type="text/css"  media="#{media}"  />)
  end

  def link_to(link, url, title="")
    %|<a href="#{url}" title="#{title}">#{link}</a>|
  end

  def img_tag(url, alt="")
    %|<img src="#{url}" alt="#{alt}" />|
  end

  def link_to_vendor(vendor)
    if vendor
      link_to vendor, url_for_vendor(vendor), vendor
    else
      'Unknown Vendor'
    end
  end

  def link_to_type(type)
    if type
      link_to type, url_for_type(type), type
    else
      'Unknown Vendor'
    end
  end

  def url_for_vendor(vendor_title)
    "#{ShopifyAPI::Shop.cached.url}/admin/collections/vendors?q=#{CGI.escape(vendor_title)}"
  end

  def url_for_type(type_title)
    "#{ShopifyAPI::Shop.cached.url}/admin/collections/types?q=#{CGI.escape(type_title)}"
  end

  def product_img_url(url, style = 'small')
    if url.blank?
      "http://cdn.shopify.com/s/images/admin/no-image-#{style}.gif"

    else
      unless url =~ /^\/?products\/([\w\-\_]+)\.(\w{2,4})/
        raise ArgumentError, 'filter "product_img_url" can only be called on product images'
      end

      case style
      when 'original'
        "http://static.shopify.com/s/files/#{resources_dir}/#{url}"
        when 'grande', 'large', 'medium', 'compact', 'small', 'thumb', 'icon'
          ext = File.extname(url)
          file = File.basename(url, ext)
        "http://static.shopify.com/s/files/#{resources_dir}/products/#{file}_#{style}#{ext}"
      else
        raise ArgumentError, 'valid parameters for filter "size" are: original, grande, large, medium, compact, small, thumb and icon '
      end
    end
  end

  # Accepts a number, and two words - one for singular, one for plural
  # Returns the singular word if input equals 1, otherwise plural
  def pluralize(input, singular, plural)
    input == 1 ? singular : plural
  end

  def resources_dir
    shop_id = ShopifyAPI::Shop.cached.id
    resources_dir = "1/" << ("%08d" % shop_id).scan(/..../).join('/')
  end


  def matching_times(input, reminder_trigger)
    return input unless input.is_a?(Array)
    input.select{ |object| ReminderTriggerEventDrop.new(object, reminder_trigger).cover }
  end


end
