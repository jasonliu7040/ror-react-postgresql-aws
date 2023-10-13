class MailFields
  def initialize(template, booking, external)
    @template = template
    @booking = booking
    @external = external
    @assigns = {'booking' => @booking}
  end

  def subject
    subject_template = @template.subject.blank? ?  'Booking Reminder' : @template.subject
    Liquid::Template.parse(subject_template).render(@assigns)
  end

  def from
    @external.customer_email.nil? ? @external.email : @external.customer_email
  end

  def to
    parsed = parse_email_template(@template.to, @assigns)
    unless parsed.present?
      parsed = @booking.email
    end
    parsed
  end

  def cc
    parse_email_template(@template.cc, @assigns)
  end

  def bcc
    parse_email_template(@template.bcc, @assigns)
  end

  private
  def parse_email_template(template, render_hash)
    addresses = template.blank? ? [] : Liquid::Template.parse(template).render(render_hash).split(',').map(&:strip).uniq
    addresses.join(',')
  end
end