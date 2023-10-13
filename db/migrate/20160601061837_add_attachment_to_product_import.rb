class AddAttachmentToProductImport < ActiveRecord::Migration
  def self.up
    add_attachment :product_imports, :attachment
  end

  def self.down
    remove_attachment :product_imports, :attachment
  end
end
