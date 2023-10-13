module TemplatesHelper

  def show_email_fields_for_template?(template)
    ['New Booking Confirmation', 'New Booking Notification'].include?(template.name) || template.reminder?
  end

  def template_channels_for_select
    TemplateChannel.labels
  end

end