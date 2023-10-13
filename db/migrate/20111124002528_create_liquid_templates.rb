class CreateLiquidTemplates < ActiveRecord::Migration
  def self.up
    create_table :liquid_templates do |t|
      t.integer :shop_id
      t.text :body
      t.string :name
      t.timestamps
    end

    create_table :liquid_template_versions do |t|
      t.integer  :liquid_template_id
      t.text     :body
      t.datetime :created_at
      t.integer  :version, :default => 0
      t.string   :snapshot
    end

    add_index :liquid_templates, :shop_id
  end

  def self.down
    remove_index :liquid_templates, :shop_id
    drop_table :liquid_template_versions
    drop_table :liquid_templates
  end
end


