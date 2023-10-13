class AddNotesToEvents < ActiveRecord::Migration
  def change
    add_column :events, :notes, :text
    add_column :events, :hotel, :string
    add_column :events, :sku, :string
  end
end
