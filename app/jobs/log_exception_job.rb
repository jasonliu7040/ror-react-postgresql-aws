class LogExceptionJob < Struct
  include BookThatAppUtils

  def perform
    log_and_raise do
      logged_perform
    end
  end

  def logged_perform

  end
end
