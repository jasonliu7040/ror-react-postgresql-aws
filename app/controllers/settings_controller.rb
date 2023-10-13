class SettingsController < ApplicationController
  include SpecificRendering

  def index
    @account.external do
      @scripts = scripts()
      @hooks = hooks()
    end

    unless @account.settings.theme
      @account.settings.theme = 'smoothness'
    end
  end

  def hours
    @hours = JSON.parse(current_account.opening_hours)
  end

  def scripts
    Rails.cache.fetch("#{@account.subdomain}/scripts", :expires_in => 10.minutes) { ShopifyAPI::ScriptTag.find(:all) || [] }
  end

  def hooks
    Rails.cache.fetch("#{@account.subdomain}/hooks", :expires_in => 10.minutes) { ShopifyAPI::Webhook.find(:all) || [] }
  end

  def update
    if params[:reset_timezone]
      reset_timezone
    elsif  params[:reset_system]
      reset_system
    elsif  params[:reset_products]
      reset_products
    else
      update_settings
    end

    redirect_to :action => 'index'
  end

  def update_settings
    if @account.update_attributes(shop_params)
      flash[:notice] = "Changes saved"
    else
      flash[:error] = @account.errors.full_messages.join("\n")
      logger.error @account.errors.full_messages.join("\n")
    end
  end

  def update_hours
    respond_to do |format|
      format.html do
        if shop_params && shop_params[:opening_hours]
          shop = Shop.find(shop_params[:id])
          if shop.update_attribute(:opening_hours, shop_params[:opening_hours])
            shop.notifier "Opening Hours were changed", {:actionable => false} #don't love this spot but works and is most appropriate for now.
            flash[:notice] = "Changes saved"
          else
            flash[:error] = @account.errors.full_messages.join("\n")
            logger.error @account.errors.full_messages.join("\n")
          end
        end

        redirect_to :action => 'hours'
      end
      format.js do
        if shop_params && shop_params[:opening_hours]
          shop = Shop.find(shop_params[:id])
          if shop.update_attribute(:opening_hours, shop_params[:opening_hours])
            render json: {notifier: "Opening Hours were changed", notice: "Changes saved"}
          else
            render json: {errors: @account.errors.full_messages.join("\n")}
            logger.error @account.errors.full_messages.join("\n")
          end
        end
      end
    end
  end

  private

  def reset_timezone
    @account.resync_timezone
    flash[:notice] = "Timezone synchronized"
  end

  def reset_products
    @account.resync_products
    flash[:notice] = "Product synchronization scheduled"
  end

  def reset_system
    @account.install
    flash[:notice] = "Script/Webhooks reinstalled"
  end

  def shop_params
    params.require(:shop).permit(
      :id,
      {:settings => [
         :message_booked_out,
         :message_blacked_out,
         :message_unscheduled,
         :message_unavailable,
         :message_closed,
         :quantity_range,
         :reminder_time,
         :theme,
         :region,
         :df
      ]},
      :send_reminders,
      :allow_waitlist,
      :opening_hours,
      :consolidate_bookings,
      :reminder_configs_attributes => [:id, :duration, :trigger_type, :liquid_template_id, :_destroy]
    )
  end
end
