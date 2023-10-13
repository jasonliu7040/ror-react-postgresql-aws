class TemplatesController < ApplicationController
  TEMPLATES = %w(customer new_booking search products calendar ticket new_booking_notification new_booking_confirmation)

  before_filter :find_template, only: [:show, :edit, :update, :destroy]
  include SpecificRendering

  def index
    @last_booking = @account.bookings.where('customer_id > 0').last

    @tmpls = {}
    TEMPLATES.each do |name|
      template = @account.template(name)
      @tmpls[template.name.downcase] = template
    end

    # clean up any new_reminder templates that were closed without a name
    @account.templates.reminders.where(name: nil).destroy_all

    @reminder_tmpls = @account.templates.reminders
  end

  def new_reminder
    @template = current_account.templates.reminders.new
    # @template.name = 'New Reminder'
    @template.body = File.read("#{Rails.root}/db/templates/reminder.liquid")
    if !@template.save
      Rails.logger.error("Failed to create default reminder body: #{@template.errors.full_messages}")
    end
    render action: :edit
  end

  def update
    if params[:preview]
      booking = current_account.bookings.last
      assigns = {'shop' => @account.external_shop, 'booking' => booking}
      @template.body = params[:template][:body]
      render :inline => @template.render(assigns)
    else
      respond_to do |format|
        if @template.update_attributes(template_params)
          flash[:notice] = 'Template saved'
          format.html { redirect_to edit_template_path(@template) }
          format.json { head :no_content }
        else
          format.html { redirect_to edit_template_path(@template) }
          format.json { render json: @template.errors.full_messages, status: :unprocessable_entity }
        end
      end
    end
  end

  def show
    if params[:booking].present?
      @last_booking = @account.bookings.find(params[:booking])
    else
      @last_booking = @account.bookings.where('customer_id > 0').last || @account.bookings.last
    end

    @assigns = {'shop' => @account.external_shop, 'booking' => @last_booking}
    @fields = MailFields.new(@template, @last_booking, current_account.external_shop)
    @content = @template.render(@assigns)
    respond_to do |format|
      format.html
      format.xml  { render :xml => @template }
    end
  end

  def site
    @tmpls = %w(customer search products calendar).map do |name|
      @account.template(name)
    end
  end

  def email
    @last_booking = @account.events.where(:type => ['Booking']).last(1).first
    @tmpls = ['reminder']
  end

  def destroy
    if @template.destroy
      flash[:notice] = 'Template deleted'
    else
      flash[:error] = template.errors
    end
    redirect_to action: :index
  end

  # def fetch_versions
  #   @tmpl = @account.templates.find_by_name(params[:template_name])

  #   respond_to do |format|
  #     format.js
  #   end
  # end

  # def rollback_template
  #   @tmpl = @account.templates.find_by_name(params[:template_name])
  #   @tmpl.rollback(params[:template_version]) if params[:template_version].present?

  #   render :update do |page|
  #     page << "$('#template_editor').val(#{@tmpl.body.inspect});"
  #   end
  # end

  private

  def template_params
    params.require(:template).permit(:id, :name, :channel, :category, :subject, :to, :cc, :bcc, :body, :attach_ticket, :attach_reminder)
  end

  def find_template
    @template = @account.templates.find_by(id: params[:id])
  end
end
