class DeviceRecognitionService
  attr_reader :device_key, :session, :logger

  def initialize(device_key, session, logger)
    @device_key = device_key
    @session = session
    @logger = logger
  end

  # Main entry point for device recognition
  def recognize_device
    logger.debug "========== RECOGNIZE DEVICE =========="
    logger.debug "Device key: #{device_key&.slice(0, 10)}..."
    
    # Skip if logged out
    if session[:logging_out]
      logger.debug "Logout state detected, skipping device recognition"
      return { status: 'logged_out' }
    end
    
    # First check for cache hit by device key
    if device_key && session[:last_device_check] && 
       Time.now.to_i - session[:last_device_check] < 300 && 
       session[:current_device_id] == device_key
      
      logger.debug "CACHE HIT: Using cached device recognition result"
      if session[:device_session] == 'authenticated'
        return {
          status: 'authenticated',
          device_key: device_key,
          handle: session[:current_handle],
          guid: session[:current_guid],
          phone: session[:current_phone],
          path: session[:device_path]
        }
      end
    end
    
    # Scan all device databases - with performance optimizations
    all_devices = scan_device_databases
    
    # Find a registered device based on priority matching
    registered_device = find_registered_device(all_devices)
    
    if registered_device
      logger.debug "Found registered device: #{registered_device[:handle]}"
      
      # Update cache timestamp
      session[:last_device_check] = Time.now.to_i
      
      # Check if this is a cross-browser scenario
      is_cross_browser = registered_device[:cross_browser] || false
      
      # FIXED: Check for recent verification FIRST, regardless of cross-browser or not
      # This aligns with documentation stating that recently verified devices should auto-login
      if recently_verified?(registered_device[:last_verified_at])
        # Auto-login for any recently verified device (including cross-browser)
        logger.debug "Device recently verified, returning authenticated status"
        # Add a note about cross-browser in the logs if applicable
        logger.debug "Cross-browser auto-login enabled" if is_cross_browser
        
        return {
          status: 'authenticated',
          device_key: registered_device[:device_id],
          handle: registered_device[:handle],
          guid: registered_device[:guid],
          phone: registered_device[:phone],
          path: registered_device[:path],
          cross_browser: is_cross_browser
        }
      else
        # Device not recently verified, require verification
        logger.debug "Device found but needs verification"
        logger.debug "Cross-browser verification required" if is_cross_browser
        
        return {
          status: 'needs_quick_verification',
          device_key: registered_device[:device_id],
          handle: registered_device[:handle],
          guid: registered_device[:guid],
          phone: registered_device[:phone],
          masked_phone: mask_phone(registered_device[:phone]),
          path: registered_device[:path],
          cross_browser: is_cross_browser
        }
      end
    else
      logger.debug "No registered device found, returning show_options status"
      # New device, no registration
      return { status: 'show_options' }
    end
  end

  # Scan all device databases with performance optimizations
  def scan_device_databases
    logger.debug "========== SCAN DEVICE DATABASES =========="
    
    # Use caching for device database scanning
    cache_key = "device_scan:#{Time.now.to_i / 60}" # Cache for 1 minute
    
    if Rails.cache.exist?(cache_key)
      devices = Rails.cache.read(cache_key)
      logger.debug "Using cached device database scan (#{devices.size} devices)"
      return devices
    end
    
    devices = []
    device_files = Dir.glob(Rails.root.join('db', 'devices', '*.sqlite3'))
    
    # Optimization: If we have a device key, check for an exact match first
    if device_key
      exact_match_file = find_exact_device_match(device_files)
      if exact_match_file
        logger.debug "Found exact device match fast path: #{exact_match_file}"
        device_info = get_device_info(exact_match_file)
        if device_info && device_info[:handle]
          device_info[:path] = exact_match_file.split('db/').last
          devices << device_info
          Rails.cache.write(cache_key, devices, expires_in: 1.minute)
          return devices
        end
      end
    end
    
    # Optimization: For cross-browser, we only need to look for specific users
    target_identifiers = []
    target_identifiers << session[:current_guid] if session[:current_guid].present?
    target_identifiers << session[:current_handle] if session[:current_handle].present?
    target_identifiers << session[:current_phone] if session[:current_phone].present?
    target_identifiers << session[:previous_guid] if session[:previous_guid].present?
    target_identifiers << session[:previous_handle] if session[:previous_handle].present?
    target_identifiers << session[:previous_phone] if session[:previous_phone].present?
    
    # If we have target identifiers, we can optimize the search
    if target_identifiers.any?
      logger.debug "Optimizing search with target identifiers: #{target_identifiers.compact.join(', ')}"
    end
    
    # Process files in batches to avoid memory issues
    device_files.each_slice(10) do |batch|
      batch.each do |db_path|
        begin
          # Skip files that don't have a chance of matching
          next if should_skip_file?(db_path, target_identifiers)
          
          device_info = get_device_info(db_path)
          next unless device_info
          
          # Add path to device info
          device_info[:path] = db_path.split('db/').last
          
          # Only load sync state if we actually need it
          if device_info[:handle].present?
            begin
              db = SQLite3::Database.new(db_path)
              sync_state = db.get_first_row("SELECT last_sync, status FROM sync_state LIMIT 1")
              if sync_state
                device_info[:sync_state] = {
                  last_sync: sync_state[0],
                  status: sync_state[1]
                }
              end
              db.close
            rescue SQLite3::Exception => e
              logger.error "Error reading sync state from #{db_path}: #{e.message}"
            end
          end
          
          devices << device_info
        rescue SQLite3::Exception => e
          logger.error "Error reading device database #{db_path}: #{e.message}"
          next
        end
      end
    end
    
    logger.debug "Found #{devices.size} total devices, #{devices.count { |d| d[:handle].present? }} with user handles"
    
    # Cache the results
    Rails.cache.write(cache_key, devices, expires_in: 1.minute)
    devices
  end

  # Find a registered device with priority matching
def find_registered_device(all_devices = nil)
  logger.debug "========== FIND REGISTERED DEVICE =========="
  
  # Load devices if not provided
  all_devices ||= scan_device_databases
  
  # Extract session identifiers
  session_guid = session[:current_guid]
  session_handle = session[:current_handle]
  session_phone = session[:current_phone] || session[:verification_phone]
  previous_handle = session[:previous_handle]
  previous_guid = session[:previous_guid]
  previous_phone = session[:previous_phone]
  
  logger.debug "Session identifiers - GUID: #{session_guid}, Handle: #{session_handle}, Phone: #{session_phone}"
  logger.debug "Previous identifiers - Handle: #{previous_handle}, GUID: #{previous_guid}, Phone: #{previous_phone}" 
  
  # 1. Exact device key match (same browser) - this is the most reliable match
  if device_key
    exact_match = all_devices.find { |d| d[:device_id] == device_key && d[:handle].present? }
    
    if exact_match
      logger.debug "Found exact device key match: #{exact_match[:handle]}"
      return exact_match
    end
  end
  
  # Only attempt cross-browser recognition if we have some user context
  # This prevents matching random accounts on new devices
  has_user_context = session_guid.present? || 
                    session_handle.present? || 
                    session_phone.present? || 
                    previous_handle.present? || 
                    previous_guid.present? || 
                    previous_phone.present?
  
  if has_user_context
    logger.debug "User context available, attempting cross-browser recognition"
    
    # Filter devices with handles for cross-browser check
    devices_with_handles = all_devices.select { |d| d[:handle].present? }
    logger.debug "Found #{devices_with_handles.size} registered devices with handles for cross-browser check"
    
    # If we have devices with handles, we can try to match by user identifiers
    if devices_with_handles.any?
      # 2. GUID match (cross-browser, same user)
      if session_guid || previous_guid
        guid = session_guid || previous_guid
        guid_match = devices_with_handles.find { |d| d[:guid] == guid }
        
        if guid_match
          logger.debug "Found GUID match: #{guid_match[:handle]}"
          guid_match[:cross_browser] = true
          return guid_match
        end
      end
      
      # 3. Handle match (cross-browser, same user)
      if session_handle || previous_handle
        handle = session_handle || previous_handle
        handle_match = devices_with_handles.find { |d| d[:handle] == handle }
        
        if handle_match
          logger.debug "Found handle match: #{handle_match[:handle]}"
          handle_match[:cross_browser] = true
          return handle_match
        end
      end
      
      # 4. Phone match (cross-browser, same user)
      if session_phone || previous_phone
        phone = session_phone || previous_phone
        phone_match = devices_with_handles.find { |d| d[:phone] == phone }
        
        if phone_match
          logger.debug "Found phone match: #{phone_match[:handle]}"
          phone_match[:cross_browser] = true
          return phone_match
        end
      end
      
      # NEW: All devices on filesystem approach - last resort for same physical device
      # This allows cross-browser recognition even when cookies/localStorage are cleared
      # This is the key functionality described in your architecture document
      
      # If we have any verified devices, we'll use those for cross-browser login
      recently_verified_devices = devices_with_handles.select do |d|
        d[:last_verified_at].present? && 
        Time.parse(d[:last_verified_at]) > 30.days.ago rescue false
      end
      
      if recently_verified_devices.any?
        # Take the most recently verified device
        device = recently_verified_devices.max_by do |d|
          Time.parse(d[:last_verified_at]) rescue Time.parse("2000-01-01")
        end
        
        logger.debug "Found recently verified device on same filesystem: #{device[:handle]}"
        device[:cross_browser] = true
        return device
      end
    end
  else
    logger.debug "No user context available - cannot perform cross-browser recognition"
    return nil
  end
  
  logger.debug "No registered device found"
  nil
end

  private
  
  # Optimization: Find exact device match quickly
  def find_exact_device_match(files)
    # Fast database check for device key
    files.each do |db_path|
      begin
        db = SQLite3::Database.new(db_path)
        match = db.get_first_row("SELECT 1 FROM device_info WHERE device_id = ? LIMIT 1", [device_key])
        db.close
        
        return db_path if match
      rescue SQLite3::Exception => e
        next
      end
    end
    nil
  end
  
  # Optimization: Skip files that don't have a chance of matching
  def should_skip_file?(db_path, target_identifiers)
    return false if target_identifiers.empty? # Can't optimize
    
    # Quick check of file modification time
    file_age_days = (Time.now - File.mtime(db_path)) / 86400
    
    # If the file is older than 30 days and we're looking for recently verified devices
    # we can potentially skip it (this is a heuristic)
    if file_age_days > 30 && session[:last_login_check].present?
      # But still scan if it might be a previous device
      filename = File.basename(db_path, '.sqlite3')
      return false if filename == session[:previous_guid]
      
      # Random sampling - check 10% of old files anyway to avoid missing data
      return rand > 0.1
    end
    
    false
  end

  def get_device_info(path)
    db = SQLite3::Database.new(path)
    result = db.get_first_row("SELECT device_id, handle, guid, phone, created_at, last_verified_at FROM device_info LIMIT 1")
    db.close
    
    return nil unless result
    
    {
      device_id: result[0],
      handle: result[1],
      guid: result[2],
      phone: result[3],
      created_at: result[4],
      last_verified_at: result[5]
    }
  rescue SQLite3::Exception => e
    logger.error "Database error reading #{path}: #{e.message}"
    nil
  end

  def recently_verified?(last_verified_at)
    return false unless last_verified_at
    
    begin
      # Consider verified if within the last 30 days
      Time.parse(last_verified_at) > 30.days.ago
    rescue
      false
    end
  end

  def mask_phone(phone)
    return nil unless phone
    "*******#{phone.last(4)}"
  end
end
