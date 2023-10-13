require 'chronic'

class BlackoutsController < ApplicationController
  before_filter  :find_products
  include SpecificRendering

  def new
    @blackout = current_account.blackouts.build

    if params[:all_day].present?
      @blackout.all_day = 1 if params[:all_day] == "true"
    end

    if params[:start].present?
      start = DateTime.parse(params[:start])
    else
      start = DateTime.now
    end

    finish = start + 1.hour
    if params[:finish].present?
      finish = DateTime.parse(params[:finish])
    end

    @blackout.start = start
    @blackout.finish = finish
  end

  def create
    @blackout = Blackout.new(blackout_params.except('id'))
    @blackout.shop = @account

    respond_to do |format|
      if @blackout.save
        format.html { redirect_to(events_url) }
        format.xml  { render :xml => @blackout, :status => :created, :location => @blackout }
        format.json do
          render json: { blackout: BlackoutSerializer.new(@blackout, root: false).as_json,
                         message: 'Blackout created' },
                         status: :created
        end
      else
        @variants = @blackout.product.present? ? @blackout.product.variants : []
        format.html { render :new, notice: "All Dates must be filled out." }
        format.xml  { render :xml => @blackout.errors, :status => :unprocessable_entity }
        format.json do
          render json: { errors: @blackout.errors.full_messages, message: "Failed to save!" },
                 status: :unprocessable_entity
        end
      end
    end
  end

  def edit
    @blackout = @account.blackouts.where(id: params[:id]).first
    @blackout = @account.events.where(id: params[:id], type: "OldBlackout").first if @blackout.blank?
    if @blackout.present?
      @variants = @blackout.product.present? ? @blackout.product.variants : []
    else
      redirect_to events_url, alert: "Blackout not found"
    end
  end

  def update
    b = blackout_params

    @blackout = @account.blackouts.where(:id => params[:id]).first
    @blackout = @account.events.where(id: params[:id], type: "OldBlackout").first if @blackout.blank?
    respond_to do |format|
      if @blackout.present?


        if params[:delete]
          @blackout.delete
          format.html { redirect_to(events_url) }
          format.js do
            render json: { message: "Blackout deleted" },
                   status: :ok
          end
        else
          if @blackout.update_attributes(b)
            format.html { redirect_to events_url, :notice => "Blackout updated" }
            format.js do
              render json: { blackout: BlackoutSerializer.new(@blackout, root: false).as_json,
                             message: 'Blackout updated' },
                     status: :ok
            end
          else
            @variants =  @blackout.product.present? ? @blackout.product.variants : []
            format.html { render :edit, notice: "The Start and Finish Dates must be Present" }
            format.js do
              render json: { errors: @blackout.errors.full_messages, message: "Failed to update" },
                     status: :unprocessable_entity
            end
          end
        end
      else
        format.html { redirect_to events_url, :notice => "The Blackout does not exist" }
        format.json do
          render json: { message: "Blackout is not found" },
                 status: :not_found
        end
      end
    end
  end

  def destroy
    @blackout = @account.blackouts.where(:id => params[:id]).first
    @blackout = @account.events.where(id: params[:id], type: "OldBlackout").first if @blackout.blank?
    respond_to do |format|
      if @blackout.present?
        @blackout.delete
        format.html { redirect_to(events_url) }
        format.js do
          render json: { message: "Blackout deleted" },
                 status: :ok
        end
      else
        format.html { redirect_to events_url, :notice => "The Blackout does not exist" }
        format.json do
          render json: { message: "Blackout is not found" },
                 status: :not_found
        end
      end
    end

  end

private
  def find_products
    @products = @account.products.order("product_title")
    @variants = []
  end


  def blackout_params
    params.require(:blackout).permit(
      :id,
      :product_id,
      :variant_id,
      :all_day,
      :start,
      :finish
    )
  end
end
