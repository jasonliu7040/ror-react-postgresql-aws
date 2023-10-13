#     <%= javascript_include_tag '//maps.googleapis.com/maps/api/js?key=AIzaSyBSx5OzpJXZiuO5CTmQ3BSk7FHrR3vAHpQ&sensor=true' %>

class LocationsController < ApplicationController
  respond_to :html, :json
  before_filter :set_location, only: [:show, :edit, :update, :destroy]
  include SpecificRendering

  def index
    @locations = @account.locations

    if params[:term]
      final = @locations.where("name like ? ", "%#{params[:term]}%")
      results = final.map {|l| {label: l.name, id: l.id, value: l.name}}
    end

    respond_with(@locations) do |format|
      format.html {}
      format.json { render json: results }
    end
  end

  def new
    @location = @account.locations.new
    respond_with(@location)
  end

  def edit
  end

  def create
    @location = @account.locations.new(location_params)
    @location.save
    redirect_to action: :index
  end

  def update
    @location.update_attributes(location_params)
    redirect_to action: :index
  end

  def destroy
    @location.destroy
    flash[:notice] = "Location deleted."
    redirect_to action: :index
  end

  private

  def location_params
    params.require(:location).permit(:name, :address, :email)
  end

  def set_location
    @location = @account.locations.find(params[:id])
  end
end
