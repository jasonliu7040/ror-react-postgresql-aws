# Load the rails application
require File.expand_path('../application', __FILE__)

unless Kernel.respond_to?(:require_relative)
  module Kernel
    def require_relative(path)
      require File.join(File.dirname(caller[0]), path.to_str)
    end
  end
end

# Initialize the rails application
Bookthatapp::Application.initialize!
