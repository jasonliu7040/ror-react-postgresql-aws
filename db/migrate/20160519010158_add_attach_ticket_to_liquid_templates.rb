class AddAttachTicketToLiquidTemplates < ActiveRecord::Migration
  def self.up
    add_column :liquid_templates, :attach_ticket, :boolean, default: false # used for reminder templates
  end

  def self.down
    remove_column :liquid_templates, :attach_ticket
  end
end
