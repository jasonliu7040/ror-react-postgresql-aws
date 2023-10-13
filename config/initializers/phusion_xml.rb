module ImprovedRewindableInput
  def readline(*args)
    make_rewindable unless @rewindable_io
    @rewindable_io.readline(*args)
  end

  def size
    make_rewindable unless @rewindable_io
    @rewindable_io.size
  end

  def getc
    make_rewindable unless @rewindable_io
    @rewindable_io.getc
  end

  def ungetc(*args)
    make_rewindable unless @rewindable_io
    @rewindable_io.ungetc(*args)
  end

  def eof?
    make_rewindable unless @rewindable_io
    @rewindable_io.eof?
  end

  def nil?
    make_rewindable unless @rewindable_io
    @rewindable_io.nil?
  end
end

if defined?(PhusionPassenger::Utils::RewindableInput)
  PhusionPassenger::Utils::RewindableInput.send(:include, ImprovedRewindableInput)
elsif defined?(Rack::RewindableInput)
  Rack::RewindableInput.send(:include, ImprovedRewindableInput)
end