class TermsController < ApplicationController
  before_filter :find_product
  before_filter :find_term, only: [:update, :edit, :destroy]
  include SpecificRendering

  def index
  end

  def new
    @term = @product.terms.build
    @term.build_schedule
    @term.schedule.recurring_items.build
  end

  def create
    @term = @product.terms.new(term_params)
    if @term.save
      respond_to do |format|
        format.html { redirect_to edit_product_term_path(@product, @term), notice: 'Term created' }
        format.js
        format.json { render :json => TermSerializer.new(@term).as_json.merge(message: 'Term created'), status: 201 }
      end
    else
      respond_to do |format|
        format.html { render :action => 'new' }
        format.js
        format.json { render :json => { message: @term.errors }, status: 500 }
      end
    end
  end

  def edit
    @term.build_schedule if @term.schedule.blank?
    @term.schedule.recurring_items.build if @term.schedule.recurring_items.blank?
  end

  def update
    if @term.update_attributes(term_params)
      respond_to do |format|
        format.html { redirect_to(edit_product_term_path, :notice => 'Term updated') }
        format.js
        format.json { render :json => TermSerializer.new(@term).as_json.merge(message: 'Term updated'), status: 200 }
      end 
    else
      respond_to do |format|
        format.html { render :action => 'edit' }
        format.json { render :json => { message: @term.errors }, status: 500 }
      end
    end
  end

  def destroy
    if @term.present?
      @term.destroy
      render :json => {:item => 'Term destroyed'}
    else
      render_json_error('Term was not found')
    end
  end

  private

  def find_product
    @product = Product.find(params[:product_id])
  end

  def find_term
    @term = @product.terms.where(id: params[:id]).first
  end

  def term_params
    params.require(:term).permit( :start_date, :finish_date, :name,
                                    schedule_attributes: [:id, :schedulable_id, :schedulable_type,
                                                          oneoff_items_attributes: [:id, :schedule_id, :start, :finish, :_destroy],
                                                          recurring_items_attributes: [:id, :schedule_id, :schedule_yaml, :_destroy, schedule_ical: [:startDateTime, :recurrencePattern]]
                                    ]
    )
  end

end