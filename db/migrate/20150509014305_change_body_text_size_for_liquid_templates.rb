class ChangeBodyTextSizeForLiquidTemplates < ActiveRecord::Migration
  def up
    change_column :liquid_templates, :body, :text, :limit => 4294967295
    change_column :liquid_template_versions, :body, :text, :limit => 4294967295
  end

  def down
    change_column :liquid_templates, :body, :text, :limit => 65535
    change_column :liquid_template_versions, :body, :text, :limit => 65535
  end
end
