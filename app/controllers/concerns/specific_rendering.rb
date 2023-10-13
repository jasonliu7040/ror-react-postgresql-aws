module SpecificRendering
  extend ActiveSupport::Concern

  def render(*args)
    dup_args = args.deep_dup
    options = dup_args.extract_options!
    if options[:nothing]
      super(*args)
    elsif options[:text] || options[:json] || is_doc?
      super(*args)
    else
      action = options[:action] || params[:action]
      ui_version( proc { super("#{params[:controller]}/v2/#{action}") },  proc { super(*args) } )
    end
  end

  def is_doc?
    params[:format].present? ||  ['xls', 'pdf', 'csv'].include?(params[:format])
  end

end

