class AddAttachReminderToLiquidTemplates < ActiveRecord::Migration
  def self.up
    add_column :liquid_templates, :attach_reminder, :boolean, default: true
  end

  def self.down
    remove_column :liquid_templates, :attach_reminder
  end
end
