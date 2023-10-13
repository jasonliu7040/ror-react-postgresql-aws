class UsersController < ApplicationController
  before_filter :get_user, :only => [:show, :edit, :update]
  def index
    @users = @account.users
    @role_types = Role::ROLE_TYPES.invert
  end

  def show

  end

  def edit

  end
  def update
    if @user.update_attributes(user_params)
      redirect_to @user, notice: "User saved"
    else
      render 'edit'
    end
  end

  private
  def get_user
    @user = @account.users.where(:id => params[:id]).first
  end
  def user_params
    params.require(:user).permit( :email, :password, :password_confirmation, :remember_me, :title, :name, :role_id)
  end
end
