class DashboardController < ApplicationController
  before_action :ensure_authenticated
  skip_before_action :verify_authenticity_token, only: [:update_handle, :logout, :reset_devices]
  
def index
  logger.debug "========== DASHBOARD INDEX =========="
  logger.debug "Session: #{session.to_h}"

 # Check if we need to redirect to complete registration
  if current_device && !current_device[:handle].present?
    logger.debug "Device has no user - redirecting to login to complete registration"
    redirect_to root_path
    return
  end
  
  # If we have a device ID but no handle, try to restore handle from database
  if current_device && !current_device[:handle] && session[:current_device_id]
    logger.debug "Device found but no handle - checking for handle in DB"
    
    # Try to find the handle from DB
    Dir.glob(Rails.root.join('db', 'devices', '*.sqlite3')).each do |db_path|
      begin
        db = SQLite3::Database.new(db_path)
        user_info = db.get_first_row("SELECT handle, guid, phone FROM device_info 
                                     WHERE device_id = ? LIMIT 1", 
                                     [session[:current_device_id]])
        
        if user_info && user_info[0]
          logger.debug "Found handle in database: #{user_info[0]}"
          # Update current device with handle
          @current_device = current_device.merge(handle: user_info[0], guid: user_info[1], phone: user_info[2])
          session[:current_handle] = user_info[0]
          session[:current_guid] = user_info[1]
          session[:current_phone] = user_info[2]
          break
        end
        
        db.close
      rescue SQLite3::Exception => e
        logger.error "Error checking device database: #{e.message}"
      end
    end
  end
  
  # Continue with the original index method
  logger.debug "Current Device Info: #{current_device.inspect}"
  
  # NEW: Explicit check against user's auth_version
  return unless reset_check 
  
  # Use application controller's current_device
  @device_info = current_device

  if current_device && current_device[:handle]
    @user = User.find_by(handle: current_device[:handle])
    if @user && @user.sessions_valid_after.present? &&
      (session[:login_time].blank? || Time.parse(session[:login_time].to_s) < @user.sessions_valid_after)
      logger.debug "Session invalidated by device reset"
      reset_session
      redirect_to root_path(session_invalidated: true)
      return
    end
    logger.debug "User PIN status: #{@user&.pin_set? ? 'Enabled' : 'Not Set'}"
  end
  
  # Fetch user devices for the Your Devices section
  if @user
    @user_devices = fetch_user_devices
    logger.debug "Fetched #{@user_devices.length} devices for user"
  end
  
  if @device_info
    logger.debug "Device found - rendering dashboard"
  else
    logger.debug "No device info - redirecting"
    redirect_to root_path
  end
end

def reset_check
  logger.debug "========== DASHBOARD RESET CHECK =========="
  
  if current_device && current_device[:handle]
    user = User.find_by(handle: current_device[:handle])
    
    # Verify user exists and has valid auth data
    if !user
      logger.warn "User from session not found in database"
      reset_session
      redirect_to root_path(error: "User not found")
      return false
    end
    
    # Check for session invalidation
    if user.sessions_valid_after.present? &&
       (session[:login_time].blank? || Time.parse(session[:login_time].to_s) < user.sessions_valid_after)
      logger.warn "Session invalidated by device reset"
      reset_session
      redirect_to root_path(session_invalidated: true)
      return false
    end
  end
  
  true
end

def link_device
  @code = params[:code]
  render 'link_device'
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
        # MODIFIED: Explicitly update BOTH auth_version AND sessions_valid_after
        logger.debug "Updating both auth_version AND sessions_valid_after to invalidate all sessions"
        user.update(
          auth_version: Time.current.to_i,
          sessions_valid_after: Time.current
        )
        logger.debug "Updated auth_version: #{user.auth_version}, sessions_valid_after: #{user.sessions_valid_after}"
        
        # Store phone and guid before deletion
        phone = user.phone
        guid = user.guid
        
        # Process all device databases for this user
        devices_reset = 0
        devices_found = 0
        
        Dir.glob(Rails.root.join('db', 'devices', '*.sqlite3')).each do |db_path|
          begin
            logger.debug "Checking device: #{db_path}"
            db = SQLite3::Database.new(db_path)
            
            # Check if required tables exist
            tables_exist = db.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='device_info'").any? rescue false
            
            if tables_exist
              # Check for both handle and guid matches
              device_info = db.get_first_row(
                "SELECT handle, guid, phone, device_id FROM device_info WHERE handle = ? OR guid = ?", 
                [user.handle, user.guid]
              )
              
              if device_info
                logger.debug "Found matching device, clearing completely"
                devices_found += 1
                
                # Completely reset device database
                begin
                  # Backup device ID for preservation
                  device_id = device_info[3] rescue nil
                  
                  # Completely clear device_info
                  db.execute("DELETE FROM device_info")
                  
                  # Recreate with only device_id
                  if device_id
                    db.execute(
                      "INSERT INTO device_info (device_id, created_at) VALUES (?, ?)",
                      [device_id, Time.current.iso8601]
                    )
                  end
                  
                  # Clear all related tables
                  ["device_characteristics", "browser_keys", "sync_state"].each do |table|
                    has_table = db.execute("SELECT name FROM sqlite_master WHERE type='table' AND name=?", [table]).any? rescue false
                    if has_table
                      db.execute("DELETE FROM #{table}")
                    end
                  end
                  
                  # Add reset marker
                  has_sync_table = db.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='sync_state'").any? rescue false
                  if has_sync_table
                    db.execute(
                      "INSERT INTO sync_state (last_sync, status) VALUES (?, 'complete_reset')", 
                      [Time.current.iso8601]
                    )
                  end
                  
                  devices_reset += 1
                  logger.debug "Device database completely reset: #{db_path}"
                rescue SQLite3::Exception => e
                  logger.error "Error performing full reset on device: #{e.message}"
                end
              end
            end
            
            db.close
          rescue SQLite3::Exception => e
            logger.error "Error cleaning device database: #{e.message}"
          end
        end

        # Delete the user record completely
        logger.debug "Deleting user account: #{user.handle}"
        user.destroy
        
        # Clean up any other users with same phone/guid for completeness
        User.where(phone: phone).destroy_all if phone
        User.where(guid: guid).destroy_all if guid
        
        logger.debug "User account and all associated data deleted"

        # Clear session
        reset_session
        
        # Set broadcast token
        reset_token = SecureRandom.hex(8)
        
        # Set cache control headers
        response.headers['Cache-Control'] = 'no-store, no-cache, must-revalidate, max-age=0'
        response.headers['Pragma'] = 'no-cache'
        response.headers['Expires'] = '0'
        response.headers['Clear-Site-Data'] = '"storage"'
        
        logger.debug "Reset complete - redirecting to initial phone flow"
        respond_to do |format|
          format.html { 
            render inline: %{
              <html>
              <head><title>Account Reset</title></head>
              <body>
                <h1>Resetting Account and All Devices...</h1>
                <script>
                  console.log('Performing complete account reset...');
                  
                  // CRITICAL: Remove authentication flag first
                  localStorage.removeItem('authenticated_user');
                  
                  // Broadcast reset to other tabs
                  localStorage.setItem('device_reset_broadcast', '#{reset_token}');
                  localStorage.setItem('device_reset', 'true');
                  localStorage.setItem('resetting_devices', 'true');
                  
                  // Clear all client-side data
                  try {
                    // Remove all auth and device related items explicitly
                    localStorage.removeItem('authenticated_user');
                    localStorage.removeItem('superapp_tab_id');
                    localStorage.removeItem('loop_detected');
                    localStorage.removeItem('device_key');
                    localStorage.removeItem('device_header');
                    localStorage.removeItem('device_id');
                    localStorage.removeItem('device_guid');
                    
                    // Clear all storage
                    sessionStorage.clear();
                    localStorage.clear();
                    
                    // Force removal of each key individually
                    Object.keys(localStorage).forEach(function(key) {
                      console.log('Removing localStorage key:', key);
                      localStorage.removeItem(key);
                    });
                    
                    // Clear cookies
                    document.cookie.split(';').forEach(function(c) {
                      document.cookie = c.trim().split('=')[0] + '=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;';
                    });
                    
                    console.log('All client-side storage cleared');
                  } catch(e) {
                    console.error('Error clearing storage:', e);
                  }
                  
                  // Redirect after a delay
                  setTimeout(function() {
                    console.log('Account reset complete, redirecting to login...');
                    window.location.href = '#{root_path}?complete_reset=#{Time.now.to_i}';
                  }, 1000);
                </script>
              </body>
              </html>
            }
          }
          format.json { 
            render json: { 
              status: 'success',
              clear_storage: true,
              reset_broadcast: reset_token,
              redirect_to: "#{root_path}?complete_reset=#{Time.now.to_i}",
              message: "Account and all devices have been completely reset (#{devices_reset} of #{devices_found} devices)"
            } 
          }
        end
      else
        logger.error "User not found"
        redirect_to root_path
      end
    else
      redirect_to root_path(reset: Time.now.to_i)
    end
  rescue => e
    logger.error "Error during reset: #{e.message}"
    logger.error e.backtrace.join("\n")
    
    respond_to do |format|
      format.html { 
        render inline: %{
          <script>
            console.log('Error during reset, clearing storage...');
            
            // Still try to remove authentication flag
            localStorage.removeItem('authenticated_user');
            
            // And clear all storage
            localStorage.clear();
            sessionStorage.clear();
            
            setTimeout(function() {
              window.location.href = '#{root_path}?reset_error=true';
            }, 500);
          </script>
        },
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
  logger.debug "========== RESET DEVICE =========="
  
  current_device_path = session[:device_path]
  current_device_id = session[:current_device_id]
  current_handle = session[:current_handle]
  
  logger.debug "Device path: #{current_device_path}"
  logger.debug "Device ID: #{current_device_id}"
  logger.debug "User handle: #{current_handle}"
  
  if current_device_path && File.exist?(Rails.root.join('db', current_device_path))
    begin
      # MODIFIED: Only update auth_version, not sessions_valid_after
      if current_handle.present?
        user = User.find_by(handle: current_handle)
        if user
          logger.debug "Updating auth_version ONLY for user #{current_handle} (not invalidating other sessions)"
          # Only update auth_version to track the change without invalidating other sessions
          user.update(auth_version: Time.current.to_i)
          logger.debug "Updated auth_version: #{user.auth_version}"
        end
      end
      
      # Reset the device database
      db = SQLite3::Database.new(Rails.root.join('db', current_device_path))
      
      # Log existing device info before reset
      begin
        device_info = db.get_first_row("SELECT device_id, handle, guid, phone FROM device_info LIMIT 1")
        logger.debug "Device info before reset: #{device_info.inspect}"
        
        # Backup device ID for preservation
        device_id = device_info ? device_info[0] : nil
      rescue => e
        logger.error "Error reading device info: #{e.message}"
        device_id = nil
      end
      
      # Aggressively reset the device database
      db.transaction do
        # Completely clear device_info
        db.execute("DELETE FROM device_info")
        
        # Recreate with only device_id to maintain structural integrity
        if device_id
          db.execute(
            "INSERT INTO device_info (device_id, created_at) VALUES (?, ?)",
            [device_id, Time.current.iso8601]
          )
        end
        
        # Clear device_characteristics if it exists
        has_char_table = db.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='device_characteristics'").any? rescue false
        if has_char_table
          logger.debug "Clearing device_characteristics table"
          db.execute("DELETE FROM device_characteristics")
        end
        
        # Clear browser_keys if it exists
        has_browsers_table = db.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='browser_keys'").any? rescue false
        if has_browsers_table
          logger.debug "Clearing browser_keys table"
          db.execute("DELETE FROM browser_keys")
        end
        
        # Clear and update sync_state if it exists
        has_sync_table = db.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='sync_state'").any? rescue false
        if has_sync_table
          logger.debug "Updating sync_state table"
          db.execute("DELETE FROM sync_state")
          db.execute(
            "INSERT INTO sync_state (last_sync, status) VALUES (?, 'hard_reset')", 
            [Time.current.iso8601]
          )
        end
      end
      db.close
      
      logger.debug "Device database aggressively reset"
      
      # Clear session
      reset_session
      
      # Generate reset token for cross-tab communication
      reset_token = SecureRandom.hex(8)
      
      # Force complete client-side reset
      respond_to do |format|
        format.html { 
          render inline: %{
            <html>
            <head><title>Device Reset</title></head>
            <body>
              <h1>Resetting Device...</h1>
              <script>
                console.log('Device reset initiated, clearing client data');
                
                // CRITICAL: Remove authentication flag first
                localStorage.removeItem('authenticated_user');
                
                // Broadcast reset to other tabs
                localStorage.setItem('device_reset_broadcast', '#{reset_token}');
                localStorage.setItem('device_reset', 'true');
                
                try {
                  // Remove all authentication and device related items
                  localStorage.removeItem('authenticated_user');
                  localStorage.removeItem('superapp_tab_id');
                  localStorage.removeItem('loop_detected');
                  localStorage.removeItem('device_key');
                  localStorage.removeItem('device_header');
                  localStorage.removeItem('device_id');
                  localStorage.removeItem('device_guid');
                  
                  // Clear all storage
                  localStorage.clear();
                  sessionStorage.clear();
                  
                  // Force removal of each key individually
                  Object.keys(localStorage).forEach(function(key) {
                    console.log('Removing localStorage key:', key);
                    localStorage.removeItem(key);
                  });
                  
                  // Clear cookies
                  document.cookie.split(';').forEach(function(c) {
                    document.cookie = c.trim().split('=')[0] + '=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;';
                  });
                  
                  console.log('All client-side storage cleared');
                } catch(e) {
                  console.error('Error clearing storage:', e);
                }
                
                // Redirect after a delay to ensure clearing completes
                setTimeout(function() {
                  console.log('Redirecting after device reset...');
                  window.location.href = '#{root_path}?reset=' + Date.now();
                }, 1000);
              </script>
            </body>
            </html>
          }
        }
        format.json { 
          render json: { 
            status: 'success',
            message: 'Device reset successful',
            clear_storage: true,
            reset_broadcast: reset_token,
            redirect_to: "#{root_path}?reset=#{Time.now.to_i}"
          }
        }
      end
    rescue StandardError => e
      logger.error "Error resetting device: #{e.message}"
      logger.error e.backtrace.join("\n")
      
      respond_to do |format|
        format.html { 
          render inline: %{
            <script>
              console.log('Error during device reset, clearing storage anyway...');
              
              // Still try to remove authentication flag
              localStorage.removeItem('authenticated_user');
              
              // And clear all storage
              localStorage.clear();
              sessionStorage.clear();
              
              setTimeout(function() {
                window.location.href = '#{root_path}?reset_error=true';
              }, 500);
            </script>
          }
        }
        format.json { 
          render json: { 
            error: "Failed to reset device: #{e.message}",
            clear_storage: true,
            redirect_to: "#{root_path}?reset_error=true"
          }, 
          status: :internal_server_error 
        }
      end
    end
  else
    logger.error "No device information found for reset"
    logger.error "Device path: #{current_device_path}"
    logger.error "Path exists: #{File.exist?(Rails.root.join('db', current_device_path.to_s)) rescue 'N/A'}"
    
    respond_to do |format|
      format.html {
        redirect_to root_path(error: "No device found")
      }
      format.json { 
        render json: { error: "No device information found" }, status: :not_found 
      }
    end
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
  
  # New method to generate device linking code
  def generate_linking_code
    logger.debug "========== GENERATE DEVICE LINKING CODE =========="
    
    # Ensure user is authenticated
    unless current_device && current_device[:handle]
      return render json: { error: 'Not authenticated' }, status: :unauthorized
    end
    
    # Get current user
    user = User.find_by(handle: current_device[:handle])
    unless user
      return render json: { error: 'User not found' }, status: :not_found
    end
    
    # Generate a random 8-character alphanumeric code
    code = SecureRandom.alphanumeric(8).upcase
    
    # Store the code in cache with user information
    cache_key = "device_linking:#{code}"
    cache_data = {
      user_id: user.id,
      handle: user.handle,
      guid: user.guid,
      phone: user.phone,
      created_at: Time.current,
      expires_at: 10.minutes.from_now
    }
    
    Rails.cache.write(cache_key, cache_data, expires_in: 10.minutes)
    
    logger.debug "Generated linking code: #{code} for user: #{user.handle}"
    
    render json: {
      code: code,
      expires_in: 600 # 10 minutes in seconds
    }
  end

  private

def valid_device_database?(path)
  begin
    db = SQLite3::Database.new(path)
    # Check if the required tables exist
    has_device_info = db.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='device_info'").any?
    db.close
    return has_device_info
  rescue SQLite3::Exception => e
    logger.error "Error validating device database: #{e.message}"
    return false
  end
end

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
    return
  end
  
  # Check if session has been invalidated by a device reset
  if current_device[:handle].present?
    user = User.find_by(handle: current_device[:handle])
    
    # Debug session validation
    logger.debug "Checking session validity:"
    logger.debug "- User: #{user.inspect}"
    logger.debug "- Sessions valid after: #{user&.sessions_valid_after}"
    logger.debug "- Session login time: #{session[:login_time]}"
    
    if user && user.sessions_valid_after.present? && 
       (session[:login_time].blank? || Time.parse(session[:login_time].to_s) < user.sessions_valid_after)
      
      logger.debug "Session invalidated by device reset"
      reset_session
      
      # Generate reset token for cross-tab communication
      reset_token = SecureRandom.hex(8)
      
      respond_to do |format|
        format.html { 
          render inline: %{
            <script>
              console.log('Your session was invalidated by a device reset');
              
              // Broadcast reset
              localStorage.setItem('device_reset_broadcast', '#{reset_token}');
              localStorage.setItem('device_reset', 'true');
              
              // Clear storage
              localStorage.clear();
              sessionStorage.clear();
              
              window.location.href = '#{root_path}?session_invalidated=true';
            </script>
          }
        }
        format.json { 
          render json: { 
            error: 'Session invalidated', 
            clear_storage: true,
            reset_broadcast: reset_token,
            redirect_to: root_path(session_invalidated: true)
          }, status: :unauthorized 
        }
      end
      return
    end
  end
  
  logger.debug "Authentication successful"
end
  
  # Helper method to fetch user devices
def fetch_user_devices
  return [] unless session[:current_handle]
  
  current_handle = session[:current_handle]
  current_device_id = session[:current_device_id]
  user = User.find_by(handle: current_handle)
  
  return [] unless user
  
  devices = []
  
  Dir.glob(Rails.root.join('db', 'devices', '*.sqlite3')).each do |db_path|
    begin
      db = SQLite3::Database.new(db_path)
      
      # First, check what columns exist to avoid errors
      columns = db.execute("PRAGMA table_info(device_info)").map { |col| col[1] }
      
      # Build a query that only includes columns that actually exist
      base_columns = ["device_id", "handle", "guid", "phone", "created_at", "last_verified_at"]
      optional_columns = ["device_name", "custom_name", "is_trusted"]
      
      # Filter out columns that don't exist
      existing_columns = base_columns + optional_columns.select { |col| columns.include?(col) }
      
      # Construct a safe query
      query = "SELECT #{existing_columns.join(', ')} FROM device_info LIMIT 1"
      
      device_info = db.get_first_row(query)
      
      if device_info && device_info[1] == current_handle
        # Create a hash with column names as keys
        device_data = {}
        existing_columns.each_with_index do |col, i|
          device_data[col.to_sym] = device_info[i]
        end
        
        # Get last used timestamp
        last_verified = device_data[:last_verified_at] ? Time.parse(device_data[:last_verified_at]) : nil
        
        # Detect device type using existing helper methods
        device_type = detect_device_type_from_characteristics(db_path, db) || detect_device_type(db_path, db)
        
        # Get or generate device name - prioritize custom_name if set
        device_name = device_data[:custom_name].presence || device_data[:device_name] || generate_device_name(device_type)
        
        devices << {
          id: db_path.split('db/').last,
          device_id: device_data[:device_id],
          handle: device_data[:handle],
          guid: device_data[:guid],
          created_at: device_data[:created_at],
          last_verified_at: last_verified,
          device_name: device_name,
          custom_name: device_data[:custom_name],
          device_type: device_type,
          is_current: device_data[:device_id] == current_device_id
        }
      end
      
      db.close
    rescue SQLite3::Exception => e
      logger.error "Error reading device database #{db_path}: #{e.message}"
    end
  end
  
  # Sort by last used, most recent first
  devices.sort_by { |device| device[:last_verified_at] || Time.at(0) }.reverse
end
  
  # Detect device type from characteristics stored in the database
  def detect_device_type_from_characteristics(db_path, db)
    begin
      # Check if device_characteristics table exists
      has_characteristics = db.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='device_characteristics'").any? rescue false
      
      if has_characteristics
        # Get the characteristics JSON
        char_row = db.get_first_row("SELECT characteristics FROM device_characteristics ORDER BY updated_at DESC LIMIT 1")
        
        if char_row && char_row[0]
          begin
            characteristics = JSON.parse(char_row[0])
            
            # Return explicit device type if available
            if characteristics['deviceType']
              return characteristics['deviceType']
            end
            
            # Or infer from detailed characteristics
            if characteristics['platform']
              if characteristics['platform'].include?('iPhone') || characteristics['platform'].include?('iOS')
                return "iPhone"
              elsif characteristics['platform'].include?('iPad')
                return "iPad"
              elsif characteristics['platform'].include?('Android')
                return characteristics['touchSupport'] ? "Android Phone" : "Android Tablet"
              elsif characteristics['platform'].include?('Mac')
                return "MacBook"
              elsif characteristics['platform'].include?('Win')
                return "Windows PC"
              elsif characteristics['platform'].include?('Linux')
                return "Linux PC"
              end
            end
            
            # Check touchSupport as fallback
            if characteristics['touchSupport'] && characteristics['touchSupport'] == true
              return "Mobile Device"
            end
          rescue => e
            logger.error "Error parsing characteristics JSON: #{e.message}"
          end
        end
      end
      
      # Fall back to nil if no type could be determined
      return nil
    rescue => e
      logger.error "Error detecting device type from characteristics: #{e.message}"
      return nil
    end
  end
  
  # Detect device type from user agent and other signals
  def detect_device_type(db_path, db)
    device_type = "Desktop" # Default
    
    begin
      # Check if browser_keys table exists
      has_browser_keys = db.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='browser_keys'").any? rescue false
      
      if has_browser_keys
        # Get the most recent user agent
        user_agent_row = db.get_first_row("SELECT user_agent FROM browser_keys ORDER BY last_used DESC LIMIT 1")
        
        if user_agent_row && user_agent_row[0]
          user_agent = user_agent_row[0].to_s
          
          if user_agent.include?('Mobile') || user_agent.include?('Android') || user_agent.include?('iPhone')
            device_type = "Mobile"
          elsif user_agent.include?('iPad') || user_agent.include?('Tablet')
            device_type = "Tablet"
          end
        end
      end
    rescue SQLite3::Exception => e
      logger.error "Error detecting device type: #{e.message}"
    end
    
    device_type
  end
  
  # Generate a friendly device name
  def generate_device_name(device_type)
    case device_type
    when "iPhone"
      "iPhone"
    when "iPad"
      "iPad"
    when "Android Phone"
      "Android Phone"
    when "Android Tablet"
      "Android Tablet"
    when "MacBook"
      "Mac"
    when "Windows PC"
      "Windows PC"
    when "Linux PC"
      "Linux PC" 
    when "Mobile"
      "Mobile Device"
    when "Tablet"
      "Tablet"
    else
      "Desktop"
    end
  end
  
  # Format last used time in a human-readable format
  helper_method :format_last_used
  def format_last_used(timestamp)
    return "Never" unless timestamp
    
    time_ago = Time.current - timestamp
    
    if time_ago < 1.minute
      "Just now"
    elsif time_ago < 1.hour
      "#{(time_ago / 60).to_i} minutes ago"
    elsif time_ago < 24.hours
      "#{(time_ago / 1.hour).to_i} hours ago"
    elsif time_ago < 48.hours
      "Yesterday"
    else
      timestamp.strftime("%B %d, %Y")
    end
  end
end
