class ChangeEmailEventsReasonToText < ActiveRecord::Migration
  def up
    change_column :email_events, :reason, :text
  end

  def down
    change_column :email_events, :reason, :string
  end
end
