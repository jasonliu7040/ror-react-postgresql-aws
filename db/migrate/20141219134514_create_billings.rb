class CreateBillings < ActiveRecord::Migration
  def change
    create_table :billings do |t|
      t.string :vendor_string
      t.string :vendor_name
      t.references :account

      t.timestamps
    end
    add_index :billings, :account_id
  end
end
