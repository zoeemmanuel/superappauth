class ApplicationController < ActionController::Base
  protect_from_forgery with: :exception, unless: -> { request.format.json? || request.headers['X-Device-Key'].present? }
  before_action :allow_cross_origin
  after_action :set_csrf_token_header

  private

  def allow_cross_origin
    if request.headers['X-Device-Key'].present? || request.xhr?
      # Support mixed content (HTTP/HTTPS) for device-based auth
      response.headers['Access-Control-Allow-Origin'] = request.origin
      response.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE'
      response.headers['Access-Control-Allow-Headers'] = 'X-CSRF-Token, X-Device-Key, Content-Type'
      response.headers['Access-Control-Allow-Credentials'] = 'true'
      response.headers['Vary'] = 'Origin'
    end
  end

  def set_csrf_token_header
    response.headers['X-CSRF-Token'] = form_authenticity_token
  end

def current_device
  return nil if @skip_device_check
  
  # Enhanced caching check
  if session[:last_device_check] && 
     Time.now.to_i - session[:last_device_check].to_i < 2 &&
     session[:device_path] &&
     session[:current_handle] &&
     session[:device_session] == 'authenticated'

    logger.debug "========== USING CACHED DEVICE CHECK =========="
    logger.debug "Cached session data: #{session.to_h}"
    return {
      device_id: session[:current_device_id],
      handle: session[:current_handle],
      phone: session[:current_phone],
      guid: session[:current_guid],
      path: session[:device_path],
      last_verified_at: session[:last_verified_at],
      sync_state: session[:sync_state]
    }
  end

  @current_device ||= begin
    logger.debug "========== CURRENT DEVICE CHECK =========="
    
    device = nil
    
    # First try device key for cross-browser support 
    device_key = request.headers['HTTP_X_DEVICE_KEY']
    if device_key
      logger.debug "Scanning devices with key: #{device_key}"
      device = find_device_by_key(device_key)
      if device
        cache_device_info(device)
        return device
      end
    end
    
    # Then check session paths if no device found by key
    if session[:device_path]
      device = get_device_from_path(session[:device_path])
      if device
        cache_device_info(device)
        return device
      end
    end
    
    if session[:pending_device_path]
      device = get_device_from_path(session[:pending_device_path])
      if device
        cache_device_info(device)
        return device
      end
    end
    
    logger.debug "No device found in session or by key"
    nil
  end
end

  def get_device_from_path(device_path)
    logger.debug "Checking device path: #{device_path}"
    return nil unless device_path

    full_path = Rails.root.join('db', device_path)
    logger.debug "Full path: #{full_path}"
    return nil unless File.exist?(full_path)

    begin
      db = SQLite3::Database.new(full_path)
      device_info = db.get_first_row("SELECT device_id, handle, guid, phone, last_verified_at FROM device_info LIMIT 1")
      logger.debug "Device info from DB: #{device_info.inspect}"
      
      if device_info && valid_device_identifiers?(device_info[0], device_info[2])
        sync_info = db.get_first_row("SELECT last_sync, status FROM sync_state ORDER BY id DESC LIMIT 1")
        db.close

        result = {
          device_id: device_info[0],
          handle: device_info[1],
          guid: device_info[2],
          phone: device_info[3],
          last_verified_at: device_info[4],
          path: device_path,
          sync_state: {
            last_sync: sync_info&.[](0),
            status: sync_info&.[](1)
          }
        }
        logger.debug "Returning device info: #{result.inspect}"
        result
      else
        db.close
        logger.debug "Invalid device identifiers"
        nil
      end
    rescue SQLite3::Exception => e
      logger.error "Database error in get_device_from_path: #{e.message}"
      nil
    end
  end

  def find_device_by_key(device_key)
    return nil unless device_key&.match?(/\A[0-9a-f]{64}\z/)
    
    devices = []
    exact_match = nil
    
    Dir.glob(Rails.root.join('db', 'devices', '*.sqlite3')).each do |db_path|
      begin
        logger.debug "Checking device database: #{db_path}"
        db = SQLite3::Database.new(db_path)
        device_info = db.get_first_row("SELECT device_id, handle, guid, phone, last_verified_at FROM device_info LIMIT 1")
        sync_info = db.get_first_row("SELECT last_sync, status FROM sync_state ORDER BY id DESC LIMIT 1")
        db.close
        
        next unless device_info

        device_data = {
          device_id: device_info[0],
          handle: device_info[1],
          guid: device_info[2],
          phone: device_info[3],
          last_verified_at: device_info[4],
          path: db_path.split('db/').last,
          sync_state: {
            last_sync: sync_info&.[](0),
            status: sync_info&.[](1)
          }
        }
        
        # Check for exact device key match first
        if device_info[0] == device_key
          logger.debug "Found exact device match: #{device_data.inspect}"
          exact_match = device_data
          break
        end
        
        # Store devices with handle/guid for backup
        if device_info[1] && device_info[2]  # has handle and guid
          logger.debug "Found device with handle/guid: #{device_data.inspect}"
          devices << device_data
        end
      rescue SQLite3::Exception => e
        logger.error "Error checking device #{db_path}: #{e.message}"
        next
      end
    end
    
    # Return exact match if found
    return exact_match if exact_match
    
    # Return first matching device if we found any
    if devices.any?
      chosen_device = devices.first
      logger.debug "Using existing device: #{chosen_device.inspect}"
      return chosen_device
    end
    
    nil
  end

  def valid_device_identifiers?(device_id, guid)
    logger.debug "Validating identifiers - Device ID: #{device_id}, GUID: #{guid}"
    return false unless device_id&.match?(/\A[0-9a-f]{64}\z/)
    return false unless guid&.match?(/\A[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\z/)
    true
  end

  def ensure_device_directory
    device_dir = Rails.root.join('db', 'devices')
    FileUtils.mkdir_p(device_dir) unless Dir.exist?(device_dir)
  end

def cache_device_info(device)
  return unless device
  
  logger.debug "========== CACHING DEVICE INFO =========="
  logger.debug "Device: #{device.inspect}"
  
  # Set all required session data
  session[:last_device_check] = Time.now.to_i
  session[:device_path] = device[:path]
  session[:current_handle] = device[:handle]
  session[:current_phone] = device[:phone]
  session[:current_device_id] = device[:device_id]
  session[:current_guid] = device[:guid]
  session[:last_verified_at] = device[:last_verified_at]
  session[:sync_state] = device[:sync_state]
  session[:device_session] = 'authenticated'
  
  # Ensure all data is set
  session[:authentication_time] = Time.now.to_i
  
  logger.debug "Updated session: #{session.to_h}"
end

  def confirm_device(device_path)
    logger.debug "========== CONFIRMING DEVICE =========="
    logger.debug "Device path: #{device_path}"
    logger.debug "Current session: #{session.to_h}"
    
    if device_path && valid_device?(device_path)
      device = get_device_from_path(device_path)
      if device
        logger.debug "Device valid, updating session"
        cache_device_info(device)
        session[:pending_device_path] = nil
        logger.debug "Updated session: #{session.to_h}"
        return true
      end
    end
    
    logger.debug "Device validation failed"
    false
  end

  def revoke_device
    logger.debug "========== REVOKING DEVICE =========="
    logger.debug "Before - Session: #{session.to_h}"
    session.delete(:device_path)
    session.delete(:pending_device_path)
    session.delete(:current_handle)
    session.delete(:current_phone)
    session.delete(:current_device_id)
    session.delete(:current_guid)
    session.delete(:last_verified_at)
    session.delete(:sync_state)
    session.delete(:device_session)
    session.delete(:last_device_check)
    @current_device = nil
    logger.debug "After - Session: #{session.to_h}"
  end

  def valid_device?(device_path)
    logger.debug "========== VALIDATING DEVICE =========="
    logger.debug "Device path: #{device_path}"
    return false unless device_path

    full_path = Rails.root.join('db', device_path)
    return false unless File.exist?(full_path)

    begin
      db = SQLite3::Database.new(full_path)
      info = db.get_first_row("SELECT device_id, guid, last_verified_at FROM device_info LIMIT 1")
      db.close

      logger.debug "Device info: #{info.inspect}"
      if info && info[0] && info[1] && info[2] && valid_device_identifiers?(info[0], info[1])
        last_verified = Time.parse(info[2])
        result = Time.current - last_verified < 30.days
        logger.debug "Validation result: #{result}"
        return result
      end
    rescue SQLite3::Exception => e
      logger.error "Error validating device: #{e.message}"
    end

    logger.debug "Validation failed"
    false
  end

  def update_device_sync_state(device_path, status)
    return unless device_path
    
    full_path = Rails.root.join('db', device_path)
    return unless File.exist?(full_path)

    begin
      db = SQLite3::Database.new(full_path)
      db.execute(
        "INSERT INTO sync_state (last_sync, status) VALUES (?, ?)",
        [Time.current.iso8601, status]
      )
      db.close
    rescue SQLite3::Exception => e
      logger.error "Error updating sync state: #{e.message}"
    end
  end

def ensure_authenticated
  # Enhanced caching check
  now = Time.current.to_f
  last_auth_check = session[:last_auth_check].to_f
  
  if (now - last_auth_check) < 1.0 && 
     session[:device_path] && 
     session[:current_handle] &&
     session[:device_session] == 'authenticated'
    logger.debug "========== USING CACHED AUTH CHECK =========="
    return true
  end
  
  session[:last_auth_check] = now
  
  logger.debug "========== ENSURE AUTHENTICATED =========="
  logger.debug "Session: #{session.to_h}"
  
  device = current_device
  unless device
    logger.debug "Authentication failed - revoking device"
    revoke_device
    respond_to do |format|
      format.html { redirect_to root_path }
      format.json { render json: { error: 'Not authenticated' }, status: :unauthorized }
    end
    return false
  end
  
  # Cache successful device info
  cache_device_info(device)
  
  logger.debug "Authentication successful"
  true
end

  helper_method :current_device
end
