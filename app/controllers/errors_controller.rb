class ErrorsController < ApplicationController
  def error_404
    format.html { render status: 404 }
    format.any  { render text: 'Not Found', status: 404 }
  end

  def error_422
    format.html { render status: 422 }
    format.any  { render text: 'Unprocessable Entity', status: 422 }
  end

  def error_429
    render :status => 500, :formats => [:html]
  end

  def error_500
    render file: "#{Rails.root}/public/500.html", layout: false, status: 500
  end
end
