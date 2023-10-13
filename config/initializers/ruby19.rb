class Object
  # note that this method is already defined in Ruby 1.9
  def define_singleton_method(name, callable = nil, &block)
    block ||= callable
    metaclass = class << self; self; end
    metaclass.send(:define_method, name, block)
  end if RUBY_VERSION < "1.9"
end
