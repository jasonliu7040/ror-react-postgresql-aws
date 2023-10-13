class FixResourceTypeColumnName < ActiveRecord::Migration
  def change
    rename_column :resources, :type, :resource_type
  end
end
