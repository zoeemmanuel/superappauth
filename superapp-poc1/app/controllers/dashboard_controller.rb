class DashboardController < ApplicationController
  before_action :ensure_authenticated
  skip_before_action :verify_authenticity_token, only: [:update_handle, :logout, :reset_devices]
  
  def index
    logger.debug "========== DASHBOARD INDEX =========="
    logger.debug "Session: #{session.to_h}"
    logger.debug "Current Device Info: #{current_device.inspect}"
    
    @device_info = current_device
    if @device_info
      logger.debug "Device found - rendering dashboard"
    else
      logger.debug "No device info - redirecting"
      redirect_to root_path
    end
  end

def logout
  logger.debug "========== LOGOUT INITIATED =========="
  logger.debug "Before - Session: #{session.to_h}"
  logger.debug "Current Device: #{current_device.inspect}"
  
  if current_device
    handle = current_device[:handle]
    guid = current_device[:guid]
    phone = current_device[:phone]
    device_path = session[:device_path] || session[:pending_device_path]
    logger.debug "Device path before logout: #{device_path}"
    
    # Store essential user information before clearing session
    previous_handle = handle
    previous_guid = guid
    previous_phone = phone
    
    # Clear all session data
    reset_session
    
    # Add user identification for future recognition
    session[:previous_handle] = previous_handle
    session[:previous_guid] = previous_guid 
    session[:previous_phone] = previous_phone
    session[:previous_device_path] = device_path
    session[:logging_out] = true
    
    # Add Cache-Control headers
    response.headers['Cache-Control'] = 'no-store, no-cache'
    response.headers['Clear-Site-Data'] = '"storage"'
    response.headers['Pragma'] = 'no-cache'
    response.headers['Expires'] = '0'
    logger.debug "Headers set: #{response.headers.to_h}"
    
    logger.debug "After - Session: #{session.to_h}"
    
    respond_to do |format|
      format.html { 
        logger.debug "Rendering HTML logout response"
        render inline: %{
          <script>
            (function() {
              console.log('Starting client-side logout cleanup');
              // Store user info for future recognition
              localStorage.setItem('previous_handle', '#{previous_handle}');
              // Mark logout in progress
              sessionStorage.setItem('logging_out', 'true');
              // Clear storage
              sessionStorage.removeItem('device_key');
              // Stop any pending requests
              window.stop();
              console.log('Storage cleared, redirecting to logout confirmation');
              window.location.href = '#{logout_confirmation_path(handle: previous_handle)}';
            })();
          </script>
        }
      }
      format.json { 
        logger.debug "Rendering JSON logout response"
        render json: { 
          status: 'success', 
          clear_storage: true,
          previous_handle: previous_handle,
          logging_out: true,
          redirect_to: logout_confirmation_path(handle: previous_handle)
        } 
      }
      end
      logger.debug "Logout response rendered successfully"
    else
      logger.debug "No current device found for logout"
      respond_to do |format|
        format.html { redirect_to(root_url(protocol: request.protocol)) }
        format.json { 
          render json: { 
            status: 'error', 
            message: 'Not authenticated' 
          }, 
          status: :unauthorized 
        }
      end
    end
    logger.debug "========== LOGOUT COMPLETE =========="
  end

def reset_devices
  logger.debug "========== RESET DEVICES =========="
  
  begin
    if current_device
      current_handle = current_device[:handle]
      user = User.find_by(handle: current_handle)
      logger.debug "Current user: #{user.inspect}"
      
      if user
        # Store phone before deletion for cleanup
        phone = user.phone
        guid = user.guid
        
        # First delete all device databases
        Dir.glob(Rails.root.join('db', 'devices', '*.sqlite3')).each do |db_path|
          begin
            logger.debug "Checking device: #{db_path}"
            db = SQLite3::Database.new(db_path)
            
            # Check for both handle and guid matches
            device_info = db.get_first_row(
              "SELECT handle, guid, phone FROM device_info WHERE handle = ? OR guid = ?", 
              [user.handle, user.guid]
            )
            db.close
            
            if device_info
              logger.debug "Found matching device, clearing data"
              # Clear data before deletion
              db = SQLite3::Database.new(db_path)
              db.execute("UPDATE device_info SET handle = NULL, guid = NULL, phone = NULL")
              db.execute("DELETE FROM sync_state")
              db.close
              
              logger.debug "Deleting device database: #{db_path}"
              File.delete(db_path)
            end
          rescue SQLite3::Exception => e
            logger.error "Error cleaning device database: #{e.message}"
          end
        end

        # Delete the user and any related users
        logger.debug "Deleting user: #{user.inspect}"
        user.destroy
        
        # Cleanup any other users with same phone/guid
        User.where(phone: phone).destroy_all if phone
        User.where(guid: guid).destroy_all if guid
      end

      # Clear all session and device data
      reset_session
      revoke_device
      cookies.clear
      
      # Set strong cache control headers to prevent browser caching
      response.headers['Cache-Control'] = 'no-store, no-cache, must-revalidate, max-age=0'
      response.headers['Pragma'] = 'no-cache'
      response.headers['Expires'] = '0'
      response.headers['Clear-Site-Data'] = '"storage"'
      
      logger.debug "Reset complete - redirecting to initial phone flow"
      respond_to do |format|
        format.html { 
          # Add script to clear storage before redirect with delay
          render inline: "<script>
            console.log('Resetting device...');
            localStorage.setItem('resetting_devices', 'true');
            localStorage.removeItem('authenticated_user');
            localStorage.removeItem('superapp_tab_id');
            localStorage.removeItem('loop_detected');
            sessionStorage.clear();
            localStorage.clear();
            
            // Add a delay before redirecting
            setTimeout(function() {
              console.log('Redirecting after reset...');
              window.location.href = '#{root_path}?reset=#{Time.now.to_i}';
            }, 500);
          </script>",
          flash: { reset: true, message: 'All devices have been reset' }
        }
        format.json { 
          render json: { 
            status: 'success',
            clear_storage: true,
            redirect_to: "#{root_path}?reset=#{Time.now.to_i}",
            message: 'All devices have been reset'
          } 
        }
      end
    else
      # Add cache control headers even for redirection
      response.headers['Cache-Control'] = 'no-store, no-cache, must-revalidate, max-age=0'
      response.headers['Pragma'] = 'no-cache'
      response.headers['Expires'] = '0'
      
      redirect_to root_path(reset: Time.now.to_i)
    end
  rescue => e
    logger.error "Error during reset: #{e.message}"
    logger.error e.backtrace.join("\n")
    
    # Add cache control headers even for error responses
    response.headers['Cache-Control'] = 'no-store, no-cache, must-revalidate, max-age=0'
    response.headers['Pragma'] = 'no-cache'
    response.headers['Expires'] = '0'
    
    respond_to do |format|
      format.html { 
        # Include script to clear storage even on error with delay
        render inline: "<script>
          console.log('Error during reset, clearing storage...');
          localStorage.removeItem('authenticated_user');
          localStorage.removeItem('superapp_tab_id');
          sessionStorage.clear();
          localStorage.clear();
          
          // Add a delay before redirecting
          setTimeout(function() {
            window.location.href = '#{root_path}?reset_error=true';
          }, 500);
        </script>",
        flash: { error: 'Error during reset, please try again' } 
      }
      format.json { 
        render json: { 
          status: 'error', 
          message: 'Reset failed', 
          clear_storage: true,
          redirect_to: "#{root_path}?reset_error=true" 
        }, 
        status: :internal_server_error 
      }
    end
  end
end

def reset_device
  # Get the current device path from session
  current_device_path = session[:device_path]
  
  if current_device_path && File.exist?(Rails.root.join('db', current_device_path))
    begin
      # Get device info before clearing it
      current_device_id = session[:current_device_id]
      current_handle = session[:current_handle]
      
      # Reset the device database (remove user associations but keep the device ID)
      db = SQLite3::Database.new(Rails.root.join('db', current_device_path))
      db.transaction do
        db.execute("UPDATE device_info SET handle = NULL, phone = NULL, guid = NULL, last_verified_at = NULL")
        db.execute("INSERT OR REPLACE INTO sync_state (id, last_sync, status) VALUES (1, ?, 'reset')", [Time.current.iso8601])
      end
      db.close
      
      # Log the device reset
      logger.info "Device reset: #{current_device_id} for user #{current_handle}"
      
      # Clear session data
      reset_session
      
      # Return success
      render json: { 
        success: true, 
        message: "Device has been reset successfully" 
      }, status: :ok
    rescue StandardError => e
      logger.error "Error resetting device: #{e.message}"
      render json: { 
        error: "Failed to reset device: #{e.message}" 
      }, status: :internal_server_error
    end
  else
    logger.error "No device information found for reset"
    render json: { 
      error: "No device information found" 
    }, status: :not_found
  end
end

  def update_handle
    logger.debug "========== UPDATE HANDLE =========="
    new_handle = params[:handle].strip
    logger.debug "New handle requested: #{new_handle}"
    
    unless new_handle.start_with?('@')
      return render json: { error: 'Handle must start with @' }, status: :unprocessable_entity
    end

    # Get current device and handle
    device = current_device
    return render json: { error: 'Device not found' }, status: :not_found unless device
    
    current_handle = device[:handle] || session[:current_handle]
    user = User.find_by(handle: current_handle)
    logger.debug "Current user: #{user.inspect}"

    # Create user if doesn't exist
    unless user
      user = User.new(
        handle: new_handle,
        phone: device[:phone],
        guid: device[:guid] || SecureRandom.uuid
      )
    end

    if User.where(handle: new_handle).where.not(id: user.id).exists?
      return render json: { error: 'Handle already taken' }, status: :unprocessable_entity
    end

    ActiveRecord::Base.transaction do
      user.update!(handle: new_handle)
      logger.debug "User updated with new handle"

      Dir.glob(Rails.root.join('db', 'devices', '*.sqlite3')).each do |db_path|
        begin
          logger.debug "Updating device: #{db_path}"
          db = SQLite3::Database.new(db_path)
          # Match by either old handle or guid
          db.execute(
            "UPDATE device_info SET handle = ?, guid = ? WHERE handle = ? OR guid = ?",
            [new_handle, user.guid, current_handle, user.guid]
          )
          if db.changes > 0
            logger.debug "Device updated, updating sync state"
            db.execute(
              "INSERT INTO sync_state (last_sync, status) VALUES (?, ?)",
              [Time.current.iso8601, 'handle_updated']
            )
          end
          db.close
        rescue SQLite3::Exception => e
          logger.error "Error updating device database: #{e.message}"
        end
      end

      session[:current_handle] = new_handle

      render json: { 
        status: 'success',
        handle: new_handle
      }
    end
  rescue ActiveRecord::RecordInvalid => e
    logger.error "Handle update failed: #{e.message}"
    render json: { error: e.message }, status: :unprocessable_entity
  end

  private

  def ensure_authenticated
    logger.debug "========== DASHBOARD AUTH CHECK =========="
    logger.debug "Session: #{session.to_h}"
    logger.debug "Current Device: #{current_device.inspect}"
    
    unless current_device
      logger.debug "Authentication failed - no current device"
      revoke_device
      respond_to do |format|
        format.html { redirect_to(root_url(protocol: request.protocol)) }
        format.json { render json: { error: 'Not authenticated' }, status: :unauthorized }
      end
    else
      logger.debug "Authentication successful"
    end
  end
end
