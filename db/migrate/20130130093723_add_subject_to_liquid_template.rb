class AddSubjectToLiquidTemplate < ActiveRecord::Migration
  def change
    add_column :liquid_templates, :subject, :string
    add_column :liquid_templates, :cc, :string
  end
end
