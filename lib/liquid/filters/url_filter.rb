module UrlFilter
  def shorten(input)
    bitly = Bitly.client
    u = bitly.shorten(input)
    u.short_url
  end
end