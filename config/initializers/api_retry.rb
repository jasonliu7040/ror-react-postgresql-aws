module ActiveResource
  class Connection
    def request_with_sleeper(*args, &block)
      if self === ShopifyAPI::Base.connection
        unless Rails.env.test?
          if (ShopifyAPI::Base.connection.response && ShopifyAPI.credit_maxed?)
            sleep(0.5)
          end
        end
        begin
          request_without_sleeper(*args, &block)
        rescue ActiveResource::ConnectionError => ex
          if ex.response && ex.response.code.to_s == '429'
            sleep(0.5)
            retry
          else
            raise ex
          end
        end
      else
        request_without_sleeper(*args, &block)
      end
    end

    alias_method_chain :request, :sleeper
  end
end
