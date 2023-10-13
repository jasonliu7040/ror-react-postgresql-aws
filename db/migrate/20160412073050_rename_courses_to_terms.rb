class RenameCoursesToTerms < ActiveRecord::Migration
  def up
    rename_table :courses, :terms
  end

  def down
    rename_table :terms, :courses
  end
end
