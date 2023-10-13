class AddNameToTerms < ActiveRecord::Migration
  def up
    add_column :terms, :name, :string
  end

  def down
    remove_column :terms, :name
  end
end
