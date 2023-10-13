class Presenter

  require 'json'

  def initialize(object=nil)
    @object = object
  end

  def as_json
    raise 'as_json called on parent.'
  end

end