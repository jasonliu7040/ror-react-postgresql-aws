class Dictionarable

  def self.values
    { }
  end

  def self.labels
    values.map{ |key, val| [val, key] }
  end

  def self.label(key)
    values[key]
  end
end