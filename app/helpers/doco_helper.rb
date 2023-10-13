module DocoHelper
  def to_time(time)
    time_ago_in_words(Time.parse(time))
  end

  def to_time(time)
    Time.parse(time)
  end

  def themes_list
    files = Dir.entries(Rails.root.join('app', 'views', 'doco', 'themes_list'))
    files = files.reject {|f| File.directory?(f) || f[0].include?('.')}
    files.map do |f|
      partial = f.to_s[1..-1]
      id = partial.split('.')[0]
      { partial: partial, id: id }
    end
  end

  def yield_content!(content_key)
    view_flow.content.delete(content_key)
  end


end