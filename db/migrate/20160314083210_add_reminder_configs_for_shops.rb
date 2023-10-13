class AddReminderConfigsForShops < ActiveRecord::Migration
  def up
    Shop.where(:send_reminders => true).each do |shop|
      email_template = shop.templates.reminders.where(channel: TemplateChannel::EMAIL).first
      sms_template = shop.templates.reminders.where(channel: TemplateChannel::SMS).first
      ReminderConfig.create(shop: shop,
                            liquid_template_id: email_template.id,
                            cc_location: shop.reminder_cc_location,
                            duration: shop.reminder_time,
                            trigger_type: TriggerType::BEFORE_START
      ) if email_template.present?
      ReminderConfig.create(shop: shop,
                            liquid_template_id: sms_template.id,
                            duration: shop.reminder_time,
                            trigger_type: TriggerType::BEFORE_START
      ) if sms_template.present?
    end
  end

  def down
    Shop.where(:send_reminders => true).each do |shop|
      shop.reminder_configs.destroy_all
    end
  end
end
