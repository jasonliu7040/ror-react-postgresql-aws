class AddOauthTokenToShops < ActiveRecord::Migration
  def self.up
    add_column :shops, :oauth_token, :string unless Shop.column_names.include?('oauth_token')
  end

  def self.down
    remove_column :shops, :oauth_token
  end
end
