if ActiveRecord::Base.connection.table_exists? 'delayed_jobs'
  # Delayed::Worker.logger = Rails.logger
  Delayed::Worker.logger = Logger.new(File.join(Rails.root, 'log', 'delayed_job.log'))
  Delayed::Worker.delay_jobs = Rails.env.production? || Rails.env.staging?
  Delayed::Worker.destroy_failed_jobs = false
  Delayed::Worker.read_ahead = 10

  # retry any failed jobs (but not if something weird has happened to DJ and there are a ton of backed up jobs)
  if Delayed::Job.count < 100
    Delayed::Job.where('attempts > 0').each{|d| d.run_at = Time.now; d.attempts = 0; d.save!}
  end
end

