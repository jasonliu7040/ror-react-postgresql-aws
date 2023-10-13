module ApplicationHelper
  def current_year
    Time.now.strftime('%Y')
  end

  def existing(product)
    @existing_products.index {|p| p.external_id == product.id }
  end

  def thumb_image(url)
    parts = url.rpartition('.')
    parts[0] + '_thumb.' + parts[2]
  end

  def small_image(url)
    parts = url.rpartition('.')
    parts[0] + '_small.' + parts[2]
  end

  def gravatar_for email, options = {}
    unless email.blank?
      options = {:alt => 'avatar', :class => 'avatar', :size => 80}.merge! options
      id = Digest::MD5::hexdigest email.strip.downcase
      url = 'http://www.gravatar.com/avatar/' + id + '.jpg?s=' + options[:size].to_s
      options.delete :size
      image_tag url, options
    end
  end

  def scheduled_at(time, all_day = false)
    if time
      if all_day == 1
        "#{time.year}-#{'%02d' % time.month}-#{'%02d' % time.day}"
      else
        # I18n.localize(time)
        "#{time.year}-#{'%02d' % time.month}-#{'%02d' % time.day} #{'%02d' % time.hour}:#{'%02d' % time.min}"
      end
    else
      ""
    end
  end

  def date_or_datetime(variant, time)
    return unless variant

    if variant.all_day == 1
      "#{time.year}-#{'%02d' % time.month}-#{'%02d' % time.day}"
    else
      # I18n.localize(time)
      "#{time.year}-#{'%02d' % time.month}-#{'%02d' % time.day} #{'%02d' % time.hour}:#{'%02d' % time.min}"
    end
  end

  def id_if_not_nil(obj)
    return unless obj
    obj.id
  end

  def booking_summary
    summary = @booking.product_summary || ''

    unless @booking.start.nil?
      if @booking.start.hour == 0 && @booking.start.min == 0
        summary += " #{I18n.localize(@booking.start.to_date, :format => :short)}"
      else
        summary += " #{I18n.localize(Time.at(@booking.start.to_time), :format => :short)}"
      end
    end

    summary += " #{@booking.email}"
    summary
  end

  def ui_version_path
    text = ui_version(proc { 'Go back to classic UI' }, proc { 'Try our new beta UI' })
    link_to text, change_ui_path
  end

  def render_source(args={lang: 'html'})
    @html_encoder ||= HTMLEntities.new

    block = '<table class="table code-sample">'

    if args[:path].present?
      block += "<caption>#{args[:path]}#{':' + args[:line].to_s if args[:line].present?}</caption>"
    end

    block += '<tbody><tr><td>'
    block += "<pre class='prettyprint lang-#{args[:lang]} #{'linenums:' + args[:line].to_s if args[:line].present?}'>"
    block += "<code>#{@html_encoder.encode(render args[:partial])}</code>"
    block += '</pre></td></tr></tbody></table>'

    raw(block)
  end


  def is_active_action(path)
    current_page?(path) ? "active" : nil
   end
end
