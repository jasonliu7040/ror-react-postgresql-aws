module ActiveModel
  class Errors
    def to_liquid()
      @messages.stringify_keys.keys
    end
  end
end