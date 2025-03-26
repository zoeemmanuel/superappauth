require_relative "boot"
require "rails/all"
Bundler.require(*Rails.groups)

module SuperappPoc1
  class Application < Rails::Application
    config.load_defaults 8.0
    
    # Add autoload path for services directory
    config.autoload_paths += %W(#{config.root}/app/services)
    
    # Allow all hosts in development/test, configure specific hosts in production
    config.hosts = [
      IPAddr.new("0.0.0.0/0"),        # Allow all IPs
      "superappproject.com",
      "www.superappproject.com",
      "localhost",
      "127.0.0.1"
    ]
    # Asset pipeline configuration
    config.assets.enabled = true
    config.assets.css_compressor = nil
    config.assets.js_compressor = nil
    
    # Explicitly add asset paths
    config.assets.paths << Rails.root.join("app", "assets", "builds")
    config.assets.paths << Rails.root.join("public", "assets")
  end
end
