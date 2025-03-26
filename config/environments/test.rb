Rails.application.configure do
  # Settings specified here will take precedence over those in config/application.rb.
  config.hosts.clear
  config.hosts << "superappproject.com"
  config.hosts << "www.example.com"
  config.cache_classes = false
  config.eager_load = false
  config.cache_store = :memory_store
  config.public_file_server.enabled = true
  config.action_controller.perform_caching = false
  config.action_dispatch.show_exceptions = false
  config.action_controller.allow_forgery_protection = false
  config.active_support.deprecation = :stderr
  config.active_support.disallowed_deprecation = :raise
  config.active_support.disallowed_deprecation_warnings = []
  config.action_mailer.perform_caching = false
  config.action_mailer.delivery_method = :test
  config.active_job.queue_adapter = :test
end
