class AuthController < ApplicationController
  layout 'auth'
  skip_before_action :verify_authenticity_token, only: [:check_device]

def login
  logger.debug "========== LOGIN CHECK =========="
  logger.debug "Session: #{session.to_h}"
  logger.debug "Logging out?: #{session[:logging_out]}"
  
  # Add timestamp to prevent login check loops
  now = Time.current.to_f
  last_login_check = session[:last_login_check].to_f
  
  # If this is a rapid repeated check (within 1 second) AND we have a fully authenticated device, skip it
  if (now - last_login_check) < 1.0 && 
     session[:device_path] && 
     session[:current_handle] &&
     session[:device_session] == 'authenticated'
    logger.debug "====== SKIPPING RAPID LOGIN CHECK ======"
    redirect_to dashboard_path 
    return
  end
  
  # Set the timestamp for next check
  session[:last_login_check] = now

  # Check if user is actually logged in first
  if session[:device_path] && session[:current_handle] && session[:device_session] == 'authenticated'
    current_device_path = session[:device_path]
    device = get_device_from_path(current_device_path)
    
    # Verify device ownership by checking handle matches session
    if device && device[:handle] == session[:current_handle]
      logger.debug "Device found and authenticated - redirecting to dashboard"
      redirect_to dashboard_path
      return
    end
  end

  if session[:logging_out]
    logger.debug "No device or logging out - rendering login"
    session[:logging_out] = false # Clear logout state
    render :login
  else
    render :login
  end
end

  def logout_confirmation
    @handle = params[:handle]
    session[:logging_out] = true
    
    # Set cache headers
    response.headers['Cache-Control'] = 'no-store, no-cache'
    response.headers['Clear-Site-Data'] = '"storage"'
    response.headers['Pragma'] = 'no-cache'
    response.headers['Expires'] = '0'
    
    logger.debug "========== LOGOUT CONFIRMATION =========="
    logger.debug "Handle: #{@handle}"
    logger.debug "Session: #{session.to_h}"
    render layout: 'auth'
  end

  private

  def redirect_url(path)
    if request.ssl? || request.headers['X-Forwarded-Proto'] == 'https'
      "https://#{request.host_with_port}#{path}"
    else
      "http://#{request.host_with_port}#{path}"
    end
  end
end
