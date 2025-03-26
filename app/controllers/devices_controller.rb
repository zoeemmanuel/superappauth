class DevicesController < ApplicationController
  before_action :ensure_authenticated, except: [:verify_linking_code, :generate_linking_code, :link_device]
  skip_before_action :verify_authenticity_token, only: [:sign_out, :verify_linking_code, :rename]

  def index
    @devices = fetch_user_devices
    render json: @devices
  end

  def update
    device_path = params[:id]
    device_name = params[:name]
    is_trusted = params[:trusted]
    result = update_device_db(device_path, device_name, is_trusted)

    if result
      render json: { success: true }
    else
      render json: { error: "Failed to update device" }, status: :unprocessable_entity
    end
  end

  def destroy
    device_path = params[:id]
    if device_path != session[:device_path]
      # Only allow removing non-current devices
      file_path = Rails.root.join('db', device_path)
      if File.exist?(file_path)
        File.delete(file_path)
        render json: { success: true }
      else
        render json: { error: "Device not found" }, status: :not_found
      end
    else
      render json: { error: "You can't sign out of your current device. You need to reset the device as the device is registered." }, status: :unprocessable_entity
    end
  end

  def trust
    device_path = params[:id]
    result = update_device_db(device_path, nil, true)
    if result
      render json: { success: true }
    else
      render json: { error: "Failed to update device" }, status: :unprocessable_entity
    end
  end

  def untrust
    device_path = params[:id]
    result = update_device_db(device_path, nil, false)
    if result
      render json: { success: true }
    else
      render json: { error: "Failed to update device" }, status: :unprocessable_entity
    end
  end

  def sign_out
    device_path = params[:id]
    if device_path != session[:device_path]
      if File.exist?(Rails.root.join('db', device_path))
        begin
          db = SQLite3::Database.new(Rails.root.join('db', device_path))
          # Clear user associations but keep the device ID
          db.execute("UPDATE device_info SET handle = NULL, phone = NULL, guid = NULL, last_verified_at = NULL")
          db.close
          render json: { success: true }
        rescue SQLite3::Exception => e
          render json: { error: e.message }, status: :internal_server_error
        end
      else
        render json: { error: "Device not found" }, status: :not_found
      end
    else
      render json: { error: "You can't sign out of your current device. You need to reset the device as the device is registered." }, status: :unprocessable_entity
    end
  end
  
  # Show the QR code scanning interface
def link_device
  @code = params[:code]
  
  # If code is provided in URL params, immediately verify it instead of showing form
  if @code.present?
    # Directly call verify_linking_code logic here
    cache_key = "device_linking:#{@code}"
    cached_data = Rails.cache.read(cache_key)
    
    if cached_data && cached_data[:expires_at] > Time.current
      user_id = cached_data[:user_id]
      user = User.find_by(id: user_id)
      
      if user
        # Reset session
        reset_session
        
        # Create or get device key
        device_key = params[:device_key] || request.headers['HTTP_X_DEVICE_KEY'] || SecureRandom.hex(32)
        
        # Set up device
        device_path = setup_device_for_user(user, device_key)
        
        # Delete the used code
        Rails.cache.delete(cache_key)
        
        # Set session data
        session[:device_session] = 'authenticated'
        session[:current_handle] = user.handle
        session[:device_path] = device_path
        session[:current_phone] = user.phone
        session[:current_guid] = user.guid
        session[:current_device_id] = device_key
        session[:authenticated_at] = Time.current.to_i
        
        # Redirect to dashboard immediately
        return redirect_to dashboard_path
      end
    end
    
    # If we get here, the code was invalid or expired
    # Show a simple error page
    return render html: <<~HTML.html_safe, layout: false
      <!DOCTYPE html>
      <html>
      <head>
        <title>Connection Failed</title>
        <meta name="viewport" content="width=device-width,initial-scale=1">
        <style>
          body {
            font-family: system-ui, -apple-system, sans-serif;
            background-color: #0f172a;
            color: white;
            margin: 0;
            padding: 0;
            display: flex;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
            text-align: center;
          }
          .container {
            max-width: 90%;
            width: 400px;
            padding: 2rem;
          }
          .error-icon {
            width: 64px;
            height: 64px;
            background-color: #ef4444;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto 1.5rem;
          }
          h1 { font-size: 1.5rem; margin-bottom: 1rem; }
          p { color: #94a3b8; margin-bottom: 2rem; }
          .button {
            display: block;
            background-color: #3b82f6;
            color: white;
            text-decoration: none;
            padding: 0.75rem 1.5rem;
            border-radius: 0.375rem;
            font-weight: 500;
            margin-top: 1.5rem;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="error-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="15" y1="9" x2="9" y2="15"></line>
              <line x1="9" y1="9" x2="15" y2="15"></line>
            </svg>
          </div>
          <h1>Connection Failed</h1>
          <p>The QR code has expired or is invalid. Please scan a new QR code from your desktop.</p>
          <a href="/" class="button">Return to Login</a>
        </div>
      </body>
      </html>
    HTML
  end
  
  # Only reach here if there's no code in params (direct access to /link-device)
  render layout: 'auth'
end

def verify_linking_code
  # This will only be called from API requests, not from QR code scanning
  code = params[:code]&.strip&.upcase
  
  unless code
    return render json: { error: 'No code provided' }, status: :bad_request
  end
  
  # Look up the code in cache
  cache_key = "device_linking:#{code}"
  cached_data = Rails.cache.read(cache_key)
  
  unless cached_data
    return render json: { error: 'Invalid code. Please scan a new QR code.' }, status: :not_found
  end
  
  # Check if code is expired
  if cached_data[:expires_at] < Time.current
    Rails.cache.delete(cache_key)
    return render json: { error: 'This code has expired. Please scan a new QR code.' }, status: :gone
  end
  
  # Retrieve user information from cache
  user_id = cached_data[:user_id]
  user = User.find_by(id: user_id)
  
  unless user
    return render json: { error: 'User not found' }, status: :not_found
  end
  
  # Process authentication
  reset_session
  device_key = params[:device_key] || request.headers['HTTP_X_DEVICE_KEY'] || SecureRandom.hex(32)
  device_path = setup_device_for_user(user, device_key)
  Rails.cache.delete(cache_key)
  
  # Set session data
  session[:device_session] = 'authenticated'
  session[:current_handle] = user.handle
  session[:device_path] = device_path
  session[:current_phone] = user.phone
  session[:current_guid] = user.guid
  session[:current_device_id] = device_key
  
  render json: {
    status: 'authenticated',
    handle: user.handle,
    guid: user.guid,
    redirect_to: '/dashboard'
  }
end  

def rename
    device_path = params[:id] || params[:device_path]
    device_name = params[:name].to_s.strip
    
    if device_name.blank?
      return render json: { error: "Device name cannot be empty" }, status: :unprocessable_entity
    end
    
    if device_name.length > 50
      return render json: { error: "Device name must be less than 50 characters" }, status: :unprocessable_entity
    end
    
    # Verify this device belongs to the current user
    begin
      file_path = Rails.root.join('db', device_path)
      unless File.exist?(file_path)
        return render json: { error: "Device not found" }, status: :not_found
      end
      
      db = SQLite3::Database.new(file_path)
      device_info = db.get_first_row("SELECT handle FROM device_info LIMIT 1")
      
      if !device_info || device_info[0] != session[:current_handle]
        db.close
        return render json: { error: "Device not found or access denied" }, status: :forbidden
      end
      
      # Update the device name - we'll update both device_name and custom_name for compatibility
      result = update_device_db(device_path, device_name, nil)
      
      # Also update custom_name field if it exists
      begin
        columns = db.execute("PRAGMA table_info(device_info)").map { |col| col[1] }
        if columns.include?("custom_name")
          db.execute("UPDATE device_info SET custom_name = ?", [device_name])
        else
          db.execute("ALTER TABLE device_info ADD COLUMN custom_name TEXT")
          db.execute("UPDATE device_info SET custom_name = ?", [device_name])
        end
      rescue SQLite3::Exception => e
        logger.error "Error updating custom_name: #{e.message}"
      end
      
      db.close
      
      if result
        render json: { status: 'success', success: true, device_name: device_name, message: "Device renamed successfully" }
      else
        render json: { error: "Failed to rename device" }, status: :unprocessable_entity
      end
    rescue SQLite3::Exception => e
      logger.error "Database error: #{e.message}"
      render json: { error: "Database error" }, status: :internal_server_error
    end
  end

  private

  # Check if device is already registered to another user
  def device_conflict?(device_key, current_handle)
    Dir.glob(Rails.root.join('db', 'devices', '*.sqlite3')).each do |db_path|
      begin
        db = SQLite3::Database.new(db_path)
        device_info = db.get_first_row("SELECT handle FROM device_info WHERE device_id = ? LIMIT 1", [device_key])
        db.close
        
        # If device is registered to another user
        if device_info && device_info[0] && device_info[0] != current_handle
          return true
        end
      rescue SQLite3::Exception => e
        logger.error "Error checking existing device: #{e.message}"
      end
    end
    false
  end

  def update_device_db(device_path, name = nil, trusted = nil)
    return false unless File.exist?(Rails.root.join('db', device_path))

    begin
      db = SQLite3::Database.new(Rails.root.join('db', device_path))

      # Add device_name and is_trusted columns if they don't exist
      begin
        columns = db.execute("PRAGMA table_info(device_info)").map { |col| col[1] }
        unless columns.include?("device_name")
          db.execute("ALTER TABLE device_info ADD COLUMN device_name TEXT")
        end
        unless columns.include?("is_trusted")
          db.execute("ALTER TABLE device_info ADD COLUMN is_trusted INTEGER DEFAULT 0")
        end
        unless columns.include?("device_type")
          db.execute("ALTER TABLE device_info ADD COLUMN device_type TEXT")
        end
        unless columns.include?("browser_info")
          db.execute("ALTER TABLE device_info ADD COLUMN browser_info TEXT")
        end
        unless columns.include?("custom_name")
          db.execute("ALTER TABLE device_info ADD COLUMN custom_name TEXT")
        end
      rescue SQLite3::Exception => e
        # Ignore errors for existing columns
      end

      # Update the specific fields
      updates = []
      params = []

      if name
        updates << "device_name = ?"
        params << name
        
        # Also update custom_name if it exists
        if columns.include?("custom_name")
          updates << "custom_name = ?"
          params << name
        end
      end

      if !trusted.nil?
        updates << "is_trusted = ?"
        params << (trusted ? 1 : 0)
      end

      if updates.any?
        sql = "UPDATE device_info SET #{updates.join(', ')}"
        db.execute(sql, params)
      end

      db.close
      true
    rescue SQLite3::Exception => e
      logger.error "Error updating device: #{e.message}"
      false
    end
  end

  def fetch_user_devices
    devices = []
    current_handle = session[:current_handle]
    current_device_id = session[:current_device_id]

    Dir.glob(Rails.root.join('db', 'devices', '*.sqlite3')).each do |db_path|
      begin
        db = SQLite3::Database.new(db_path)

        # Check if device_name and is_trusted columns exist
        begin
          columns = db.execute("PRAGMA table_info(device_info)").map { |col| col[1] }
          unless columns.include?("device_name")
            db.execute("ALTER TABLE device_info ADD COLUMN device_name TEXT")
          end
          unless columns.include?("is_trusted")
            db.execute("ALTER TABLE device_info ADD COLUMN is_trusted INTEGER DEFAULT 0")
          end
          unless columns.include?("device_type")
            db.execute("ALTER TABLE device_info ADD COLUMN device_type TEXT")
          end
          unless columns.include?("browser_info")
            db.execute("ALTER TABLE device_info ADD COLUMN browser_info TEXT")
          end
          unless columns.include?("custom_name")
            db.execute("ALTER TABLE device_info ADD COLUMN custom_name TEXT")
          end
        rescue SQLite3::Exception => e
          # Ignore errors for existing columns
        end

        device_info = db.get_first_row("SELECT device_id, handle, guid, phone, created_at, last_verified_at, device_name, is_trusted, device_type, browser_info, custom_name FROM device_info LIMIT 1")

        db.close

        # Only include devices for the current user
        if device_info && device_info[1] == current_handle
          # Detect device type and browser from available info
          device_type = device_info[8] || detect_device_type(db_path)
          browser_info = device_info[9] || detect_browser_info(db_path)
          
          # Use custom_name if available, otherwise fall back to device_name
          display_name = device_info[10].presence || device_info[6] || default_device_name(device_type)

          devices << {
            id: db_path.split('db/').last,
            device_id: device_info[0],
            handle: device_info[1],
            created_at: device_info[4],
            last_verified_at: device_info[5],
            device_name: display_name,
            custom_name: device_info[10],
            is_trusted: device_info[7] == 1,
            device_type: device_type,
            browser_info: browser_info,
            is_current: device_info[0] == current_device_id
          }
        end
      rescue SQLite3::Exception => e
        logger.error "Error reading device database #{db_path}: #{e.message}"
      end
    end

    devices
  end
  
  # Setup a new device for a user or use existing
  def setup_device_for_user(user, device_key)
    # Look for existing device for this browser key first
    existing_device = nil
    
    Dir.glob(Rails.root.join('db', 'devices', '*.sqlite3')).each do |db_path|
      begin
        db = SQLite3::Database.new(db_path)
        
        # Check browser_keys table if exists
        has_browser_keys = db.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='browser_keys'").any? rescue false
        
        if has_browser_keys
          browser_exists = db.execute("SELECT 1 FROM browser_keys WHERE browser_id = ? LIMIT 1", [device_key]).any? rescue false
          
          if browser_exists
            existing_device = db_path.split('db/').last
            break
          end
        end
        
        # Check main device info as fallback
        device_info = db.get_first_row("SELECT device_id FROM device_info WHERE device_id = ? LIMIT 1", [device_key])
        
        if device_info
          existing_device = db_path.split('db/').last
          break
        end
        
        db.close
      rescue SQLite3::Exception => e
        logger.error "Error checking for existing device: #{e.message}"
      end
    end
    
    if existing_device
      # Use existing device
      logger.debug "Using existing device database: #{existing_device}"
      
      # Update device info with user data
      db = SQLite3::Database.new(Rails.root.join('db', existing_device))
      db.execute(
        "UPDATE device_info SET handle = ?, guid = ?, phone = ?, last_verified_at = ?",
        [user.handle, user.guid, user.phone, Time.current.iso8601]
      )
      db.close
      
      return existing_device
    else
      # Create new device
      device_guid = SecureRandom.uuid
      new_path = "devices/#{device_guid}.sqlite3"
      
      # Ensure device directory exists
      device_dir = Rails.root.join('db', 'devices')
      FileUtils.mkdir_p(device_dir) unless Dir.exist?(device_dir)
      
      # Create and initialize the database
      db = SQLite3::Database.new(Rails.root.join('db', new_path))
      db.transaction do
        # Create device_info table
        db.execute <<-SQL
          CREATE TABLE device_info (
            device_id TEXT PRIMARY KEY,
            handle TEXT,
            guid TEXT,
            phone TEXT,
            created_at TEXT,
            last_verified_at TEXT,
            device_name TEXT,
            device_type TEXT,
            is_trusted INTEGER DEFAULT 0,
            browser_info TEXT,
            custom_name TEXT
          )
        SQL

        # Create sync_state table
        db.execute <<-SQL
          CREATE TABLE sync_state (
            id INTEGER PRIMARY KEY,
            last_sync TEXT,
            status TEXT
          )
        SQL
        
        # Create browser_keys table
        db.execute <<-SQL
          CREATE TABLE browser_keys (
            browser_id TEXT PRIMARY KEY,
            browser_name TEXT,
            user_agent TEXT,
            added_at TEXT,
            last_used TEXT,
            pending BOOLEAN
          )
        SQL
        
        # Create device_characteristics table
        db.execute <<-SQL
          CREATE TABLE device_characteristics (
            id INTEGER PRIMARY KEY,
            characteristics TEXT,
            updated_at TEXT
          )
        SQL
        
        # Create ip_log table
        db.execute <<-SQL
          CREATE TABLE ip_log (
            ip TEXT,
            user_agent TEXT,
            access_time TEXT
          )
        SQL
        
        # Detect device type from user agent
        device_type = detect_device_type_from_user_agent(request.user_agent)
        
        # Generate device name
        device_name = default_device_name(device_type)
        
        # Insert device info
        db.execute(
          "INSERT INTO device_info (device_id, handle, guid, phone, created_at, last_verified_at, device_name, device_type) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
          [device_key, user.handle, user.guid, user.phone, Time.current.iso8601, Time.current.iso8601, device_name, device_type]
        )
        
        # Initialize sync state
        db.execute(
          "INSERT INTO sync_state (last_sync, status) VALUES (?, ?)",
          [Time.current.iso8601, 'linked_to_user']
        )
        
        # Add browser key
        db.execute(
          "INSERT INTO browser_keys (browser_id, browser_name, user_agent, added_at, last_used, pending) VALUES (?, ?, ?, ?, ?, ?)",
          [device_key, detect_browser(request.user_agent), request.user_agent, Time.current.iso8601, Time.current.iso8601, 0]
        )
        
        # Add IP to log
        if request.remote_ip
          db.execute(
            "INSERT INTO ip_log (ip, user_agent, access_time) VALUES (?, ?, ?)",
            [request.remote_ip, request.user_agent, Time.current.iso8601]
          )
        end
      end
      db.close
      
      logger.debug "Created new device database: #{new_path}"
      return new_path
    end
  end

  def detect_device_type(db_path)
    # Simple heuristic based on file name or other patterns
    filename = File.basename(db_path)
    if filename.include?('mobile') || filename.include?('phone')
      'Mobile'
    elsif filename.include?('tablet') || filename.include?('ipad')
      'Tablet'
    else
      'Desktop'
    end
  end
  
  def detect_device_type_from_user_agent(user_agent)
    return "Desktop" unless user_agent
    
    if user_agent.include?('Mobile') || user_agent.include?('Android') || user_agent.include?('iPhone')
      'Mobile'
    elsif user_agent.include?('iPad') || user_agent.include?('Tablet')
      'Tablet'
    else
      'Desktop'
    end
  end

  def detect_browser_info(db_path)
    # Simple heuristics or fallback
    'Unknown Browser'
  end
  
  def detect_browser(user_agent)
    return "Unknown" unless user_agent
    
    if user_agent =~ /Chrome/i
      "Chrome"
    elsif user_agent =~ /Firefox/i
      "Firefox"
    elsif user_agent =~ /Safari/i
      "Safari"
    elsif user_agent =~ /Edge/i
      "Edge"
    elsif user_agent =~ /MSIE|Trident/i
      "Internet Explorer"
    elsif user_agent =~ /Opera|OPR/i
      "Opera"
    else
      "Unknown"
    end
  end

  def default_device_name(device_type)
    case device_type
    when 'Mobile'
      'Mobile Phone'
    when 'Tablet'
      'Tablet'
    else
      'Computer'
    end
  end
  
  def ensure_authenticated
    unless current_device
      revoke_device
      respond_to do |format|
        format.html { redirect_to(root_url(protocol: request.protocol)) }
        format.json { render json: { error: 'Not authenticated' }, status: :unauthorized }
      end
    end
  end
end
