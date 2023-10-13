require 'csv'
require 'set'

class ProductImport < ActiveRecord::Base
  belongs_to :shop
  serialize :capacity_options, Array

  attr_accessor :file # virtual field on model for form_for

  after_destroy :clean_up_dj

  has_attached_file :attachment, :s3_permissions => :private
  validates_attachment_file_name :attachment, matches: [/csv\Z/], :message => 'File must be of filetype .csv'
  do_not_validate_attachment_file_type :attachment

  state_machine :state, :initial => :pending do
    after_transition :on => :start, :do => :queue_job
    after_transition :on => :complete, :do => :remove_file

    event :start do
      transition :pending => :running
    end

    event :complete do
      transition :running => :completed
    end

    event :failed do
      transition :running => :completed
    end
  end

  def remove_file
    self.attachment = nil
    self.save
  end

  def queue_job
    job = ProductImportJob.new(shop.id, self.id)
    Delayed::Job.enqueue(job, :priority => 30)
  end

  def remaining_jobs
    Delayed::Job.where('handler like "%product_import_id: ?%" and handler like "%struct:ProductImportJob%" and attempts = 0', self.id).count
  end

  def clean_up_dj
    Delayed::Job.delete_all(["handler like '%product_import_id: ?%' and handler like '%struct:ProductImportJob%'", self.id])
  end
end
