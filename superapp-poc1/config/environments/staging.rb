Rails.application.configure do
  config.cache_classes = true
  config.eager_load = true
  config.consider_all_requests_local = true
  
  # Asset handling
  config.assets.compile = true
  config.assets.digest = true
  config.assets.version = '1.0'
  config.assets.prefix = '/assets'
  config.serve_static_files = true
  
  # Add both builds and stylesheets to asset paths
  config.assets.paths << Rails.root.join("app", "assets", "builds")
  config.assets.paths << Rails.root.join("app", "assets", "stylesheets")
  
  # Force SSL off - let proxy handle SSL
  config.force_ssl = false
  
  # Allow all hosts
  config.hosts = nil
  
  # Serve static files
  config.public_file_server.enabled = true
  config.public_file_server.headers = {
    'Cache-Control' => 'public, max-age=31536000'
  }
end
