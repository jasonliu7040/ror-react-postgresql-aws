class ResourcesController < ApplicationController
  before_filter :set_resource, only: [:edit, :update, :destroy]
  respond_to :html, :json

  include SpecificRendering

  def index
    @resources = @account.resources.order(:name)

    if params[:term]
      final = @resources.where("name like ? ", "%#{params[:term]}%")
      results = final.map {|d| {label: d.name, id: d.id, value: d.name}}
    end

    respond_with(@resources) do |format|
      format.html {}
      format.json { render json: results }
    end
  end

  def new
    @users = @account.users
    @resource = @account.resources.new
    @resource_types = Resource::TYPES_OF_RESOURCES
    respond_with(@resource)
  end

  def edit
    @users = @account.users
    @resource_types = Resource::TYPES_OF_RESOURCES
  end

  def create
    @resource = @account.resources.new(resource_params)
    @resource.save
    redirect_to action: :index
  end

  def update
    @resource.update_attributes(resource_params)
    redirect_to action: :index
  end

  def destroy
    flash[:notice] = "Resource deleted."
    @resource.destroy
    redirect_to action: :index
  end

  private
  def set_resource
    @resource = @account.resources.find(params[:id])
  end

  def resource_params
    params.require(:resource).permit(
      :description,
      :name,
      :resource_type,
      :user_id
    )
  end
end
