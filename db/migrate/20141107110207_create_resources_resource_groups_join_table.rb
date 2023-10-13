class CreateResourcesResourceGroupsJoinTable < ActiveRecord::Migration
  def change
    create_table :resource_groups_resources, id: false do |t|
      t.integer :resource_id
      t.integer :resource_group_id
    end
  end
end
