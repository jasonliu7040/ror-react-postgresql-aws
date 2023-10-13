module PresenterHelper
  COLORS = [ '#ff6a6a', '#8470ff', '#5d478b', '#ff4500', '#9acd32', '#fff630', '#fa3618', '#43ff7f', '#006bff', '#ff6701' ]

  def random_color
    COLORS[rand(COLORS.length)]
  end

  def format_time(time)
    time.strftime("%Y-%m-%d %H:%M")
  end
end