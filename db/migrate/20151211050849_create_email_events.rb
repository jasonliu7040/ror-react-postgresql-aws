class CreateEmailEvents < ActiveRecord::Migration
  def change
    create_table :email_events do |t|
      t.references :shop,    :null => false
      t.references :booking, :null => false
      t.string :email, :null => false
      t.datetime :occurred_at, :null => false
      t.string :event, :null => false
      t.string :response
      t.integer :attempt
      t.string :reason
      t.string :event_type
      t.timestamps
    end

    add_index :email_events, [:shop_id, :booking_id]
  end
end
