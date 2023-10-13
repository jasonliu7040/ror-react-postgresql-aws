class AddIgnoreToVariants < ActiveRecord::Migration
  def up
    add_column :variants, :ignore, :boolean, :default => false
    Variant.reset_column_information
    Variant.update_all(:ignore => false)
  end

  def down
    remove_column :variants, :ignore
  end
end
