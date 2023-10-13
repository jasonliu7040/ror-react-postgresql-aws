require "rexml/document"

class UpdateBookingTemplate < ActiveRecord::Migration
  #TEMPLATES    = %w( bookings )
  #
  #NEW_CONTENTS = TEMPLATES.inject({}) do |memo, template|
  #   memo[template] = File.read("#{::Rails.root.to_s}/db/templates/#{template}.liquid")
  #   memo
  # end

  def self.up
    #Shop.all.each do |shop|
    #  TEMPLATES.each do |template|
    #    tmpl = LiquidTemplate.new(:shop => shop, :name => template, :body => NEW_CONTENTS[template])
    #    tmpl.save!
    #  end
    #end
  end

  def self.down
    #Shop.all do |shop|
    #  shop.templates do |tmpl|
    #    tmpl.destroy
    #  end
    #end
  end
end
