class HomeController < ApplicationController
  layout 'brochure'

  def index
    current_host = "#{request.host}#{':' + request.port.to_s if request.port != 80}"
    @callback_url = "http://#{current_host}/login/finalize"
    respond_to :html
  end

  def status
    render :inline => "<h1>Status</h1><p>Good</p>"
  end

  def view
    if params[:shop].present?
      redirect_to :controller => 'Events', :action => "index", :subdomain => params[:shop].split('.')[0]
    end
  end

  def change_ui
    if $flipper[:new_ui].enabled?(current_account)
      $flipper[:new_ui].disable(current_account)
      redirect_to events_path
    else
      $flipper[:new_ui].enable(current_account)
      redirect_to admin_events_path
    end
  end

end
