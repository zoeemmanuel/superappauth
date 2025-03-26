module AuthSecurityFixes
  def self.included(base)
    base.class_eval do
      # Override the check_device method to add more comprehensive security checks
      alias_method :original_check_device, :check_device
      
      def check_device
        # Security fix: More accurate detection of device registration flows
        set_device_registration_state_from_request
        
        # Call the original method
        original_check_device
      end
      
      private
      
      def set_device_registration_state_from_request
        # More comprehensive check for device registration flow
        # This addresses the security vulnerability where a refresh could bypass verification
        is_device_registration = false
        
        # Check all the possible indicators of being in a device registration flow
        is_device_registration ||= request.referrer&.include?('account_exists')
        is_device_registration ||= params[:device_registration].present?
        is_device_registration ||= params.dig(:auth, :device_registration).present?
        is_device_registration ||= session[:device_registration_flow].present?
        is_device_registration ||= request.path.include?('account_exists')
        is_device_registration ||= request.original_fullpath.include?('account_exists')
        
        # Set a flag in session for the entire flow to maintain this state across refreshes
        if is_device_registration
          session[:device_registration_flow] = true
          Rails.logger.info "Setting device_registration_flow flag in session"
        end
      end
    end
  end
end

# Apply the security fix to the AuthController
Rails.application.config.to_prepare do
  Api::V1::AuthController.include(AuthSecurityFixes)
end
