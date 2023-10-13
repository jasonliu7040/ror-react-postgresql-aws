class AddColumtsToLiquidTemplates < ActiveRecord::Migration
  def change
    add_column :liquid_templates, :category, :string
    add_column :liquid_templates, :channel, :string
  end
end
