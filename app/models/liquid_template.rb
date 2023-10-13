require "rexml/document"
class TemplateCategory
  REMINDER = 'reminder'
end

class TemplateChannel < Dictionarable
  SMS = 'sms'
  EMAIL = 'email'

  def self.values
    {
        EMAIL => 'Email',
        SMS => 'SMS'
    }
  end
end

class LiquidTemplate < ActiveRecord::Base
  MAX_TEMPLATES_PER_SHOP   = 10
  TOO_MUCH_TEMPLATES_ERROR = "Maximum number of templates is #{MAX_TEMPLATES_PER_SHOP}! You need to delete another template before you are able to create a new one."
  STANDARD_FILTERS = [Liquid::StandardFilters, MoneyFilter, StringProcessingFilter, ShopFilter, TagFilter, WeightFilter, JsonFilter, UrlFilter]

  belongs_to :shop
  has_many :versions, -> { order('version DESC') }, :class_name => 'LiquidTemplateVersion', :dependent => :delete_all
  has_many :reminder_configs, dependent: :destroy

  validates_presence_of :shop_id
  validates_length_of   :name, :within => 2..24, :on => :update
  validates_length_of   :body, :maximum => 64.kilobytes, :message => 'cannot exceed 64kb in length', :if => lambda {|template| template.channel != TemplateChannel::SMS }
  validates_length_of   :body, :maximum => 160, :message => 'cannot exceed 160 characters in length', :if => lambda {|template| template.channel == TemplateChannel::SMS }
  validates_uniqueness_of :name, :scope => :shop_id, :message => 'already exists'
  validate :syntax_ok

  before_update :store_current_version

  default_scope { order("id ASC") }
  scope :reminders, -> { where( category: TemplateCategory::REMINDER ) }

  def parse
    Liquid::Template.parse(body)
  end

  def syntax_ok
    begin
      Liquid::Template.parse(self.body, {line_numbers: true})
    rescue Liquid::SyntaxError => e
      errors.add(:body, e.message)
    end

    # # tests markup is valid html
    # begin
    #   REXML::Document.new("<body>#{self.body.gsub(/& /, '&amp;')}</body>")
    # rescue REXML::ParseException => pe
    #   # format message to look like liquid syntax error message
    #   lines = pe.message.lines
    #   errors.add(:body, "#{lines[0]} (line #{lines[1].split(':').last.to_i}, position #{lines[2].split(':').last.to_i})")
    # end
  end

  def render(assigns)
    begin
      shop.external do
        template = parse
        result = template.render(assigns, STANDARD_FILTERS)
        if template.errors
          template.errors.each do |exception|
            Rails.logger.debug "****** EXCEPTION RENDERING LIQUID TEMPLATE ********"
            Rails.logger.debug("\n\n#{exception.class} (#{exception.message}):\n    " + exception.backtrace.join("\n    ") + "\n\n")
          end
        end
        result
      end
    rescue => e
      Rails.logger.error "Error: #{e.message}"
      Rails.logger.error("\n\n#{e.class} (#{e.message}):\n    " + e.backtrace.join("\n    ") + "\n\n")
      ExceptionNotifier.notify_exception(e)
      Rollbar.notifier.log('error', e)
      raise e
    end
  end

  def highest_version_number
    versions.maximum(:version) || 0
  end

  def reminder?
    self.category == TemplateCategory::REMINDER
  end
  # def version_numbers
  #   @version_numbers ||= versions.find(:all, :select => [ "version" ], :order => 'version DESC').collect(&:version)
  # end

  # def rollback(version)
  #   if version = versions.find_by_version(version)
  #     self.body = version.body
  #   else
  #     raise ActiveRecord::RecordNotFound, "Could not find version #{version}"
  #   end
  # end


  protected

  # def validate
  #   if shop.templates.count > MAX_TEMPLATES_PER_SHOP
  #     errors.add_to_base(TOO_MUCH_TEMPLATES_ERROR)
  #   #else
  #   #  success, message = check_syntax
  #   #  errors.add_to_base(message) unless success
  #   end
  # end

  private

  def store_current_version
    return unless body_changed?
    versions.create(:body => body_was, :version => highest_version_number + 1)
  end
end
