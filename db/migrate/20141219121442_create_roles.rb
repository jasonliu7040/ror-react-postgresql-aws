class CreateRoles < ActiveRecord::Migration
  def change
    create_table :roles do |t|
      t.references :account
      t.references :user
      t.integer :ranking

      t.timestamps
    end
    add_index :roles, :account_id
    add_index :roles, :user_id
  end
end
