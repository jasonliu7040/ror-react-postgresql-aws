class UpdateLiquidTemplates < ActiveRecord::Migration
  def up
    LiquidTemplate.where(name: 'Reminder').update_all(channel: TemplateChannel::EMAIL, category: TemplateCategory::REMINDER)
    LiquidTemplate.where(name: 'Sms').update_all(channel: TemplateChannel::SMS, category: TemplateCategory::REMINDER)
  end

  def down
    LiquidTemplate.where(name: 'Reminder').update_all(channel:nil,  category: nil)
    LiquidTemplate.where(name: 'Sms').update_all(channel:nil,  category: nil)
  end
end
