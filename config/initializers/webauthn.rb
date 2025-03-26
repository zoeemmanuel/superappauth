WebAuthn.configure do |config|
  # Set your application name
  config.rp_name = "SuperApp"
  
  # Set the origin to your staging domain with SSL
config.allowed_origins = ["https://staging.superappproject.com"]
    
  # You can use environment-specific configuration if needed
  # if Rails.env.production?
  #   config.origin = "https://superappproject.com"  # Production domain
  # elsif Rails.env.staging? || Rails.env.development?
  #   config.origin = "https://staging.superappproject.com"  # Staging domain
  # else
  #   config.origin = "http://localhost:3000"  # Local development
  # end
end
