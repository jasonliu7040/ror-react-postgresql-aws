class AddNumberInPartyToEvents < ActiveRecord::Migration
  def change
    add_column :events, :number_in_party, :integer, :default => 1
  end
end
