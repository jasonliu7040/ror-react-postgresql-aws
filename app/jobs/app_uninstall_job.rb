class AppUninstallJob < Struct.new(:shop_id)
  include BookThatAppUtils

  def perform
    log_exception(true) do
      shop = Shop.find_by_id(self.shop_id)
      if shop
        Rails.logger.info "[#{shop.subdomain}] Shop uninstalled"

        Notifier.uninstall_email(shop).deliver_now

        # send_survey_email(shop)

        shop.destroy
      end
    end
  end

  def send_survey_email(shop)
    if shop.email.present? && shop.owner.present? && !ignored_email_address?(shop.email) && !bouncer?(shop)
      # we don't use sendgrid for this one so we need to override the actionmailer settings.
      custom_smtp_settings = {
          address: 'smtp.gmail.com',
          port: 587,
          domain: 'mail.shopifyconcierge.com',
          user_name: 'gavin.terrill@shopifyconcierge.com',
          password: $redis.get("GMAIL_PASS"),
          authentication: 'plain',
          enable_starttts_auto: true,
          openssl_verify_mode: 'none'
      }

      survey_email = Notifier.exit_survey_email(shop)
      survey_email.delivery_method.settings.merge! custom_smtp_settings
      survey_email.deliver_now
    end
  end

  def ignored_email_address?(email)
    ['Development Shop', 'shopify.com'].include?(email) || email =~ /test/i
  end

  def bouncer?(shop)
    shop.days_since_joining < 1
  end
end
