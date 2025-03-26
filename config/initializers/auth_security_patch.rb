# Security patch to prevent bypassing device verification

module AuthControllerSecurityPatch
  def self.included(base)
    base.before_action :enforce_device_registration_security, only: [:check_device]
  end
  
  private
  
  def enforce_device_registration_security
    # Check for account_exists in URL or other indicators
    account_exists_page = request.referrer&.include?('account_exists') || 
                         request.path.include?('account_exists') ||
                         request.original_fullpath.include?('account_exists')
    
    # If on an account exists page, always set the flag and force verification
    if account_exists_page
      session[:device_registration_flow] = true
      logger.debug "SECURITY: Setting device_registration_flow due to account_exists URL"
    end
    
    # Never allow direct login from account exists flow - even on refresh
    if session[:device_registration_flow]
      # Add a special flag to the response headers to indicate verification is required
      response.headers['X-Verification-Required'] = 'true'
      
      # Force the next step to be verification
      params[:force_verification] = true
      
      logger.debug "SECURITY: Enforcing verification due to device_registration_flow"
    end
  end
end

# Apply security patch
Rails.application.config.to_prepare do
  Api::V1::AuthController.include(AuthControllerSecurityPatch)
end
