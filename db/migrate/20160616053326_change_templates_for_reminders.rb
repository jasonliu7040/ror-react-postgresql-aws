class ChangeTemplatesForReminders < ActiveRecord::Migration
  def change

    LiquidTemplate.where(category: TemplateCategory::REMINDER).each do |template|
      body = template.body
      body.gsub!(/{% for item in booking.items %}/,'{% assign items = booking.items | matching_times: reminder_trigger %}{% for item in items %}')
      body.gsub!(/upcoming booking on {{ booking.start \| date: "%m\/%d\/%Y %I:%M %p" }}/,'upcoming booking')
	    body.gsub!(/<li>{{ item.quantity }}/,'<li><strong>{{ item.start | date:"%m/%d/%Y %I:%M %p" }}-{{ item.finish | date: "%m/%d/%Y %I:%M %p" }}</strong> {{ item.quantity }}')
	    body.gsub!(/\(sku: {{ item.sku }}\){% endfor %}/,'(sku: {{ item.sku }})</li>{% endfor %}')
	    body.gsub!(/scheduled for {{ booking.start \| date: "%m\/%d\/%Y" }}/,'scheduled for {{ reminder_trigger.booking_start | date: "%m/%d/%Y" }}')
      template.body = body
      template.save
    end

  end
end
