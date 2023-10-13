include ActionView::Helpers::DateHelper

class Notifier < ActionMailer::Base
  # @param shop [Shop]
  def signup_email(shop)
    shop.external do
      headers['X-SMTPAPI'] = JSON.generate({"unique_args" => {"shop" => shop.subdomain}, "category" => "signup"}).to_s
      the_mail_to_setup(shop, "Welcome to BookThatApp", "signup_email")
    end
  end

  def install_email(shop)
    the_mail_to_setup(shop, "BookThatApp Install", "install_email")
  end

  def feedback_email(shop, feedback)
    headers['X-SMTPAPI'] = JSON.generate({"unique_args" => {"shop" => shop.subdomain}, "category" => "feedback"}).to_s
    mail to: "gavin@shopifyconcierge.com", from: feedback.email, subject: "[#{shop.subdomain}] #{feedback.subject}", body: feedback.content
  end

  def missing_date_email(shop, order)
    external = shop.external_shop
    mail(:to => external.email, :cc => "info@shopifyconcierge.com", :subject => "[BookThatApp] Booking Notification", :from => "info@shopifyconcierge.com") do |format|
      template = LiquidTemplate.new
      template.shop = shop
      template.name = "missing_date_email"
      template.body = File.read("#{Rails.root}/db/emails/#{template.name}.html")
      order_url = "https://#{ external.myshopify_domain }/admin/orders/#{ order.id }"
      bta_url = "http://#{shop.subdomain}.#{DOMAIN}/bookings/new"
      text = template.render({"shop" => external, "order" => order, "order_url" => order_url, "bta_url" => bta_url, "order_id" => order.id})
      format.html { render :text => text }
    end
  end

  def uninstall_email(shop)
    headers['X-SMTPAPI'] = JSON.generate({"unique_args" => {"shop" => shop.subdomain}, "category" => "uninstall"}).to_s
    mail(:to => "info@shopifyconcierge.com", :subject => "BookThatApp Uninstall", :from => "info@shopifyconcierge.com") do |format|
      text = "<p>#{shop.subdomain} just uninstalled after signing up with us #{time_ago_in_words(shop.created_at)} ago. They were on the #{shop.charge_id > 0 ? 'paid' : 'trial'} plan.</p>"
      format.html { render :text => text }
    end
  end

  def exit_survey_email(shop)
    mail(:to => shop.email, :subject => 'Quick Question', :from => 'gavin@shopifyconcierge.com') do |format|
      text = "<p>Hi #{shop.owner.split.first.capitalize},</p>"
      text += "<p>Thanks for giving BookThatApp a try. I'm sorry that you didn't love it.</p>"
      text += "<p>I have a quick question that I hope you'll answer to help make BookThatApp better: what made you cancel?</p>"
      text += "<p>Just reply to this email and let me know. I'd really appreciate it.</p>"
      text += "<p>Thanks,<br>Gavin</p>"
      format.html { render :text => text }
    end
  end

  def pulse_email(stats = {})
    mail(:to => "#{Rails.env.production? ? 'info@shopifyconcierge.com' : 'gavin@shopifyconcierge.com'}", :subject => "BookThatApp Pulse", :from => "info@shopifyconcierge.com") do |format|
      text = "<html>"
      text += "<body><img src='http://cdn.shopify.com/s/files/1/0030/4682/assets/shopifyconcierge_logo_300.png?13055972514987921712' align='right'/>"
      text += "<h3>Pulse Metrics for BookThatApp</h3>"
      text += "<p><i>For the period #{ 7.days.ago.to_s(:short) } - #{ Time.now.to_s(:short) }</i></p>"
      text += "<ul>"
      text += "<li><strong>Monthly Recurring Revenue</strong>: $USD #{sprintf('%.2f', stats[:mrr])}</li>"
      text += "<li><strong>Total Paid Subscribers</strong>: #{stats[:paying_shops]}</li>"
      text += "<li><strong>Signups</strong>: #{stats[:last_week_signups]} (#{stats[:last_week_signups_paying]} paying)</li>"
      text += "<li><strong>Active Shops</strong>: <strong>#{stats[:last_week_active]}</strong> shops had at least 1 booking</li>"
      text += "</ul>"
      text += "<h4>Top 10 Shops by bookings</h4>"
      text += "<table>"
      text += "<tr><th>Shop</th><th># Bookings</th></tr>"
      stats[:top_10_shops].each do |top_shop|
        text += "<tr><td>#{top_shop.subdomain}</td><td>#{top_shop.count}</td></tr>"
      end
      text += "</table><br>"
      text += "<p>Note: numbers are for actual valid shops. Frozen, uninstalled etc are not included.</p>"
      text += "</body>"
      text += "</html>"
      format.html { render :text => text }
    end
  end

  def render_message(method_name, body)
    shop = lookup_shop
    if shop
      shop.external do
        assigns = {"shop" => shop, "booking" => Booking.find(params[:id].to_i)}
        render :text => shop.template("email").render(assigns, LIQUID_FILTERS), :status => 200, :content_type => 'text/plain'
      end
    else
      render :nothing => true, :status => 404
    end

    tmpl = booking.shop.templates.find_by_name(method_name)
    template = Liquid::Template.parse(tmpl.body)
    template.render body
  end

  private

  def the_mail_to_setup(shop, the_subject, template_name)
    ext = shop.external_shop
    if ext.present?

      mail(:to => ext.email, :cc => "info@shopifyconcierge.com", :subject => the_subject, :from => "info@shopifyconcierge.com") do |format|
        template = LiquidTemplate.new
        template.shop = shop
        template.name = template_name
        template.body = File.read("#{Rails.root}/db/emails/#{template.name}.html")
        text = template.render({"shop" => ext})
        format.html { render :text => text }
      end
    end
  end
end
