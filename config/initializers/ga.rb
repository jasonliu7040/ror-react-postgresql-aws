GOOGLE_ANALYTICS_SETTINGS = HashWithIndifferentAccess.new

config = YAML.load_file(Rails.root.join("config", "ga.yml"))[Rails.env]
if config
  GOOGLE_ANALYTICS_SETTINGS.update(config)
end