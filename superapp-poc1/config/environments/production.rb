Rails.application.configure do
  config.cache_classes = true
  config.eager_load = true
  config.consider_all_requests_local = false
  
  # Asset handling
  config.assets.compile = false
  config.assets.digest = true
  config.assets.version = '1.0'
  config.assets.prefix = '/assets'
  
  # Add the builds directory to the asset paths
  config.assets.paths << Rails.root.join("app/assets/builds")
  
  # Disable force SSL
  config.force_ssl = false
  
  # Allow all hosts
  config.hosts = nil
  
  # Serve static files
  config.public_file_server.enabled = true
  config.public_file_server.headers = {
    'Cache-Control' => 'public, max-age=31536000'
  }
  
  # Logging
  config.log_level = :info
  config.log_tags = [ :request_id ]
  
  # Storage
  config.active_storage.service = :local
end
