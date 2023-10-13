class CreateShopNotes < ActiveRecord::Migration
  def change
    create_table :shop_notes do |t|
      t.integer :shop_id
      t.string :message, :default => "Booking created"
      t.boolean :was_read, :default => false
      t.string :message_type, :default => "Note"
      t.boolean :actionable, :default => false
      t.boolean :action_taken, :default => false

      t.timestamps
    end
  end
end
