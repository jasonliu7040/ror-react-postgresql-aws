require 'test_helper'

class ShortenFilterTest < ActiveSupport::TestCase
  # test "bitly" do
  #   bitly = Bitly.client
  #   assert bitly
  #   FakeWeb.register_uri(:get, /api.bit.ly\/v3\/shorten/, :body =>"") #"{ \"data\": { \"long_url\": \"https:\\/\\/maps.google.com\\/maps?q=47+Gladesville+Road,+Hunters+Hill,+New+South+Wales,+Australia&hl=en&sll=37.0625,-95.677068&sspn=53.035373,93.076172&oq=47+Gladesville+Road,+Hunters+Hill,+New+South+Wales&t=h&hnear=47+Gladesville+Rd,+Hunters+Hill+New+South+Wales+2110,+Australia&z=17\", \"url\": \"http:\\/\\/bit.ly\\/1iNieva\", \"hash\": \"1iNieva\", \"global_hash\": \"1iNievb\", \"new_hash\": 0 } }\n")

  #                        #{"status_code"=>200,
  #                          # "status_txt"=>"OK",
  #                          # "data"=>
  #                          # {"long_url"=>
  #                          #   "https://maps.google.com/maps?q=47+Gladesville+Road,+Hunters+Hill,+New+South+Wales,+Australia&hl=en&sll=37.0625,-95.677068&sspn=53.035373,93.076172&oq=47+Gladesville+Road,+Hunters+Hill,+New+South+Wales&t=h&hnear=47+Gladesville+Rd,+Hunters+Hill+New+South+Wales+2110,+Australia&z=17",
  #                          #   "url"=>"http://bit.ly/1iNieva",
  #                          #   "hash"=>"1iNieva",
  #                          #   "global_hash"=>"1iNievb",
  #                          #    "new_hash"=>0}})
  #   u = bitly.shorten('https://maps.google.com/maps?q=47+Gladesville+Road,+Hunters+Hill,+New+South+Wales,+Australia&hl=en&sll=37.0625,-95.677068&sspn=53.035373,93.076172&oq=47+Gladesville+Road,+Hunters+Hill,+New+South+Wales&t=h&hnear=47+Gladesville+Rd,+Hunters+Hill+New+South+Wales+2110,+Australia&z=17')
  #   assert_equal "http://bit.ly/1iNieva", u.short_url
  # end
end
