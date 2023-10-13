class CreateEvents < ActiveRecord::Migration
  def self.up
    create_table :events do |t|
      t.string      :type
      t.references  :shop
      t.references  :product
      t.datetime    :start
      t.datetime    :finish
      t.integer     :all_day

      # booking cols
      t.integer     :order_id
      t.integer     :status
      t.string      :name
      t.string      :email
      t.integer     :customer_id

      t.timestamps
    end
    add_index :events, [:shop_id, :product_id, :start]
  end

  def self.down
    remove_index :events, [:shop_id, :product_id, :start]
    drop_table :events
  end
end
