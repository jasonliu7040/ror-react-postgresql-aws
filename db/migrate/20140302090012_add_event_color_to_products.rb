class AddEventColorToProducts < ActiveRecord::Migration
  def change
    add_column :products, :text_color, :string, :default => ""
    add_column :products, :background_color, :string, :default => ""
    add_column :products, :border_color, :string, :default => ""
  end
end
