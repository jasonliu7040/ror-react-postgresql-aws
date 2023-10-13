class ResourceGroupsController < ApplicationController
  before_filter :set_resource_group, only: [:edit, :update, :destroy]
  respond_to :html

  def index
    @resource_groups = @account.resource_groups.all
    respond_with(@resource_groups)
  end

  def new
    @resources = @account.resources
    @resource_group = @account.resource_groups.new
    respond_with(@resource_group)
  end

  def edit
    @resources = @account.resources
  end

  def create
    @resource_group = @account.resource_groups.new(resource_groups_params)
    if @resource_group.save
      @account.resources.find(params[:resource_id]).resource_groups << @resource_group
    end
    respond_with(@resource_group)
  end

  def update
    @resource_group.update_attributes(resource_groups_params)
    redirect_to action: :index
  end

  def destroy
    @resource_group.destroy
    respond_with(@resource_group)
  end

  private
    def set_resource_group
      @resource_group = @account.resource_groups.find(params[:id])
    end

  def resource_groups_params
    params.require(:resource_group).permit(
      :description,
      :name
    )
  end
end
