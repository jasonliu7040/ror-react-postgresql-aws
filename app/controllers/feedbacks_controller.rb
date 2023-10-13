class FeedbacksController < ApplicationController
  def new
    @feedback = Feedback.new
  end

  def create
    @feedback = Feedback.new(params[:feedback])

    if @feedback.valid?
      flash[:notice] = "Thank you for your feedback."
      Notifier.delay.feedback_email(current_account, @feedback)
      redirect_to events_path
    else
      render :new
    end
  end
end
