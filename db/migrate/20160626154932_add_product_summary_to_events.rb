class AddProductSummaryToEvents < ActiveRecord::Migration
  def change
    add_column :events, :product_summary, :string
  end
end
