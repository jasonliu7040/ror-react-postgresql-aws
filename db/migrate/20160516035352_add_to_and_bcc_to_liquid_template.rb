class AddToAndBccToLiquidTemplate < ActiveRecord::Migration
  def self.up
    add_column :liquid_templates, :to, :string
    add_column :liquid_templates, :bcc, :string
  end

  def self.down
    remove_column :liquid_templates, :to
    remove_column :liquid_templates, :bcc
  end
end
