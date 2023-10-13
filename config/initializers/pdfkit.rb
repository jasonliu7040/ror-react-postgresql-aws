ActionController::Base.asset_host = Proc.new { |source, request|
  if request.env["REQUEST_PATH"] && (request.env["REQUEST_PATH"].include? ".pdf")
    "file://#{Rails.root.join('public')}"
  else
    "#{request.protocol}#{request.host_with_port}"
  end
}

PDFKit.configure do |config|
  if Rails.env.development? || Rails.env.test?
    config.wkhtmltopdf = '/usr/local/bin/wkhtmltopdf'
  else
    config.wkhtmltopdf = Rails.root.join('bin', 'wkhtmltopdf').to_s
  end

  #config.default_options = {
  #   :print_media_type => true
  #}
  #config.root_url = "http://localhost" # Use only if your external hostname is unavailable on the server.

  config.default_options[:quiet] = false
end
