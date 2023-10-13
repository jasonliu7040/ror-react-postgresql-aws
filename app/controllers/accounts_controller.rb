#Parent Class for all shops. Where all the fun begins.
class AccountsController < ApplicationController
  respond_to :html
  #before_filter :set_account, only: [:show, :edit, :update] #, :destroy]
  #before_filter :mimic_check_plan, only: [:show, :edit, :update] #, :destroy]

  ## To be used by BTA eventually, but more than likely in Rails admin.
  # def index
  #   @accounts = Account.all
  #   respond_with(@accounts)
  # end

  def show
   # respond_with(@account)
  end

  def new
   # @account = Account.new
   # respond_with(@account)
  end

  def edit
  end

  def create
   # @account = Account.new(params[:account])
   # @account.save
   # respond_with(@account)
  end

  def update
   # @account.update_attributes(params[:account])
   # respond_with(@account)
  end
  # # Dangerous, so i leave it out on the parent model usually. You want the opporunity to get them back.
  # def destroy
  #   @account.destroy
  #   respond_with(@account)
  # end

  private
  #once we understand user in this workflow, then we can scope by current_user here.
    def set_account
      @account = Account.find(params[:id])
    end

end
