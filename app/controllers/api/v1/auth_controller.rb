module Api
  module V1
    class AuthController < ApplicationController
      skip_before_action :verify_authenticity_token

      # Database schema updater module
      module DatabaseSchemaUpdater
        def update_database_schema
          logger.info "========== UPDATING DATABASE SCHEMA =========="
          
          device_count = 0
          updated_count = 0
          
          Dir.glob(Rails.root.join('db', 'devices', '*.sqlite3')).each do |db_path|
            device_count += 1
            begin
              logger.debug "Checking database: #{db_path}"
              db = SQLite3::Database.new(db_path)
              
              # Track if we updated anything in this database
              db_updated = false
              
              # Check if browser_keys table exists
              has_browser_keys = false
              begin
                has_browser_keys = db.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='browser_keys'").any?
              rescue SQLite3::Exception => e
                logger.error "Error checking browser_keys table: #{e.message}"
              end
              
              # Create browser_keys table if it doesn't exist
              unless has_browser_keys
                begin
                  logger.info "Creating browser_keys table in #{db_path}"
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
                  db_updated = true
                rescue SQLite3::Exception => e
                  logger.error "Error creating browser_keys table: #{e.message}"
                end
              end
              
              # Check if ip_log table exists
              has_ip_log = false
              begin
                has_ip_log = db.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='ip_log'").any?
              rescue SQLite3::Exception => e
                logger.error "Error checking ip_log table: #{e.message}"
              end
              
              # Create ip_log table if it doesn't exist
              unless has_ip_log
                begin
                  logger.info "Creating ip_log table in #{db_path}"
                  db.execute <<-SQL
                    CREATE TABLE ip_log (
                      ip TEXT,
                      user_agent TEXT,
                      access_time TEXT
                    )
                  SQL
                  db_updated = true
                rescue SQLite3::Exception => e
                  logger.error "Error creating ip_log table: #{e.message}"
                end
              end
              
              # Check if device_characteristics table exists
              has_device_characteristics = false
              begin
                has_device_characteristics = db.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='device_characteristics'").any?
              rescue SQLite3::Exception => e
                logger.error "Error checking device_characteristics table: #{e.message}"
              end
              
              # Create device_characteristics table if it doesn't exist
              unless has_device_characteristics
                begin
                  logger.info "Creating device_characteristics table in #{db_path}"
                  db.execute <<-SQL
                    CREATE TABLE device_characteristics (
                      id INTEGER PRIMARY KEY,
                      characteristics TEXT,
                      updated_at TEXT
                    )
                  SQL
                  db_updated = true
                rescue SQLite3::Exception => e
                  logger.error "Error creating device_characteristics table: #{e.message}"
                end
              end
              
              # Get device info to potentially add to browser_keys
              device_info = db.get_first_row("SELECT device_id, handle FROM device_info LIMIT 1")
              if device_info && device_info[0] && has_browser_keys
                # Check if this device_id is already in browser_keys
                existing_key = db.execute("SELECT 1 FROM browser_keys WHERE browser_id = ? LIMIT 1", [device_info[0]]).any?
                
                unless existing_key
                  begin
                    logger.info "Adding device_id to browser_keys in #{db_path}"
                    db.execute(
                      "INSERT OR IGNORE INTO browser_keys (browser_id, added_at, last_used, pending) VALUES (?, ?, ?, ?)",
                      [device_info[0], Time.current.iso8601, Time.current.iso8601, 0]
                    )
                    db_updated = true
                  rescue SQLite3::Exception => e
                    logger.error "Error adding device_id to browser_keys: #{e.message}"
                  end
                end
              end
              
              db.close
              
              if db_updated
                updated_count += 1
              end
            rescue SQLite3::Exception => e
              logger.error "Error updating schema for #{db_path}: #{e.message}"
            end
          end
          
          logger.info "Database schema update complete. Processed #{device_count} databases, updated #{updated_count}."
          
          # Return summary
          {
            device_count: device_count,
            updated_count: updated_count
          }
        end
      end
      
      include DatabaseSchemaUpdater

def verify_session
  logger.debug "========== VERIFY SESSION =========="
  
  # Get device info if available
  device = current_device
  auth_version = nil
  user = nil
  
  if device && device[:handle].present?
    user = User.find_by(handle: device[:handle])
    auth_version = user&.auth_version
  end
  
  # Return authentication status
  if device && user
    render json: {
      authenticated: true,
      handle: device[:handle],
      auth_version: auth_version || Time.current.to_i,
      sessions_valid_after: user&.sessions_valid_after&.to_i,
      login_time: session[:login_time] # Send current login time for client validation
    }
  else
    render json: {
      authenticated: false,
      auth_version: Time.current.to_i
    }
  end
end

      # New endpoint for checking handle existence without triggering authentication
      def check_handle
        begin
          handle = params[:handle]
          logger.debug "Checking handle: #{handle}"
          
          user = User.find_by(handle: handle)
          logger.debug "User found: #{user.present?}"
          
          if user
            device_key = request.headers['HTTP_X_DEVICE_KEY']
            device_header = request.headers['HTTP_X_DEVICE_HEADER']
            is_your_device = false
            device_confidence = 'low'
            confidence_score = 0
            
            # Check for device recognition
            if defined?(DeviceRecognitionService) && (device_key || device_header)
              logger.debug "Performing device recognition check for handle: #{handle}"
              service = DeviceRecognitionService.new(device_key, session, logger, device_header)
              
              # Try to find by device header first (cross-browser)
              if device_header
                header_match = service.find_device_by_header(device_header)
                if header_match && header_match[:handle] == handle
                  logger.debug "Device recognized by header for handle: #{handle}"
                  is_your_device = true
                  
                  # Calculate confidence
                  confidence_score = service.calculate_confidence_score(header_match, :header_match)
                  device_confidence = service.get_confidence_level(confidence_score)
                  logger.debug "Device confidence: #{device_confidence} (#{confidence_score})"
                end
              end
              
              # If not found by header, try browser key
              if !is_your_device && device_key
                browser_match = service.find_device_by_browser_key(device_key)
                if browser_match && browser_match[:handle] == handle
                  logger.debug "Device recognized by browser key for handle: #{handle}"
                  is_your_device = true
                  
                  # Calculate confidence
                  confidence_score = service.calculate_confidence_score(browser_match, :exact_browser_match)
                  device_confidence = service.get_confidence_level(confidence_score)
                  logger.debug "Device confidence: #{device_confidence} (#{confidence_score})"
                end
              end
            else
              # Legacy device check (fallback)
              Dir.glob(Rails.root.join('db', 'devices', '*.sqlite3')).each do |db_path|
                begin
                  db = SQLite3::Database.new(db_path)
                  device_info = db.get_first_row("SELECT device_id, handle FROM device_info LIMIT 1")
                  db.close
                  
                  if device_info && device_info[0] == device_key && device_info[1] == handle
                    is_your_device = true
                    device_confidence = 'high'
                    confidence_score = 90
                    break
                  end
                rescue StandardError => e
                  logger.error "Error checking device: #{e.message}"
                end
              end
            end

            # Check if PIN is available
            pin_available = user.pin_hash.present?
            
            render json: {
              exists: true,
              is_your_device: is_your_device,
              device_confidence: device_confidence,
              confidence_score: confidence_score,
              masked_phone: mask_phone(user.phone),
              masked_handle: mask_handle(handle),
              pin_available: pin_available
            }
          else
            render json: { exists: false }
          end
        rescue StandardError => e
          logger.error "Error in check_handle: #{e.class} - #{e.message}"
          logger.error e.backtrace.join("\n")
          render json: { error: e.message, status: 'error' }, status: :internal_server_error
        end
      end

      # Check phone existence separately
def check_phone
  phone = params[:phone]
  
  begin
    normalized_phone = normalize_phone(phone)
    logger.debug "Checking phone: #{normalized_phone}"
    
    # IMPORTANT: Always store the normalized phone in session regardless of flow
    session[:verification_phone] = normalized_phone
    logger.debug "Stored phone in session: #{normalized_phone}"
    
    user = User.find_by(phone: normalized_phone)
    
    if user
      device_key = request.headers['HTTP_X_DEVICE_KEY']
      device_header = request.headers['HTTP_X_DEVICE_HEADER']
      is_your_device = false
      device_confidence = 'low'
      confidence_score = 0
      
      # Check for device recognition
      if defined?(DeviceRecognitionService) && (device_key || device_header)
        logger.debug "Performing device recognition check for phone: #{normalized_phone}"
        service = DeviceRecognitionService.new(device_key, session, logger, device_header)
        
        # Try to find by device header first (cross-browser)
        if device_header
          header_match = service.find_device_by_header(device_header)
          if header_match && header_match[:phone] == normalized_phone
            logger.debug "Device recognized by header for phone: #{normalized_phone}"
            is_your_device = true
            
            # Calculate confidence
            confidence_score = service.calculate_confidence_score(header_match, :header_match)
            device_confidence = service.get_confidence_level(confidence_score)
            logger.debug "Device confidence: #{device_confidence} (#{confidence_score})"
          end
        end
        
        # If not found by header, try browser key
        if !is_your_device && device_key
          browser_match = service.find_device_by_browser_key(device_key)
          if browser_match && browser_match[:phone] == normalized_phone
            logger.debug "Device recognized by browser key for phone: #{normalized_phone}"
            is_your_device = true
            
            # Calculate confidence
            confidence_score = service.calculate_confidence_score(browser_match, :exact_browser_match)
            device_confidence = service.get_confidence_level(confidence_score)
            logger.debug "Device confidence: #{device_confidence} (#{confidence_score})"
          end
        end
      else
        # Legacy device check (fallback)
        Dir.glob(Rails.root.join('db', 'devices', '*.sqlite3')).each do |db_path|
          begin
            db = SQLite3::Database.new(db_path)
            device_info = db.get_first_row("SELECT device_id, phone FROM device_info LIMIT 1")
            db.close
            
            if device_info && device_info[0] == device_key && device_info[1] == normalized_phone
              is_your_device = true
              device_confidence = 'high'
              confidence_score = 90
              break
            end
          rescue StandardError => e
            logger.error "Error checking device: #{e.message}"
          end
        end
      end

      # Check if PIN is available
      pin_available = user.pin_hash.present?
      
      render json: {
        exists: true,
        is_your_device: is_your_device,
        device_confidence: device_confidence,
        confidence_score: confidence_score,
        handle: user.handle,
        masked_phone: mask_phone(normalized_phone),
        masked_handle: mask_handle(user.handle),
        pin_available: pin_available
      }
    else
      # No existing user - phone is available for registration
      # IMPORTANT: Set a flag for registration flow
      session[:registration_flow] = true
      
      render json: { 
        exists: false,
        phone: normalized_phone,
        masked_phone: mask_phone(normalized_phone),
        message: "This phone number is available for registration."
      }
    end
  rescue => e
    logger.error "Error in check_phone: #{e.message}"
    render json: { error: e.message }, status: :unprocessable_entity
  end
end

      # New fast_authenticate endpoint for high-confidence cross-browser scenarios
      def fast_authenticate
        logger.debug "========== FAST AUTHENTICATE START =========="
        identifier = params[:identifier]
        
        unless identifier
          return render json: { error: 'No identifier provided', status: 'error' }, status: :unprocessable_entity
        end
        
        logger.debug "Fast authentication for identifier: #{identifier}"
        
        # Get device identifiers
        device_key = request.headers['HTTP_X_DEVICE_KEY']
        device_header = request.headers['HTTP_X_DEVICE_HEADER']
        
        if !device_key && !device_header
          logger.debug "No device identifiers available for fast authentication"
          return render json: { status: 'verification_needed' }
        end
        
        begin
          if defined?(DeviceRecognitionService)
            # Use the enhanced service for confidence-based authentication
            service = DeviceRecognitionService.new(device_key, session, logger, device_header)
            
            result = service.fast_authenticate(identifier)
            logger.debug "Fast authenticate result: #{result[:status]}"
            
            case result[:status]
            when 'authenticated'
              # High confidence match - proceed with auto-login
              logger.debug "Fast authentication succeeded with high confidence"
              
              # Store session data using helper
              ensure_complete_session_data({
                handle: result[:handle],
                guid: result[:guid],
                phone: result[:phone],
                device_key: result[:device_key],
                device_path: result[:path],
                auth_version: Time.current.to_i
              })
              
              # Return success response
              return render json: {
                status: 'authenticated',
                redirect_to: '/dashboard',
                handle: result[:handle],
                guid: result[:guid],
                device_key: result[:device_key],
                confidence_level: result[:confidence_level],
                confidence_score: result[:confidence_score],
                device_header_data: result[:device_header_data],
                auth_version: Time.current.to_i,
                message: "Welcome back #{result[:handle]}!"
              }
            when 'needs_pin_verification'
              # Medium confidence match - offer PIN verification
              logger.debug "Fast authentication offers PIN verification"
              
              # Store pending verification data
              if result[:path]
                session[:pending_device_path] = result[:path]
              end
              
              # Return PIN verification response
              return render json: {
                status: 'needs_pin_verification',
                handle: result[:handle],
                masked_phone: result[:masked_phone],
                guid: result[:guid],
                confidence_level: result[:confidence_level],
                confidence_score: result[:confidence_score],
                pin_available: true,
                message: "Welcome back #{result[:handle]}! You can verify with your PIN."
              }
            end
          end
          
          # Pass through the result directly or default to verification_needed
          render json: result || { status: 'verification_needed' }
        rescue => e
          logger.error "Error in fast_authenticate: #{e.message}"
          logger.error e.backtrace.join("\n")
          render json: { error: e.message, status: 'error' }, status: :internal_server_error
        end
      end

      # Generate handle suggestions API
      def suggest_handles
        base_handle = params[:handle].to_s.strip
        
        # Remove @ if present
        base_handle = base_handle.sub(/^@/, '')
        
        # Generate suggestions
        suggestions = generate_handle_suggestions(base_handle)
        
        # Check availability of each suggestion
        available_suggestions = suggestions.select do |handle|
          !User.exists?(handle: handle)
        end
        
        # Return at least 3 suggestions
        while available_suggestions.length < 3
          random_suggestion = "@#{base_handle}#{rand(1000)}"
          unless User.exists?(handle: random_suggestion)
            available_suggestions << random_suggestion
          end
        end
        
        render json: { suggestions: available_suggestions }
      end

      # Enhanced check_device method with improved cross-browser support
      def check_device
        logger.debug "========== CHECK DEVICE START =========="
        logger.debug "Current session: #{session.to_h}"
        
        # Get device identifiers from headers
        device_key = request.headers['HTTP_X_DEVICE_KEY']
        device_header = request.headers['HTTP_X_DEVICE_HEADER']
        
        # Log the identifiers
        logger.debug "Device key: #{device_key&.slice(0, 10)}..."
        if device_header
          logger.debug "Device header present for cross-browser recognition"
        end
        
        # Extract device characteristics from header if available
        device_characteristics = nil
        if device_header
          begin
            parsed_header = device_header.is_a?(String) ? JSON.parse(device_header) : device_header
            device_characteristics = parsed_header['deviceCharacteristics']
            
            if device_characteristics
              logger.debug "Device characteristics received: platform=#{device_characteristics['platform']}, " +
                          "screenSize=#{device_characteristics['screenWidth']}x#{device_characteristics['screenHeight']}, " +
                          "timezone=#{device_characteristics['timezone']}"
            end
          rescue => e
            logger.error "Error parsing device characteristics: #{e.message}"
          end
        end
        
        # SECURITY: Detect device registration flow
        is_device_registration = request.referrer&.include?('account_exists') || 
                                request.path.include?('account_exists') ||
                                request.original_fullpath.include?('account_exists') ||
                                params[:device_registration].present? ||
                                params.dig(:auth, :device_registration).present? ||
                                session[:device_registration_flow].present? ||
                                session[:pending_verification].present? ||
                                session[:verification_required].present?
        
        # Set flag for device registration flow
        if is_device_registration
          logger.debug "SECURITY: Device registration flow detected - requiring verification"
          session[:device_registration_flow] = true
          session[:pending_verification] = true
          auto_login_allowed = false
          
          # If we have enough info to force verification, do it immediately
          if session[:current_handle].present? && session[:verification_phone].present?
            logger.debug "SECURITY: Found session data, forcing verification: #{session[:current_handle]}"
            
            # Send verification code
            send_verification(session[:verification_phone])
            
            # Return verification required response
            return render json: {
              status: 'needs_quick_verification',
              handle: session[:current_handle],
              masked_phone: mask_phone(session[:verification_phone]),
              message: "Security verification required for #{session[:current_handle]}"
            }
          end
        else
          # For normal flows, allow auto-login
          auto_login_allowed = true
        end

        # Skip if recently checked with valid data - but only if not in device registration
        if !is_device_registration && session[:last_check] && Time.now.to_i - session[:last_check] < 5
          if session[:current_handle] && session[:device_session] == 'authenticated'
            logger.debug "Using cached session handle: #{session[:current_handle]}"
            return render json: {
              status: 'authenticated',
              handle: session[:current_handle],
              device_key: session[:current_device_id],
              guid: session[:current_guid],
              device_header_data: generate_device_header_data(
                session[:current_device_id],
                session[:current_guid],
                session[:current_handle]
              ),
              auth_version: Time.current.to_i,
              message: "Welcome back #{session[:current_handle]}!"
            }
          end
        end
        
        session[:last_check] = Time.now.to_i

        # Handle logout
        if request.referrer&.include?('logout') || session[:logging_out] || request.path.include?('logout')
          logger.debug "Logout flow detected, skipping device check"
          session[:logging_out] = false 
          return render json: { 
            status: 'logged_out',
            next: 'logout_confirmation'
          }
        end
        
        # Check for previous user info (from logout)
        previous_handle = session[:previous_handle]
        previous_guid = session[:previous_guid]
        previous_phone = session[:previous_phone]
        
        if previous_handle && (previous_guid || previous_phone)
          logger.debug "Found previous user data: #{previous_handle}"
          
          # Look for any device for this user
          matching_device = nil
          
          Dir.glob(Rails.root.join('db', 'devices', '*.sqlite3')).each do |db_path|
            begin
              device_info = get_device_info(db_path)
              next unless device_info
              
              # Match by handle
              if device_info[:handle] == previous_handle
                matching_device = {
                  path: db_path.split('db/').last,
                  info: device_info
                }
                logger.debug "Found device for previous user: #{matching_device[:info][:handle]}"
                break
              end
            rescue StandardError => e
              logger.error "Error reading device database #{db_path}: #{e.message}"
              next
            end
          end
          
          if matching_device
            # Calculate confidence for cross-browser recognition
            confidence_score = 50 # Default medium confidence
            confidence_level = 'medium'
            
            if defined?(DeviceRecognitionService) && device_header
              # Use the enhanced service for confidence calculation
              service = DeviceRecognitionService.new(device_key, session, logger, device_header)
              header_match = service.find_device_by_header(device_header)
              
              if header_match && header_match[:handle] == previous_handle
                confidence_score = service.calculate_confidence_score(header_match, :header_match)
                confidence_level = service.get_confidence_level(confidence_score)
                logger.debug "Cross-browser confidence: #{confidence_level} (#{confidence_score})"
              end
            end
            
            # Check if recently verified or high confidence - if so, auto-login
            is_recently_verified = matching_device[:info][:last_verified_at] && 
                                  Time.parse(matching_device[:info][:last_verified_at]) > 30.days.ago
            
            # Only auto-login if not in device registration flow
            if (is_recently_verified || confidence_level == 'high') && auto_login_allowed
              # Auto-login for cross-browser on same device
              ensure_complete_session_data({
                handle: matching_device[:info][:handle],
                guid: matching_device[:info][:guid],
                phone: matching_device[:info][:phone],
                device_key: matching_device[:info][:device_id],
                device_path: matching_device[:path],
                auth_version: Time.current.to_i
              })
              
              # NEW: If this is a cross-browser scenario, add browser to device
              if device_key != matching_device[:info][:device_id]
                logger.debug "Cross-browser detected, adding browser to device"
                add_browser_to_device(matching_device[:path], device_key, request.user_agent)
                
                # Store device characteristics if provided
                if device_characteristics && matching_device[:path]
                  update_device_characteristics(matching_device[:path], device_characteristics)
                end
              end
              
              return render json: {
                status: 'authenticated',
                redirect_to: '/dashboard',
                device_key: matching_device[:info][:device_id],
                handle: matching_device[:info][:handle],
                guid: matching_device[:info][:guid],
                device_header_data: generate_device_header_data(
                  matching_device[:info][:device_id],
                  matching_device[:info][:guid],
                  matching_device[:info][:handle]
                 ),
                auth_version: Time.current.to_i,
                confidence_level: confidence_level,
                confidence_score: confidence_score,
                message: "Welcome back #{matching_device[:info][:handle]}!"
              }
            elsif confidence_level == 'medium' && User.find_by(handle: previous_handle)&.pin_hash.present?
              # For medium confidence with PIN, offer PIN verification
              session[:pending_device_path] = matching_device[:path]
              session[:verification_phone] = matching_device[:info][:phone]
              session[:current_handle] = matching_device[:info][:handle]
              
              return render json: {
                status: 'needs_pin_verification',
                handle: previous_handle,
                device_key: device_key || generate_device_key(),
                masked_phone: mask_phone(matching_device[:info][:phone]),
                path: matching_device[:path],
                confidence_level: confidence_level,
                confidence_score: confidence_score,
                pin_available: true,
                message: "Welcome back #{previous_handle}! You can verify with your PIN."
              }
            else
              # Return with quick verification
              session[:pending_device_path] = matching_device[:path]
              session[:verification_phone] = matching_device[:info][:phone]
              session[:current_handle] = matching_device[:info][:handle] # Save handle for welcome back
              session[:pending_verification] = true
              
              send_verification(matching_device[:info][:phone])
              
              pin_available = User.find_by(handle: previous_handle)&.pin_hash.present?
              
              return render json: {
                status: 'needs_quick_verification',
                handle: previous_handle,
                device_key: device_key || generate_device_key(),
                masked_phone: mask_phone(matching_device[:info][:phone]),
                confidence_level: confidence_level,
                confidence_score: confidence_score,
                pin_available: pin_available,
                message: "Welcome back #{previous_handle}! Please verify this device."
              }
            end
          end
        end
        
        begin
          logger.debug "========== ENSURE DEVICE DIRECTORY =========="
          ensure_device_directory
          
          # ENHANCED: Use the improved DeviceRecognitionService
          if defined?(DeviceRecognitionService)
            logger.debug "Using DeviceRecognitionService"
            
            # Pass device header for cross-browser recognition
            service = DeviceRecognitionService.new(
              device_key, 
              session, 
              logger, 
              device_header
            )
            
            device_result = service.recognize_device
            
            case device_result[:status]
            when 'authenticated'
              # Only allow auto-login if not in device registration flow
              if auto_login_allowed
                # Store session data using the helper
                ensure_complete_session_data({
                  handle: device_result[:handle],
                  guid: device_result[:guid],
                  phone: device_result[:phone],
                  device_key: device_result[:device_key],
                  device_path: device_result[:path],
                  auth_version: Time.current.to_i
                })
                
                # Cross-browser scenario - important for adding the current browser to the device
                if device_result[:cross_browser] && device_key && device_key != device_result[:device_key]
                  logger.debug "Cross-browser detected, adding browser to device"
                  
                  # Add this browser key to the device database
                  add_browser_to_device(device_result[:path], device_key, request.user_agent)
                  
                  # Store device characteristics if provided
                  if device_characteristics && device_result[:path]
                    update_device_characteristics(device_result[:path], device_characteristics)
                  end
                end
                
                render json: {
                  status: 'authenticated',
                  redirect_to: '/dashboard',
                  device_key: device_key || device_result[:device_key],
                  handle: device_result[:handle],
                  guid: device_result[:guid],
                  phone: mask_phone(device_result[:phone]),
                  confidence_level: device_result[:confidence_level],
                  confidence_score: device_result[:confidence_score],
                  device_header_data: generate_device_header_data(
                    device_result[:device_key],
                    device_result[:guid],
                    device_result[:handle]
                   ),
                  auth_version: Time.current.to_i,
                  message: "Welcome back #{device_result[:handle]}!"
                }
                return
              else
                # Need verification since we're in device registration flow
                logger.debug "Device is authenticated but verification required due to device registration flow"
                session[:pending_device_path] = device_result[:path]
                session[:verification_phone] = device_result[:phone]
                session[:current_handle] = device_result[:handle]
                session[:pending_verification] = true
                
                send_verification(device_result[:phone])
                
                render json: {
                  status: 'needs_quick_verification',
                  database_path: device_result[:path],
                  handle: device_result[:handle],
                  guid: device_result[:guid],
                  device_key: device_result[:device_key],
                  masked_phone: device_result[:masked_phone],
                  confidence_level: device_result[:confidence_level],
                  confidence_score: device_result[:confidence_score],
                  pin_available: device_result[:pin_available],
                  message: "Welcome back #{device_result[:handle]}! Please verify this device."
                }
                return
              end
            
            when 'needs_pin_verification'
              # PIN verification path for medium confidence
              logger.debug "PIN verification available for device"
              
              # Store pending device data for verification
              session[:pending_device_path] = device_result[:path]
              session[:verification_phone] = device_result[:phone]
              session[:current_handle] = device_result[:handle]
              
              render json: {
                status: 'needs_pin_verification',
                database_path: device_result[:path],
                handle: device_result[:handle],
                guid: device_result[:guid],
                device_key: device_result[:device_key],
                masked_phone: device_result[:masked_phone],
                confidence_level: device_result[:confidence_level],
                confidence_score: device_result[:confidence_score],
                pin_available: true,
                message: "Welcome back #{device_result[:handle]}! You can verify with your PIN."
              }
              return
              
            when 'needs_quick_verification'
              # Store pending device data for verification
              session[:pending_device_path] = device_result[:path]
              session[:verification_phone] = device_result[:phone]
              session[:current_handle] = device_result[:handle]
              session[:pending_verification] = true
              
              send_verification(device_result[:phone])
              
              render json: {
                status: 'needs_quick_verification',
                database_path: device_result[:path],
                handle: device_result[:handle],
                guid: device_result[:guid],
                device_key: device_result[:device_key],
                masked_phone: device_result[:masked_phone],
                confidence_level: device_result[:confidence_level],
                confidence_score: device_result[:confidence_score],
                pin_available: device_result[:pin_available],
                message: "Welcome back #{device_result[:handle]}! Please verify this device."
              }
              return
              
            when 'show_options', 'new_device'
              # No matching device found - create a new one
              create_new_device_database(device_key, device_characteristics)
              return
            end
          else
            # Fallback if service not available - create new device
            create_new_device_database(device_key, device_characteristics)
          end
          
        rescue SQLite3::Exception => e
          logger.error "Database error in check_device: #{e.message}\n#{e.backtrace.join("\n")}"
          render json: { error: 'Database error', details: e.message }, status: :internal_server_error
        rescue StandardError => e
          logger.error "Device check error: #{e.class} - #{e.message}\n#{e.backtrace.join("\n")}"
          render json: { error: 'Internal server error', details: e.message }, status: :internal_server_error
        end
        logger.debug "========== CHECK DEVICE END =========="
      end

      # Enhanced create_new_device_database with browser key and device characteristics support
def create_new_device_database(browser_key, device_characteristics = nil)
  logger.debug "========== CREATE NEW DEVICE DATABASE =========="
  logger.debug "Browser key: #{browser_key&.slice(0, 10)}..."
  logger.debug "Device characteristics provided: #{!!device_characteristics}"
  
  # Check for device header and handle it
  device_header = request.headers['HTTP_X_DEVICE_HEADER']
  
  # NEW: Try to match existing device by characteristics before creating new one
  if device_characteristics && session[:current_handle]
    logger.debug "Looking for existing devices for user: #{session[:current_handle]}"
    
    # Look for devices for this user with similar characteristics
    matching_device = nil
    
    Dir.glob(Rails.root.join('db', 'devices', '*.sqlite3')).each do |db_path|
      begin
        db = SQLite3::Database.new(db_path)
        
        # Check if this belongs to the current user
        device_info = db.get_first_row("SELECT device_id, handle, guid, phone FROM device_info WHERE handle = ? LIMIT 1", [session[:current_handle]])
        
        if device_info
          # Check for device characteristics
          has_table = db.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='device_characteristics'").any? rescue false
          
          if has_table
            stored_json = db.get_first_value("SELECT characteristics FROM device_characteristics LIMIT 1")
            
            if stored_json
              begin
                stored_characteristics = JSON.parse(stored_json)
                
                # Compare characteristics - look for strong matches
                platform_match = device_characteristics['platform'] == stored_characteristics['platform']
                timezone_match = device_characteristics['timezone'] == stored_characteristics['timezone']
                
                if platform_match && timezone_match
                  logger.debug "Found existing device with matching characteristics"
                  matching_device = {
                    path: db_path.split('db/').last,
                    device_id: device_info[0],
                    handle: device_info[1],
                    guid: device_info[2],
                    phone: device_info[3]
                  }
                  break
                end
              rescue => e
                logger.error "Error comparing characteristics: #{e.message}"
              end
            end
          end
        end
        
        db.close
      rescue => e
        logger.error "Error checking device: #{e.message}"
      end
    end
    
    if matching_device
      logger.debug "Using existing device instead of creating new one: #{matching_device[:path]}"
      
      # Add browser key to existing device
      add_browser_to_device(matching_device[:path], browser_key, request.user_agent)
      
      # Update characteristics
      update_device_characteristics(matching_device[:path], device_characteristics)
      
      # Set session data using helper
      ensure_complete_session_data({
        handle: matching_device[:handle],
        guid: matching_device[:guid],
        phone: matching_device[:phone],
        device_key: matching_device[:device_id],
        device_path: matching_device[:path],
        auth_version: Time.current.to_i
      })
      
      # Return positive response
      return render json: {
        status: 'authenticated',
        redirect_to: '/dashboard',
        device_key: matching_device[:device_id],
        handle: matching_device[:handle],
        guid: matching_device[:guid],
        device_header_data: generate_device_header_data(
          matching_device[:device_id],
          matching_device[:guid],
          matching_device[:handle]
        ),
        auth_version: Time.current.to_i,
        message: "Welcome back #{matching_device[:handle]}!"
      }
    end
  end
  
  # EXISTING CODE: The rest of the method checks if there's a valid device header
  if device_header && defined?(DeviceRecognitionService)
    logger.debug "Checking device header for cross-browser recognition"
    service = DeviceRecognitionService.new(browser_key, session, logger, device_header)
    header_match = service.find_device_by_header(device_header)
    
    if header_match
      logger.debug "Found device via header - using existing device: #{header_match[:handle]}"
      
      # Add this browser to the existing device
      if browser_key && header_match[:path]
        add_browser_to_device(header_match[:path], browser_key, request.user_agent)
        
        # Update device characteristics if provided
        if device_characteristics && header_match[:path]
          update_device_characteristics(header_match[:path], device_characteristics)
        end
      end
      
      if header_match[:handle].present?
        # Calculate confidence score
        confidence_score = service.calculate_confidence_score(header_match, :header_match)
        confidence_level = service.get_confidence_level(confidence_score)
        
        # This is a recognized device, handle appropriately based on confidence
        if confidence_level == 'high'
          # Auto-login for high confidence cross-browser using helper
          ensure_complete_session_data({
            handle: header_match[:handle],
            guid: header_match[:guid],
            phone: header_match[:phone],
            device_key: header_match[:device_id],
            device_path: header_match[:path],
            auth_version: Time.current.to_i
          })
          
          return render json: {
            status: 'authenticated',
            redirect_to: '/dashboard',
            device_key: browser_key || header_match[:device_id],
            handle: header_match[:handle],
            guid: header_match[:guid],
            phone: mask_phone(header_match[:phone]),
            confidence_level: confidence_level,
            confidence_score: confidence_score,
            device_header_data: generate_device_header_data(
              header_match[:device_id],
              header_match[:guid],
              header_match[:handle]
            ),
            auth_version: Time.current.to_i,
            message: "Welcome back #{header_match[:handle]}!"
          }
        elsif confidence_level == 'medium' && service.has_pin?(header_match[:handle])
          # Medium confidence with PIN
          session[:pending_device_path] = header_match[:path]
          session[:verification_phone] = header_match[:phone]
          session[:current_handle] = header_match[:handle]
          
          return render json: {
            status: 'needs_pin_verification',
            database_path: header_match[:path],
            handle: header_match[:handle],
            guid: header_match[:guid],
            device_key: header_match[:device_id],
            masked_phone: mask_phone(header_match[:phone]),
            confidence_level: confidence_level,
            confidence_score: confidence_score,
            pin_available: true,
            message: "Welcome back #{header_match[:handle]}! You can verify with your PIN."
          }
        else
          # Needs verification
          session[:pending_device_path] = header_match[:path]
          session[:verification_phone] = header_match[:phone]
          session[:current_handle] = header_match[:handle]
          session[:pending_verification] = true
          
          send_verification(header_match[:phone])
          
          return render json: {
            status: 'needs_quick_verification',
            database_path: header_match[:path],
            handle: header_match[:handle],
            guid: header_match[:guid],
            device_key: header_match[:device_id],
            masked_phone: mask_phone(header_match[:phone]),
            confidence_level: confidence_level,
            confidence_score: confidence_score,
            pin_available: service.has_pin?(header_match[:handle]),
            message: "Welcome back #{header_match[:handle]}! Please verify this device."
          }
        end
      end
    end
  end
  
  # EXISTING CODE: Generate device key if not provided
  device_key = browser_key || SecureRandom.hex(32)
  device_guid = SecureRandom.uuid
  new_path = "devices/#{device_guid}.sqlite3"
  
  # Log information
  logger.debug "Creating new device database"
  logger.debug "Device key: #{device_key}"
  logger.debug "GUID: #{device_guid}"
  logger.debug "Path: #{new_path}"
  
  begin
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
          device_type TEXT
          custom_name TEXT
          is_trusted INTEGER DEFAULT 0,
          browser_info TEXT
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
      
      # Create ip_log table
      db.execute <<-SQL
        CREATE TABLE ip_log (
          ip TEXT,
          user_agent TEXT,
          access_time TEXT
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
      
      # NEW: Create WebAuthn credentials table
      db.execute <<-SQL
        CREATE TABLE webauthn_credentials (
          id INTEGER PRIMARY KEY,
          credential_id TEXT UNIQUE,
          public_key TEXT,
          user_id INTEGER,
          device_guid TEXT,
          created_at TEXT,
          last_used_at TEXT,
          nickname TEXT,
          FOREIGN KEY (user_id) REFERENCES users(id)
        )
      SQL
      
      # Extract device type from characteristics (ADD THIS BLOCK FIRST)
      device_type = "Unknown Device"
      if device_characteristics
      begin
      if device_characteristics.is_a?(String)
      characteristics = JSON.parse(device_characteristics)
      else
      characteristics = device_characteristics
      end
    
      device_type = characteristics["deviceType"] || "Desktop"
      rescue => e
      logger.error "Error extracting device type: #{e.message}"
      end
      end      

      # Insert basic device info
      db.execute(
      "INSERT INTO device_info (device_id, guid, created_at, device_type, device_name) VALUES (?, ?, ?, ?, ?)",
      [device_key, device_guid, Time.current.iso8601, device_type, device_type]
      )
      

      # Initialize sync state
      db.execute(
        "INSERT INTO sync_state (last_sync, status) VALUES (?, ?)",
        [Time.current.iso8601, 'initialized']
      )
      
      # Add browser key to browser_keys table
      db.execute(
        "INSERT INTO browser_keys (browser_id, browser_name, user_agent, added_at, last_used, pending) VALUES (?, ?, ?, ?, ?, ?)",
        [browser_key, detect_browser(request.user_agent), request.user_agent, Time.current.iso8601, Time.current.iso8601, 0]
      )
      
      # Add IP address to log
      if request.remote_ip
        db.execute(
          "INSERT INTO ip_log (ip, user_agent, access_time) VALUES (?, ?, ?)",
          [request.remote_ip, request.user_agent, Time.current.iso8601]
        )
        logger.debug "Added IP to log"
      end
      
      # Store device characteristics if provided
      if device_characteristics
        characteristics_json = device_characteristics.is_a?(Hash) ? 
                              device_characteristics.to_json : device_characteristics
        
        db.execute(
          "INSERT INTO device_characteristics (characteristics, updated_at) VALUES (?, ?)",
          [characteristics_json, Time.current.iso8601]
        )
        logger.debug "Stored device characteristics"
      end
    end
    db.close
    
    # Store information in session
    session[:pending_device_path] = new_path
    session[:device_key] = device_key
    
    # Return response
    render json: {
      status: 'show_options',
      device_not_registered: true,
      message: "This device is not registered. Please login or create a new account.",
      database_path: new_path,
      guid: device_guid,
      device_key: device_key
    }
    
  rescue SQLite3::Exception => e
    logger.error "Database error creating device: #{e.message}"
    logger.error e.backtrace.join("\n")
    render json: { error: 'Database error', details: e.message }, status: :internal_server_error
  rescue StandardError => e
    logger.error "Error creating device: #{e.message}"
    logger.error e.backtrace.join("\n")
    render json: { error: 'Internal server error', details: e.message }, status: :internal_server_error
  end
end

      # Add browser key to device 
      def add_browser_to_device(device_path, browser_key, user_agent = nil)
        return unless device_path && browser_key
        
        logger.debug "========== ADD BROWSER TO DEVICE =========="
        logger.debug "Adding browser #{browser_key.slice(0, 10)}... to device #{device_path}"
        
        begin
          db = SQLite3::Database.new(Rails.root.join('db', device_path))
          
          # First, verify this is an actual device database with a device_info table
          has_device_info = false
          begin
            has_device_info = db.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='device_info'").any?
          rescue SQLite3::Exception => e
            logger.error "Error checking device_info table: #{e.message}"
          end
          
          unless has_device_info
            logger.error "Invalid device database: device_info table not found"
            db.close
            return false
          end
          
          # Check if browser_keys table exists
          has_browser_keys = false
          begin
            has_browser_keys = db.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='browser_keys'").any?
          rescue SQLite3::Exception => e
            logger.error "Error checking browser_keys table: #{e.message}"
          end
          
          # Create browser_keys table if it doesn't exist
          unless has_browser_keys
            logger.debug "Creating browser_keys table"
            db.execute("CREATE TABLE IF NOT EXISTS browser_keys (
              browser_id TEXT PRIMARY KEY,
              browser_name TEXT,
              user_agent TEXT,
              added_at TEXT,
              last_used TEXT,
              pending BOOLEAN
            )")
          end
          
          add_browser_key_to_device_db(db, browser_key, user_agent)
          
          db.close
          
          logger.debug "Browser added successfully to device"
          true
        rescue StandardError => e
          logger.error "Error adding browser to device: #{e.message}"
          logger.error e.backtrace.join("\n")
          false
        end
      end

      # Update device characteristics
      def update_device_characteristics(device_path, characteristics)
        return unless device_path && characteristics
        
        logger.debug "========== UPDATE DEVICE CHARACTERISTICS =========="
        logger.debug "Updating characteristics for device: #{device_path}"
        
        begin
          db = SQLite3::Database.new(Rails.root.join('db', device_path))
          
          # Check if device_characteristics table exists
          has_table = false
          begin
            has_table = db.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='device_characteristics'").any?
          rescue SQLite3::Exception => e
            logger.error "Error checking device_characteristics table: #{e.message}"
          end
          
          # Create table if it doesn't exist
          unless has_table
            logger.debug "Creating device_characteristics table"
            db.execute("CREATE TABLE IF NOT EXISTS device_characteristics (
              id INTEGER PRIMARY KEY,
              characteristics TEXT,
              updated_at TEXT
            )")
          end
          
          # Convert characteristics to JSON if it's a hash
          characteristics_json = characteristics.is_a?(Hash) ? characteristics.to_json : characteristics
          
          # Check if record exists
          has_record = db.execute("SELECT 1 FROM device_characteristics LIMIT 1").any? rescue false
          
          if has_record
            # Update existing record
            db.execute(
              "UPDATE device_characteristics SET characteristics = ?, updated_at = ?",
              [characteristics_json, Time.current.iso8601]
            )
          else
            # Insert new record
            db.execute(
              "INSERT INTO device_characteristics (characteristics, updated_at) VALUES (?, ?)",
              [characteristics_json, Time.current.iso8601]
            )
          end
          
          db.close
          logger.debug "Device characteristics updated successfully"
          true
        rescue StandardError => e
          logger.error "Error updating device characteristics: #{e.message}"
          false
        end
      end

      # Helper method to add browser key to database
      def add_browser_key_to_device_db(db, browser_key, user_agent = nil)
        # Extract browser name from user agent
        browser_name = detect_browser(user_agent || request.user_agent)
        
        # Add browser key to table
        logger.debug "Adding browser key with name: #{browser_name}"
        db.execute(
          "INSERT OR REPLACE INTO browser_keys (browser_id, browser_name, user_agent, added_at, last_used, pending) VALUES (?, ?, ?, ?, ?, ?)",
          [browser_key, browser_name, user_agent || request.user_agent, Time.current.iso8601, Time.current.iso8601, 0]
        )
        
        # Add IP to log
        ip = request.remote_ip
        if ip
          # Ensure ip_log table exists
          db.execute("CREATE TABLE IF NOT EXISTS ip_log (
            ip TEXT,
            user_agent TEXT,
            access_time TEXT
          )")
          
          # Add IP to log
          db.execute(
            "INSERT INTO ip_log (ip, user_agent, access_time) VALUES (?, ?, ?)",
            [ip, user_agent || request.user_agent, Time.current.iso8601]
          )
          
          logger.debug "Added IP #{ip} to log"
        end
        
        # Update sync state
        db.execute(
          "INSERT INTO sync_state (last_sync, status) VALUES (?, ?)",
          [Time.current.iso8601, 'browser_added']
        )
      end

      # Add browser key if available
      def add_browser_key_if_available(device_path)
        browser_key = request.headers['HTTP_X_DEVICE_KEY']
        return unless browser_key && device_path
        
        logger.debug "Adding browser key if available: #{browser_key.slice(0, 10)}..."
        add_browser_to_device(device_path, browser_key, request.user_agent)
      end
      
      # ENHANCED: verify_code method with support for browser tracking
def verify_code
  logger.debug "========== VERIFY CODE START =========="
  logger.debug "Parameters: #{params.inspect}"
  logger.debug "Session before: #{session.to_h}"
  
  code = params[:code].strip
  phone = session[:verification_phone] || params[:phone]
  cache_key = "verification:#{phone}"
  
  # Important: check verification FIRST before requiring device path
  @@verification_mutex ||= Mutex.new
  verification = nil
  
  @@verification_mutex.synchronize do
    verification = Rails.cache.read(cache_key)
    
    unless verification
      logger.error "No verification found in cache for key: #{cache_key}"
      return render json: { error: 'Verification code expired', status: 'error', auth_version: Time.current.to_i }, status: :unprocessable_entity
    end
    
    unless verification[:code].to_s == code.to_s
      logger.debug "Code verification failed"
      logger.debug "Expected: #{verification[:code]}"
      logger.debug "Received: #{code}"
      return render json: { error: 'Invalid verification code', status: 'error', auth_version: Time.current.to_i }, status: :unprocessable_entity
    end
  end
  
  # Handle session-only flow (with deferred device creation)
  if session[:pending_device_path].blank?
    logger.debug "Session-only flow (deferred device creation) - no device path yet"
    
    # More comprehensive flag detection
    handle_first = params[:handle_first] || 
                   params.dig(:auth, :handle_first) || 
                   session[:handle_first] == 'true'
                   
    stored_handle = session[:pending_handle] || params[:handle] || params.dig(:auth, :handle)
    
    # Find existing user or create new user
    user = User.find_by(phone: phone)
    
    if user 
      logger.debug "Existing user found: #{user.inspect}"
      
      # Now find or create device for this user
      device_path = find_or_create_device_for_user(user)
      session[:pending_device_path] = device_path

      # Get device ID for the session
      device_id = nil
      begin
        db_for_id = SQLite3::Database.new(Rails.root.join('db', device_path))
        device_id_info = db_for_id.get_first_row("SELECT device_id FROM device_info LIMIT 1")
        device_id = device_id_info[0] if device_id_info
        db_for_id.close
      rescue => e
        logger.error "Error getting device ID for session: #{e.message}"
      end

      # Use helper for consistent session data
      ensure_complete_session_data({
        handle: user.handle,
        guid: user.guid,
        phone: user.phone,
        device_key: device_id,
        device_path: device_path,
        auth_version: Time.current.to_i
      })
      
      # Add device characteristics if available
      device_header = request.headers['HTTP_X_DEVICE_HEADER']
      if device_header && device_path
        begin
          parsed_header = device_header.is_a?(String) ? JSON.parse(device_header) : device_header
          if parsed_header && parsed_header['deviceCharacteristics']
            update_device_characteristics(device_path, parsed_header['deviceCharacteristics'])
          end
        rescue => e
          logger.error "Error processing device characteristics: #{e.message}"
        end
      end
      
      # Now link device to user
      link_device_to_user(user, device_path)
      confirm_device(device_path)
      
      # Get device info for response
      db = SQLite3::Database.new(Rails.root.join('db', device_path))
      device_info = db.get_first_row("SELECT device_id FROM device_info LIMIT 1")
      db.close
      
      return render json: {
        status: 'authenticated',
        redirect_to: '/dashboard',
        device_key: device_info[0],
        guid: user.guid,
        handle: user.handle,
        device_header_data: generate_device_header_data(
          device_info[0],
          user.guid,
          user.handle
        ), 
        auth_version: Time.current.to_i,
      }

    elsif stored_handle.present?
      # New user with handle already provided
      logger.debug "Using stored handle for new user: #{stored_handle}"
      
      user = User.new(phone: phone, handle: stored_handle, guid: SecureRandom.uuid)
      if user.save
        # Create a new device for this user
        device_path = create_new_device_for_user(user)
        session[:pending_device_path] = device_path

        # Get device ID for the session
        device_id = nil
        begin
          db_for_id = SQLite3::Database.new(Rails.root.join('db', device_path))
          device_id_info = db_for_id.get_first_row("SELECT device_id FROM device_info LIMIT 1")
          device_id = device_id_info[0] if device_id_info
          db_for_id.close
        rescue => e
          logger.error "Error getting device ID for session: #{e.message}"
        end

        # Use helper for consistent session data
        ensure_complete_session_data({
          handle: user.handle,
          guid: user.guid,
          phone: user.phone,
          device_key: device_id,
          device_path: device_path,
          auth_version: Time.current.to_i
        })

        # Add device characteristics if available
        device_header = request.headers['HTTP_X_DEVICE_HEADER']
        if device_header
          begin
            parsed_header = device_header.is_a?(String) ? JSON.parse(device_header) : device_header
            if parsed_header && parsed_header['deviceCharacteristics']
              update_device_characteristics(device_path, parsed_header['deviceCharacteristics'])
            end
          rescue => e
            logger.error "Error processing device characteristics: #{e.message}"
          end
        end
        
        confirm_device(device_path)
        
        # Get device info for response
        db = SQLite3::Database.new(Rails.root.join('db', device_path))
        device_info = db.get_first_row("SELECT device_id FROM device_info LIMIT 1")
        db.close
        
        return render json: {
          status: 'authenticated',
          redirect_to: '/dashboard',
          device_key: device_info[0],
          guid: user.guid,
          handle: user.handle,
          device_header_data: generate_device_header_data(
            device_info[0],
            user.guid,
            user.handle
          ),
          auth_version: Time.current.to_i
        }
      else
        logger.error "Failed to create user with stored handle: #{user.errors.full_messages.join(', ')}"
        return render json: {
          status: 'needs_handle',
          phone: phone,
          code: code,
          errors: user.errors.full_messages
        }
      end
    else
      # New user without handle
      logger.debug "New user - needs handle creation"
      session[:verification_phone] = phone
      
      return render json: {
        status: 'needs_handle',
        phone: phone,
        masked_phone: mask_phone(phone)
      }
    end
  end
  
  # Original flow when device path is available
  device_path = session[:pending_device_path]
  
  logger.debug "Device path available: #{device_path}"
  logger.debug "Code: #{code}"
  logger.debug "Phone: #{phone}"
  logger.debug "Device Path: #{device_path}"
  logger.debug "Cache key: #{cache_key}"
  
  # More comprehensive flag detection for handle-first flow
  handle_first = params[:handle_first] || 
                params.dig(:auth, :handle_first) || 
                session[:handle_first] == 'true' ||
                (session[:pending_handle].present? && !session[:verification_phone].present?)
  
  # Improved device registration flow detection
  device_registration = params[:device_registration] || 
                        params.dig(:auth, :device_registration) || 
                        session[:device_registration_flow] || 
                        session[:device_registration] == 'true'
  
  # Enhanced debug logging
  logger.debug "Verification flags: handle_first=#{handle_first}, device_registration=#{device_registration}"
  logger.debug "Context: handle=#{params[:handle] || session[:pending_handle]}, phone=#{params[:phone] || session[:verification_phone]}"
  
  # Verification already checked above - no need to check again
  db = SQLite3::Database.new(Rails.root.join('db', device_path))
  device_info = db.get_first_row("SELECT device_id, handle, guid, phone FROM device_info LIMIT 1")
  logger.debug "Device info: #{device_info.inspect}"

  if device_info && device_info[1] # Quick verification for known device
    logger.debug "Known device - updating verification"
    update_device_verification(db, device_info[1])
    
    # Add browser key if different from device ID
    browser_key = request.headers['HTTP_X_DEVICE_KEY']
    if browser_key && browser_key != device_info[0]
      add_browser_key_to_device_db(db, browser_key, request.user_agent)
      logger.debug "Added browser key to device for cross-browser support"
      
      # Update device characteristics if available
      device_header = request.headers['HTTP_X_DEVICE_HEADER']
      if device_header
        begin
          parsed_header = device_header.is_a?(String) ? JSON.parse(device_header) : device_header
          if parsed_header && parsed_header['deviceCharacteristics']
            logger.debug "Updating device characteristics from header"
            update_device_characteristics(device_path, parsed_header['deviceCharacteristics'])
          end
        rescue => e
          logger.error "Error processing device characteristics: #{e.message}"
        end
      end
    end
    
    # Confirm any pending browser keys
    if defined?(DeviceRecognitionService)
      service = DeviceRecognitionService.new(browser_key, session, logger)
      service.confirm_pending_identifiers(device_path)
    end
    
    confirm_device(device_path)
    
    # Use helper for consistent session data
    ensure_complete_session_data({
      handle: device_info[1],
      guid: device_info[2],
      phone: device_info[3],
      device_key: device_info[0],
      device_path: device_path,
      auth_version: Time.current.to_i
    })
    
    db.close
    
    return render json: {
      status: 'authenticated',
      redirect_to: '/dashboard',
      device_key: device_info[0],
      guid: device_info[2],
      handle: device_info[1],
      device_header_data: generate_device_header_data(
        device_info[0],
        device_info[2],
        device_info[1]
      ),
      auth_version: Time.current.to_i
    }
  end
  db.close
  
  user = User.find_by(phone: phone)
  # Check if we already have a handle stored in the session or params
  stored_handle = session[:pending_handle] || params[:handle] || params.dig(:auth, :handle)
  
  if user 
    logger.debug "Existing user found: #{user.inspect}"
    link_device_to_user(user, device_path)
    
    # Add browser key if available
    add_browser_key_if_available(device_path)
    
    # Add device characteristics if available
    device_header = request.headers['HTTP_X_DEVICE_HEADER']
    if device_header
      begin
        parsed_header = device_header.is_a?(String) ? JSON.parse(device_header) : device_header
        if parsed_header && parsed_header['deviceCharacteristics']
          logger.debug "Updating device characteristics from header for existing user"
          update_device_characteristics(device_path, parsed_header['deviceCharacteristics'])
        end
      rescue => e
        logger.error "Error processing device characteristics: #{e.message}"
      end
    end
    
    confirm_device(device_path)
    
    # Get device info for response
    db = SQLite3::Database.new(Rails.root.join('db', device_path))
    device_info = db.get_first_row("SELECT device_id FROM device_info LIMIT 1")
    db.close
    
    # Use helper for consistent session data
    ensure_complete_session_data({
      handle: user.handle,
      guid: user.guid,
      phone: user.phone,
      device_key: device_info ? device_info[0] : nil,
      device_path: device_path,
      auth_version: Time.current.to_i
    })
    
    render json: {
      status: 'authenticated',
      redirect_to: '/dashboard',
      device_key: device_info[0],
      guid: user.guid,
      handle: user.handle,
      device_header_data: generate_device_header_data(
        device_info[0],
        user.guid,
        user.handle
      ),
      auth_version: Time.current.to_i
    }
  elsif stored_handle.present?
    # Use the handle that was already provided
    logger.debug "Using stored handle for new user: #{stored_handle}"
    
    user = User.new(phone: phone, handle: stored_handle, guid: SecureRandom.uuid)
    if user.save
      link_device_to_user(user, device_path)
      
      # Add browser key if available
      add_browser_key_if_available(device_path)
      
      # Add device characteristics if available
      device_header = request.headers['HTTP_X_DEVICE_HEADER']
      if device_header
        begin
          parsed_header = device_header.is_a?(String) ? JSON.parse(device_header) : device_header
          if parsed_header && parsed_header['deviceCharacteristics']
            logger.debug "Updating device characteristics from header for new user"
            update_device_characteristics(device_path, parsed_header['deviceCharacteristics'])
          end
        rescue => e
          logger.error "Error processing device characteristics: #{e.message}"
        end
      end
      
      confirm_device(device_path)
      
      # Get device info for response
      db = SQLite3::Database.new(Rails.root.join('db', device_path))
      device_info = db.get_first_row("SELECT device_id FROM device_info LIMIT 1")
      db.close
      
      # Use helper for consistent session data
      ensure_complete_session_data({
        handle: user.handle,
        guid: user.guid,
        phone: user.phone,
        device_key: device_info ? device_info[0] : nil,
        device_path: device_path,
        auth_version: Time.current.to_i
      })
      
      render json: {
        status: 'authenticated',
        redirect_to: '/dashboard',
        device_key: device_info[0],
        guid: user.guid,
        handle: user.handle,
        device_header_data: generate_device_header_data(
          device_info[0],
          user.guid,
          user.handle
        ),
        auth_version: Time.current.to_i
      }

    else
      logger.error "Failed to create user with stored handle: #{user.errors.full_messages.join(', ')}"
      render json: {
        status: 'needs_handle',
        phone: phone,
        code: code, # Send back code to allow reauthentication after handle creation
        errors: user.errors.full_messages
      }
    end
  else
    logger.debug "New user - needs handle creation"
    session[:pending_device_path] = device_path
    session[:verification_phone] = phone
    
    db = SQLite3::Database.new(Rails.root.join('db', device_path))
    device_info = db.get_first_row("SELECT device_id FROM device_info LIMIT 1")
    db.close
    
    render json: {
      status: 'needs_handle',
      phone: phone,
      masked_phone: mask_phone(phone), 
      device_key: device_info[0]
    }
  end
end

def session_status
  logger.debug "======== SESSION STATUS CALLED ========"
  logger.debug "Session: #{session.to_h}"
  logger.debug "Request headers: #{request.headers['X-Device-Key']}"
  logger.debug "Request path: #{request.path}"

  render json: { 
    authenticated: session[:device_session] == 'authenticated',
    handle: session[:current_handle]
  }
end

      def verify_login
        logger.debug "========== VERIFY LOGIN START =========="
        
        identifier = if params[:identifier]
          params[:identifier].strip
        elsif params.dig(:auth, :identifier)
          params.dig(:auth, :identifier).strip
        else
          logger.error "No identifier found in params: #{params.inspect}"
          return render json: { error: 'No identifier provided', status: 'error' }, status: :unprocessable_entity
        end

        logger.debug "Identifier: #{identifier}"
        logger.debug "Current session: #{session.to_h}"
        logger.debug "Full params: #{params.inspect}" # Added for debugging
        
        # Get device identifiers for recognition
        device_key = request.headers['HTTP_X_DEVICE_KEY']
        device_header = request.headers['HTTP_X_DEVICE_HEADER']
        
        # Try fast authentication first if conditions are right
        if defined?(DeviceRecognitionService) && (device_key || device_header) && !params[:skip_fast_auth]
          logger.debug "Attempting fast authentication for: #{identifier}"
          service = DeviceRecognitionService.new(device_key, session, logger, device_header)
          fast_result = service.fast_authenticate(identifier)
          
          case fast_result[:status]
          when 'authenticated'
            # High confidence match - proceed with auto-login
            logger.debug "Fast authentication succeeded with high confidence"
            
            # Store session data using helper
            ensure_complete_session_data({
              handle: fast_result[:handle],
              guid: fast_result[:guid],
              phone: fast_result[:phone],
              device_key: fast_result[:device_key],
              device_path: fast_result[:path],
              auth_version: Time.current.to_i
            })
            
            # Return success response
            return render json: {
              status: 'authenticated',
              redirect_to: '/dashboard',
              handle: fast_result[:handle],
              guid: fast_result[:guid],
              device_key: fast_result[:device_key],
              confidence_level: fast_result[:confidence_level],
              confidence_score: fast_result[:confidence_score],
              device_header_data: fast_result[:device_header_data],
              auth_version: Time.current.to_i,
              message: "Welcome back #{fast_result[:handle]}!"
            }          
          when 'needs_pin_verification'
            # Medium confidence match - offer PIN verification
            logger.debug "Fast authentication offers PIN verification"
            
            # Store pending verification data
            if fast_result[:path]
              session[:pending_device_path] = fast_result[:path]
            end
            
            # Return PIN verification response
            return render json: {
              status: 'needs_pin_verification',
              handle: fast_result[:handle],
              masked_phone: fast_result[:masked_phone],
              guid: fast_result[:guid],
              confidence_level: fast_result[:confidence_level],
              confidence_score: fast_result[:confidence_score],
              pin_available: true,
              message: "Welcome back #{fast_result[:handle]}! You can verify with your PIN."
            }
          end
          
          # For other statuses, continue with regular flow
          logger.debug "Fast authentication not available, continuing with regular flow"
        end
        
        # Check for device registration flag - important check for both locations
        if params[:device_registration] || params.dig(:auth, :device_registration)
          logger.debug "Device registration flow detected for identifier: #{identifier}"
          
          # Mark that we're in device registration flow - this is important!
          session[:device_registration_flow] = true
          
          # Find the user by handle or phone
          user = nil
          if identifier.start_with?('@')
            user = User.find_by(handle: identifier)
            logger.debug "Looking up by handle: #{identifier}, found: #{user.inspect}"
          else
            begin
              normalized_phone = normalize_phone(identifier)
              user = User.find_by(phone: normalized_phone)
              logger.debug "Looking up by phone: #{normalized_phone}, found: #{user.inspect}"
            rescue StandardError => e
              logger.error "Phone normalization error: #{e.message}"
              return render json: { error: e.message, status: 'error' }, status: :unprocessable_entity
            end
          end
          
          if user
            # Send verification code for the existing user
            session[:verification_phone] = user.phone
            session[:pending_handle] = user.handle
            
            # Add the storage of handle in session
            session[:current_handle] = user.handle
            
            # Use existing device path if available
            if session[:pending_device_path].present?
              logger.debug "Using existing pending device path: #{session[:pending_device_path]}"
            else
              # Create a new pending device if we don't have one
              browser_key = request.headers['HTTP_X_DEVICE_KEY']
              if browser_key.present?
                logger.debug "Creating new pending device for device key: #{browser_key}"
                device_guid = SecureRandom.uuid
                new_path = "devices/#{device_guid}.sqlite3"
                
                # Initialize empty device database
                begin
                  db_path = Rails.root.join('db', new_path)
                  FileUtils.mkdir_p(File.dirname(db_path))
                  
                  db = SQLite3::Database.new(db_path)
                  db.transaction do
                    db.execute "DROP TABLE IF EXISTS device_info"
                    db.execute "DROP TABLE IF EXISTS sync_state"
                    
                    db.execute <<-SQL
                      CREATE TABLE device_info (
                        device_id TEXT PRIMARY KEY,
                        handle TEXT,
                        guid TEXT,
                        phone TEXT,
                        created_at TEXT,
                        last_verified_at TEXT
                      )
                    SQL

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
                    
                    # Create ip_log table
                    db.execute <<-SQL
                      CREATE TABLE ip_log (
                        ip TEXT,
                        user_agent TEXT,
                        access_time TEXT
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
                    
                    db.execute(
                      "INSERT INTO device_info (device_id, guid, created_at) VALUES (?, ?, ?)",
                      [browser_key, device_guid, Time.current.iso8601]
                    )
                    
                    db.execute(
                      "INSERT INTO sync_state (last_sync, status) VALUES (?, ?)",
                      [Time.current.iso8601, 'pending_registration']
                    )
                    
                    # Add browser key
                    db.execute(
                      "INSERT INTO browser_keys (browser_id, browser_name, user_agent, added_at, last_used, pending) VALUES (?, ?, ?, ?, ?, ?)",
                      [browser_key, detect_browser(request.user_agent), request.user_agent, Time.current.iso8601, Time.current.iso8601, 1]
                    )
                    
                    # Add device characteristics if available
                    if device_header
                      begin
                        parsed_header = device_header.is_a?(String) ? JSON.parse(device_header) : device_header
                        if parsed_header && parsed_header['deviceCharacteristics']
                          characteristics_json = parsed_header['deviceCharacteristics'].to_json
                          db.execute(
                            "INSERT INTO device_characteristics (characteristics, updated_at) VALUES (?, ?)",
                            [characteristics_json, Time.current.iso8601]
                          )
                        end
                      rescue => e
                        logger.error "Error storing device characteristics: #{e.message}"
                      end
                    end
                  end
                  db.close
                  
                  session[:pending_device_path] = new_path
                  logger.debug "Created pending device path: #{new_path}"
                rescue SQLite3::Exception => e
                  logger.error "Database error creating pending device: #{e.message}"
                  # Continue anyway, we'll try to use existing session
                end
              end
            end
            
            # Check if PIN is available
            pin_available = user.pin_hash.present?
            
            # Send SMS verification
            send_verification(user.phone)
            
            render json: {
              status: 'verification_needed',
              handle: user.handle,
              masked_phone: mask_phone(user.phone),
              pin_available: pin_available,
              message: "Verify it's you, #{user.handle}"
            }
          else
            logger.error "User not found for device registration with identifier: #{identifier}"
            render json: { 
              error: 'User not found', 
              status: 'error', 
              message: 'Account not found' 
            }, status: :not_found
          end
          return
        end
        
        # Store handle if provided for handle-first flow
        if params[:handle] || params.dig(:auth, :handle)
          stored_handle = params[:handle] || params.dig(:auth, :handle)
          session[:pending_handle] = stored_handle
          logger.debug "Stored pending handle: #{stored_handle}"
        end
        
        # Support for handle-first flow
        handle_first = params[:handle_first] || params.dig(:auth, :handle_first)
        logger.debug "Handle-first flow: #{handle_first || false}"
        
        # Store handle_first flag in session for cross-request persistence
        if handle_first
          session[:handle_first] = 'true'
          logger.debug "Stored handle_first flag in session"
        end
        
        session.delete(:verification_phone)
        
        if identifier.start_with?('@')
          handle_guid_flow(identifier)
        else
          begin
            normalized_phone = normalize_phone(identifier)
            session[:verification_phone] = normalized_phone
            handle_phone_flow(normalized_phone, handle_first)
          rescue StandardError => e
            logger.error "Verification error: #{e.message}"
            render json: { error: e.message, status: 'error' }, status: :unprocessable_entity
          end
        end
      end

      def handle_guid_flow(handle)
        logger.debug "========== HANDLE GUID FLOW =========="
        
        # Clear device registration flag to ensure proper flow
        clear_device_registration_flag
        
        begin
          user = User.find_by(handle: handle)
          
          if user
            logger.debug "Found user: #{user.inspect}"
            
            # Check if this is a new device for an existing user
            browser_key = request.headers['HTTP_X_DEVICE_KEY']
            device_header = request.headers['HTTP_X_DEVICE_HEADER']
            is_known_device = false
            device_confidence = 'low'
            confidence_score = 0
            
            # Store in session for cross-browser
            session[:current_handle] = user.handle
            session[:current_phone] = user.phone
            
            # Try to find a device using device header first
            if device_header && defined?(DeviceRecognitionService)
              service = DeviceRecognitionService.new(browser_key, session, logger, device_header)
              header_match = service.find_device_by_header(device_header)
              
              if header_match && header_match[:handle] == handle
                # We found a match using the device header
                logger.debug "Found device using header with same handle"
                is_known_device = true
                
                # Calculate confidence
                confidence_score = service.calculate_confidence_score(header_match, :header_match)
                device_confidence = service.get_confidence_level(confidence_score)
                logger.debug "Device confidence: #{device_confidence} (#{confidence_score})"
                
                # For high confidence, auto-authenticate
                if device_confidence == 'high'
                  logger.debug "High confidence match - auto-authenticating"
                  
                  # Register this browser with the device
                  if browser_key && browser_key != header_match[:device_id]
                    add_browser_to_device(header_match[:path], browser_key, request.user_agent)
                  end
                  
                  # Store session data using helper
                  ensure_complete_session_data({
                    handle: user.handle,
                    guid: user.guid,
                    phone: user.phone,
                    device_key: header_match[:device_id],
                    device_path: header_match[:path],
                    auth_version: Time.current.to_i
                  })
                  
                  return render json: {
                    status: 'authenticated',
                    redirect_to: '/dashboard',
                    device_key: browser_key || header_match[:device_id],
                    handle: user.handle,
                    guid: user.guid,
                    confidence_level: device_confidence,
                    confidence_score: confidence_score,
                    device_header_data: generate_device_header_data(
                      header_match[:device_id],
                      user.guid,
                      user.handle
                    ),
                    auth_version: Time.current.to_i,
                    message: "Welcome back #{user.handle}!"
                  }
                end
              end
            end
            
            # If no match by header, scan devices by browser key
            if !is_known_device
              Dir.glob(Rails.root.join('db', 'devices', '*.sqlite3')).each do |db_path|
                begin
                  db = SQLite3::Database.new(db_path)
                  device_info = db.get_first_row("SELECT device_id, handle, guid FROM device_info LIMIT 1")
                  
                  # Check for browser keys table
                  has_browser_keys = db.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='browser_keys'").any? rescue false
                  
                  # Check if this browser key exists in this device
                  browser_match = false
                  if has_browser_keys && browser_key
                    browser_match = db.execute("SELECT 1 FROM browser_keys WHERE browser_id = ? LIMIT 1", [browser_key]).any? rescue false
                  end
                  
                  db.close
                  
                  if device_info && (
                    # Match by direct browser key
                    (device_info[0] == browser_key && device_info[1] == handle) ||
                    # Or match by handle and check browser_keys table
                    (device_info[1] == handle && browser_match)
                  )
                    # This device is already registered for this user
                    is_known_device = true
                    logger.debug "Found known device with key #{browser_key&.slice(0, 10)}..."
                    
                    # Set high confidence for exact browser key match
                    device_confidence = 'high'
                    confidence_score = 90
                    break
                  end
                rescue StandardError => e
                  logger.error "Error checking device: #{e.message}"
                end
              end
            end
            
            # Check if PIN is available
            pin_available = user.pin_hash.present?
            
            if is_known_device && device_confidence == 'high'
              # High confidence, proceed with authentication
              logger.debug "Known device with high confidence - authenticating"
              
              # Store session data using helper
              ensure_complete_session_data({
                handle: user.handle,
                guid: user.guid,
                phone: user.phone,
                device_key: browser_key,
                auth_version: Time.current.to_i
              })
              
              return render json: {
                status: 'authenticated',
                redirect_to: '/dashboard',
                handle: user.handle,
                guid: user.guid,
                device_key: browser_key,
                confidence_level: device_confidence,
                confidence_score: confidence_score,
                device_header_data: generate_device_header_data(
                  browser_key,
                  user.guid,
                  user.handle
                ),
                auth_version: Time.current.to_i,
                message: "Welcome back #{user.handle}!"
              }
            elsif is_known_device && device_confidence == 'medium' && pin_available
              # Medium confidence with PIN available
              logger.debug "Known device with medium confidence - offering PIN verification"
              
              session[:verification_phone] = user.phone
              
              return render json: {
                status: 'needs_pin_verification',
                handle: handle,
                masked_phone: mask_phone(user.phone),
                pin_available: true,
                confidence_level: device_confidence,
                confidence_score: confidence_score,
                message: "Welcome back #{handle}!"
              }
            elsif is_known_device
              # Known device but needs verification
              logger.debug "Known device needs verification"
              
              session[:verification_phone] = user.phone
              send_verification(user.phone)
              
              render json: {
                status: 'verification_needed',
                handle: handle,
                masked_phone: mask_phone(user.phone),
                pin_available: pin_available,
                confidence_level: device_confidence,
                confidence_score: confidence_score,
                message: "Welcome back #{handle}!"
              }
            else
              # This is a new device trying to use an existing handle
              # Return handle_exists to trigger the "Is this your account?" UI
              masked_handle = mask_handle(handle)
              
              # Generate handle suggestions for the frontend
              suggested_handles = generate_handle_suggestions(handle.sub(/^@/, ''))
              
              # Store in session for account exists alert
              account_data = {
                type: 'handle',
                handle: handle,
                masked_handle: masked_handle,
                masked_phone: mask_phone(user.phone),
                pin_available: pin_available
              }
              session[:account_already_exists] = account_data.to_json
              
              render json: {
                status: 'handle_exists',  # This is the key status
                handle: handle,
                masked_handle: masked_handle,
                masked_phone: mask_phone(user.phone),
                suggested_handles: suggested_handles,
                pin_available: pin_available,
                message: "This handle is already registered."
              }
            end
          else
            # If handle not found but we're in handle-first flow, store it
            session[:pending_handle] = handle
            session[:handle_first] = 'true' # Mark as handle-first flow
            
            render json: {
              status: 'handle_not_found',
              error: 'This username is not registered. Please register with your phone number.',
              suggestion: 'register_with_phone'
            }, status: :not_found
          end
        rescue => e
          logger.error "Error in handle_guid_flow: #{e.class} - #{e.message}"
          logger.error e.backtrace.join("\n")
          render json: { error: 'An error occurred', status: 'error' }, status: :internal_server_error
        end
      end

      def handle_phone_flow(phone, handle_first = false)
        logger.debug "========== HANDLE PHONE FLOW =========="
        logger.debug "Phone: #{phone}"
        logger.debug "Handle-first flow: #{handle_first}"
        
        # Set handle_first flag in session if true
        if handle_first
          session[:handle_first] = 'true'
        end
        
        user = User.find_by(phone: phone)
        logger.debug "Existing user check: #{user.inspect}"
        
        if user
          # Check if this is a new device for an existing user
          browser_key = request.headers['HTTP_X_DEVICE_KEY']
          device_header = request.headers['HTTP_X_DEVICE_HEADER']
          is_known_device = false
          device_confidence = 'low'
          confidence_score = 0
          
          # Store user info in session for cross-browser recognition
          session[:current_handle] = user.handle
          session[:current_phone] = user.phone
          session[:current_guid] = user.guid
          
          # Try to find a device using device header first
          if device_header && defined?(DeviceRecognitionService)
            service = DeviceRecognitionService.new(browser_key, session, logger, device_header)
            header_match = service.find_device_by_header(device_header)
            
            if header_match && (header_match[:handle] == user.handle || header_match[:guid] == user.guid)
              # We found a match using the device header
              logger.debug "Found device using header for user #{user.handle}"
              is_known_device = true
              
              # Calculate confidence
              confidence_score = service.calculate_confidence_score(header_match, :header_match)
              device_confidence = service.get_confidence_level(confidence_score)
              logger.debug "Device confidence: #{device_confidence} (#{confidence_score})"
              
              # For high confidence, auto-authenticate
              if device_confidence == 'high'
                logger.debug "High confidence match - auto-authenticating"
                
                # Register this browser with the device
                if browser_key && browser_key != header_match[:device_id]
                  add_browser_to_device(header_match[:path], browser_key, request.user_agent)
                  
                  # Update device characteristics if available
                  if device_header
                    begin
                      parsed_header = device_header.is_a?(String) ? JSON.parse(device_header) : device_header
                      if parsed_header && parsed_header['deviceCharacteristics']
                        update_device_characteristics(header_match[:path], parsed_header['deviceCharacteristics'])
                      end
                    rescue => e
                      logger.error "Error processing device characteristics: #{e.message}"
                    end
                  end
                end
                
                # Store session data using helper
                ensure_complete_session_data({
                  handle: user.handle,
                  guid: user.guid,
                  phone: user.phone,
                  device_key: header_match[:device_id],
                  device_path: header_match[:path],
                  auth_version: Time.current.to_i
                })
                
                return render json: {
                  status: 'authenticated',
                  redirect_to: '/dashboard',
                  device_key: browser_key || header_match[:device_id],
                  handle: user.handle,
                  guid: user.guid,
                  confidence_level: device_confidence,
                  confidence_score: confidence_score,
                  device_header_data: generate_device_header_data(
                    header_match[:device_id],
                    user.guid,
                    user.handle
                  ),
                  auth_version: Time.current.to_i,
                  message: "Welcome back #{user.handle}!"
                }
              end
            end
          end
          
          # If no match by header, scan devices by browser key
          if !is_known_device
            Dir.glob(Rails.root.join('db', 'devices', '*.sqlite3')).each do |db_path|
              begin
                db = SQLite3::Database.new(db_path)
                device_info = db.get_first_row("SELECT device_id, phone, guid, handle FROM device_info LIMIT 1")
                
                # Check for browser keys table
                has_browser_keys = db.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='browser_keys'").any? rescue false
                
                # Check if this browser key exists in this device
                browser_match = false
                if has_browser_keys && browser_key
                  browser_match = db.execute("SELECT 1 FROM browser_keys WHERE browser_id = ? LIMIT 1", [browser_key]).any? rescue false
                end
                
                db.close
                
                if device_info && (
                  # Match either by direct browser key
                  (device_info[0] == browser_key && (device_info[1] == phone || device_info[2] == user.guid)) ||
                  # Or match by phone/guid and check browser_keys table
                  ((device_info[1] == phone || device_info[2] == user.guid || device_info[3] == user.handle) && browser_match)
                )
                  # This device is already registered for this user
                  is_known_device = true
                  
                  # Set high confidence for exact browser key match
                  device_confidence = 'high'
                  confidence_score = 90
                  break
                end
              rescue StandardError => e
                logger.error "Error checking device: #{e.message}"
              end
            end
          end
          
          # Check if PIN is available
          pin_available = user.pin_hash.present?
          
          if is_known_device && device_confidence == 'high'
            # High confidence, proceed with authentication
            logger.debug "Known device with high confidence - authenticating"
            
            # Store session data using helper
            ensure_complete_session_data({
              handle: user.handle,
              guid: user.guid,
              phone: user.phone,
              device_key: browser_key,
              auth_version: Time.current.to_i
            })
            
            return render json: {
              status: 'authenticated',
              redirect_to: '/dashboard',
              handle: user.handle,
              guid: user.guid,
              device_key: browser_key,
              confidence_level: device_confidence,
              confidence_score: confidence_score,
              device_header_data: generate_device_header_data(
                browser_key,
                user.guid,
                user.handle
              ),
              auth_version: Time.current.to_i,
              message: "Welcome back #{user.handle}!"
            }
          elsif is_known_device && device_confidence == 'medium' && pin_available
            # Medium confidence with PIN available
            logger.debug "Known device with medium confidence - offering PIN verification"
            
            logger.info "===== SENDING VERIFICATION FOR MEDIUM CONFIDENCE DEVICE ====="
            send_verification(phone) # Send verification anyway as fallback
            
            return render json: {
              status: 'needs_pin_verification',
              handle: user.handle,
              masked_phone: mask_phone(phone),
              pin_available: true,
              confidence_level: device_confidence,
              confidence_score: confidence_score,
              message: "Welcome back #{user.handle}!"
            }
          elsif is_known_device
            # Known device but needs verification
            logger.info "===== SENDING VERIFICATION TO KNOWN DEVICE ====="
            send_verification(phone)
            
            render json: {
              status: 'verification_needed',
              phone: phone,
              handle: user.handle,
              masked_phone: mask_phone(phone),
              pin_available: pin_available,
              confidence_level: device_confidence,
              confidence_score: confidence_score
            }
          else
            # New device for existing user, ask "Is this your account?"
            masked_handle = mask_handle(user.handle)
            
            # Store in session for account exists alert
            account_data = {
              type: 'phone',
              handle: user.handle,
              masked_handle: masked_handle,
              phone: phone,
              masked_phone: mask_phone(phone),
              pin_available: pin_available
            }
            session[:account_already_exists] = account_data.to_json
            
            # Add this line to send verification code in advance - THIS IS THE FIX
            logger.info "===== SENDING VERIFICATION FOR NEW DEVICE EXISTING USER ====="
            send_verification(phone)
            
            render json: {
              status: 'phone_exists',
              phone: phone,
              handle: user.handle,
              masked_handle: masked_handle,
              masked_phone: mask_phone(phone),
              pin_available: pin_available,
              message: "This phone number is already registered."
            }
          end
        else
          # New user - send verification
          logger.info "===== SENDING VERIFICATION TO NEW USER ====="
          send_verification(phone)
          
          render json: {
            status: 'verification_needed',
            phone: phone,
            masked_phone: mask_phone(phone),
            new_user: true,
            handle_first: handle_first
          }
        end
      end
      
def create_handle
  handle = params[:handle]&.strip
  phone = session[:verification_phone] || params[:phone]
  require_verification = params[:require_verification].present?
  
  logger.debug "========== CREATE HANDLE =========="
  logger.debug "Handle: #{handle}"
  logger.debug "Phone from session/params: #{phone}"
  logger.debug "Require verification: #{require_verification}"
  
  # Enhanced logging for debugging session state
  logger.debug "Session data: #{session.to_h}"
  
  # Validation with better error messages
  unless handle && handle.match?(/\A@[a-zA-Z0-9_]+\z/)
    return render json: { 
      error: 'Invalid handle format. Must start with @ and contain only letters, numbers, and underscores.', 
      status: 'error' 
    }, status: :unprocessable_entity
  end
  
  unless phone.present?
    return render json: { 
      error: 'Phone number required to create handle', 
      status: 'error' 
    }, status: :unprocessable_entity
  end
  
  # Check if handle already exists
  if User.exists?(handle: handle)
    return render json: { 
      error: 'Handle already taken', 
      status: 'handle_exists',
      message: 'This handle is already taken. Please choose another.'
    }, status: :unprocessable_entity
  end
  
  # If we should enforce verification first, send verification code and don't create user yet
  if require_verification || !Rails.env.development?  # Always verify in non-dev environments for security
    # Store intended handle in session for after verification
    session[:pending_handle] = handle
    session[:verification_phone] = phone
    
    # Send verification code
    send_verification(phone)
    
    return render json: {
      status: 'verification_needed',
      phone: phone,
      masked_phone: mask_phone(phone),
      message: 'Please verify your phone number'
    }
  end
  
  # If we get here, we're creating the user directly (only allowed in development with require_verification=false)
  
  # Create new user with handle and phone
  user = User.new(
    handle: handle,
    phone: phone,
    guid: SecureRandom.uuid
  )
  
  if user.save
    # Link device to the new user
    device_path = session[:pending_device_path]
    if device_path
      link_device_to_user(user, device_path)
      
      # Add browser key if available
      add_browser_key_if_available(device_path)
      
      # Add device characteristics if available
      device_header = request.headers['HTTP_X_DEVICE_HEADER']
      if device_header
        begin
          parsed_header = device_header.is_a?(String) ? JSON.parse(device_header) : device_header
          if parsed_header && parsed_header['deviceCharacteristics']
            logger.debug "Updating device characteristics from header for new user"
            update_device_characteristics(device_path, parsed_header['deviceCharacteristics'])
          end
        rescue => e
          logger.error "Error processing device characteristics: #{e.message}"
        end
      end
      
      confirm_device(device_path)
      
      # Clear temporary session data
      session.delete(:pending_device_path)
      session.delete(:verification_phone)
      
      # Set authenticated session using helper
      ensure_complete_session_data({
        handle: user.handle,
        guid: user.guid,
        phone: user.phone,
        device_path: device_path,
        auth_version: Time.current.to_i
      })
      
      # Create device header data for cross-browser recognition
      browser_key = request.headers['HTTP_X_DEVICE_KEY']
      db = SQLite3::Database.new(Rails.root.join('db', device_path))
      device_info = db.get_first_row("SELECT device_id FROM device_info LIMIT 1")
      db.close
      
      # ADD THE DEVICE_HEADER_DATA TO THIS RESPONSE:
      render json: {
        status: 'authenticated',
        redirect_to: '/dashboard',
        handle: user.handle,
        guid: user.guid,
        device_header_data: generate_device_header_data(
          device_info[0],
          user.guid,
          user.handle
        ),
        auth_version: Time.current.to_i
      }

    else
      # No device path - create one
      device_path = find_or_create_device_for_user(user)
      
      # Set authenticated session using helper
      ensure_complete_session_data({
        handle: user.handle,
        guid: user.guid,
        phone: user.phone,
        device_path: device_path,
        auth_version: Time.current.to_i
      })
      
      db = SQLite3::Database.new(Rails.root.join('db', device_path))
      device_info = db.get_first_row("SELECT device_id FROM device_info LIMIT 1")
      db.close
      
      render json: {
        status: 'authenticated',
        redirect_to: '/dashboard',
        handle: user.handle,
        guid: user.guid,
        device_key: device_info ? device_info[0] : nil,
        device_header_data: generate_device_header_data(
          device_info ? device_info[0] : nil,
          user.guid,
          user.handle
        ),
        auth_version: Time.current.to_i
      }
    end
  else
    render json: { 
      error: user.errors.full_messages.join(', '), 
      status: 'error'
    }, status: :unprocessable_entity
  end
end
      
      def check_pin_status
        if session[:device_session] == 'authenticated' && session[:current_handle]
          user = User.find_by(handle: session[:current_handle])
          render json: { 
            pin_enabled: user && user.pin_hash.present?,
            pin_recently_set: user && user.pin_set_at.present? && user.pin_set_at > 30.days.ago
          }
        else
          render json: { error: 'Not authenticated' }, status: :unauthorized
        end
      end

      def setup_pin
        if session[:device_session] == 'authenticated' && session[:current_handle]
          user = User.find_by(handle: session[:current_handle])
          
          if user
            # Get PIN from request
            pin = params[:pin]
            
            if pin && pin.match?(/^\d{4}$/)
              # Hash PIN for secure storage
              require 'bcrypt'
              pin_hash = BCrypt::Password.create(pin)
              
              # Update user with PIN hash
              user.pin_hash = pin_hash
              user.pin_set_at = Time.current
              
              if user.save
                render json: { status: 'success', message: 'PIN successfully set' }
              else
                render json: { error: user.errors.full_messages.join(', ') }, status: :unprocessable_entity
              end
            else
              render json: { error: 'PIN must be exactly 4 digits' }, status: :unprocessable_entity
            end
          else
            render json: { error: 'User not found' }, status: :not_found
          end
        else
          render json: { error: 'Not authenticated' }, status: :unauthorized
        end
      end

      # Verify PIN during login
      def verify_pin
        # Get PIN and identifier
        pin = params[:pin]
        identifier = params[:identifier]
        
        unless pin && identifier
          return render json: { error: 'PIN and identifier required' }, status: :unprocessable_entity
        end
        
        # Find user by handle or phone
        user = if identifier.start_with?('@')
          User.find_by(handle: identifier)
        else
          begin
            normalized_phone = normalize_phone(identifier)
            User.find_by(phone: normalized_phone)
          rescue => e
            logger.error "Phone normalization error: #{e.message}"
            return render json: { error: e.message }, status: :unprocessable_entity
          end
        end
        
        unless user
          return render json: { error: 'Account not found' }, status: :not_found
        end
        
        # Check if PIN is set
        unless user.pin_hash.present?
          return render json: { error: 'PIN not set for this account' }, status: :unprocessable_entity
        end
        
        # Verify PIN
        require 'bcrypt'
        begin
          stored_pin = BCrypt::Password.new(user.pin_hash)
          unless stored_pin == pin
            # Track failed attempts (optional)
            log_pin_failure(user)
            return render json: { error: 'Invalid PIN' }, status: :unauthorized
          end
          
          # PIN verified successfully
          # Set up a new device or use existing
          device_path = setup_device_for_user(user)
          
          # Get device info
          db = SQLite3::Database.new(Rails.root.join('db', device_path))
          device_info = db.get_first_row("SELECT device_id FROM device_info LIMIT 1")
          db.close
          
          # Set session data using helper
          ensure_complete_session_data({
            handle: user.handle,
            guid: user.guid,
            phone: user.phone,
            device_key: device_info ? device_info[0] : nil,
            device_path: device_path,
            auth_version: Time.current.to_i
          })
          
          render json: {
            status: 'authenticated',
            redirect_to: '/dashboard',
            handle: user.handle,
            guid: user.guid,
            device_header_data: generate_device_header_data(
              device_info ? device_info[0] : nil,
              user.guid,
              user.handle
            ),
            auth_version: Time.current.to_i
          }
        rescue => e
          logger.error "PIN verification error: #{e.message}"
          render json: { error: 'PIN verification failed' }, status: :internal_server_error
        end
      end

      # Helper method to create or get device for user
      def setup_device_for_user(user)
        device_key = request.headers['HTTP_X_DEVICE_KEY'] || SecureRandom.hex(32)
        
        # Look for existing device for this user
        matching_device = nil
         
        Dir.glob(Rails.root.join('db', 'devices', '*.sqlite3')).each do |db_path|
          begin
            db = SQLite3::Database.new(db_path)
            device_info = db.get_first_row("SELECT device_id, handle, guid FROM device_info LIMIT 1")
            db.close
            
            if device_info && device_info[1] == user.handle
              matching_device = {
                path: db_path.split('db/').last,
                device_id: device_info[0]
              }
              break
            end
          rescue => e
            logger.error "Error checking device: #{e.message}"
          end
        end
        
        if matching_device
          # Use existing device
          return matching_device[:path]
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
                last_verified_at TEXT
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
            
            # Insert device info
            db.execute(
              "INSERT INTO device_info (device_id, handle, guid, phone, created_at, last_verified_at) VALUES (?, ?, ?, ?, ?, ?)",
              [device_key, user.handle, user.guid, user.phone, Time.current.iso8601, Time.current.iso8601]
            )
            
            # Initialize sync state
            db.execute(
              "INSERT INTO sync_state (last_sync, status) VALUES (?, ?)",
              [Time.current.iso8601, 'initialized']
            )
            
            # Add browser key
            db.execute(
              "INSERT INTO browser_keys (browser_id, browser_name, user_agent, added_at, last_used, pending) VALUES (?, ?, ?, ?, ?, ?)",
              [device_key, 'Unknown', request.user_agent, Time.current.iso8601, Time.current.iso8601, 0]
            )
            
            # Add device characteristics if available
            device_header = request.headers['HTTP_X_DEVICE_HEADER']
            if device_header
              begin
                parsed_header = device_header.is_a?(String) ? JSON.parse(device_header) : device_header
                if parsed_header && parsed_header['deviceCharacteristics']
                  characteristics_json = parsed_header['deviceCharacteristics'].to_json
                  db.execute(
                    "INSERT INTO device_characteristics (characteristics, updated_at) VALUES (?, ?)",
                    [characteristics_json, Time.current.iso8601]
                  )
                end
              rescue => e
                logger.error "Error storing device characteristics: #{e.message}"
              end
            end
          end
          db.close
          
          return new_path
        end
      end

      # Optional: Track PIN verification failures
      def log_pin_failure(user)
        # Simple implementation using Rails cache
        failure_key = "pin_failures:#{user.id}"
        
        # Get current failures
        failures = Rails.cache.fetch(failure_key, expires_in: 30.minutes) { 0 }
        
        # Increment and store
        Rails.cache.write(failure_key, failures + 1, expires_in: 30.minutes)
        
        # Log if too many failures (for security monitoring)
        if failures >= 3
          logger.warn "Multiple PIN failures for user #{user.id} (#{user.handle})"
        end
      end

# Generate WebAuthn registration options
def webauthn_registration_options
  begin
    logger.debug "========== WEBAUTHN REGISTRATION OPTIONS =========="
    
    # First, ensure we have a current user to register
    handle = session[:current_handle]
    user = User.find_by(handle: handle)
    
    unless user
      logger.error "No user found for WebAuthn registration"
      return render json: { error: 'No user found for registration' }, status: :unprocessable_entity
    end
    
    logger.debug "Generating WebAuthn registration options for user: #{handle}"
    logger.debug "User WebAuthn ID: #{user.webauthn_id || 'nil'}"
    
    # Generate a random challenge
    challenge = SecureRandom.random_bytes(32)
    
    # Store challenge in session for verification later
    session[:webauthn_challenge] = challenge
    
    # Set the relying party ID (your domain without protocol)
    rp_id = "staging.superappproject.com"
    
    # Encode the user ID properly for WebAuthn
    user_id = Base64.strict_encode64(user.webauthn_id || user.guid || SecureRandom.uuid)
    
    # Create registration options
    options = WebAuthn::Credential.options_for_create(
      user: {
        id: user_id,
        name: user.handle,
        display_name: user.handle
      },
      authenticator_selection: {
        authenticator_attachment: "platform",
        user_verification: "discouraged",
        require_resident_key: false
      }
    )
    session[:webauthn_challenge] = options.challenge
    
    logger.debug "Generated WebAuthn registration options"
    render json: options
  rescue => e
    logger.error "WebAuthn registration options error: #{e.class} - #{e.message}"
    logger.error e.backtrace.join("\n")
    render json: { error: "WebAuthn error: #{e.message}" }, status: :internal_server_error
  end
end

# Register a WebAuthn credential
def register_webauthn_credential
  logger.debug "========== REGISTER WEBAUTHN CREDENTIAL =========="
  
  # Ensure we have a user and device
  handle = session[:current_handle]
  device_path = session[:device_path] || session[:pending_device_path]
  
  user = User.find_by(handle: handle)
  
  unless user && device_path
    logger.error "Missing user or device for WebAuthn registration: handle=#{handle}, device_path=#{device_path}"
    return render json: { error: 'Missing user or device for registration' }, status: :unprocessable_entity
  end
  
  # Get the challenge we stored during registration options
  challenge = session.delete(:webauthn_challenge)
  
  unless challenge
    logger.error "WebAuthn challenge not found in session"
    return render json: { error: 'WebAuthn challenge expired' }, status: :unprocessable_entity
  end
  
  # Get the credential from the client
  begin
    logger.debug "Processing WebAuthn credential from client"
    webauthn_credential = WebAuthn::Credential.from_create(params[:credential])
    
    # Verify the credential
    # Verify the credential
    webauthn_credential.verify(
      challenge,
      origin: "https://staging.superappproject.com",
      rp_id: "staging.superappproject.com"
    )
    
    # Get credential attributes for storage
    credential_id = webauthn_credential.id
    public_key = webauthn_credential.public_key
    
    logger.debug "Verified WebAuthn credential: #{credential_id.slice(0, 10)}..."
    
    # Store in the device database
    db = SQLite3::Database.new(Rails.root.join('db', device_path))
    
    # Make sure the webauthn_credentials table exists
    begin
      db.execute("SELECT 1 FROM webauthn_credentials LIMIT 1")
    rescue SQLite3::Exception => e
      logger.debug "Creating webauthn_credentials table in device database"
      db.execute <<-SQL
        CREATE TABLE webauthn_credentials (
          id INTEGER PRIMARY KEY,
          credential_id TEXT UNIQUE,
          public_key TEXT,
          user_id INTEGER,
          device_guid TEXT,
          created_at TEXT,
          last_used_at TEXT,
          nickname TEXT,
          FOREIGN KEY (user_id) REFERENCES users(id)
        )
      SQL
    end
    
    # Store the credential
    db.execute(
      "INSERT INTO webauthn_credentials (credential_id, public_key, user_id, device_guid, created_at, last_used_at) VALUES (?, ?, ?, ?, ?, ?)",
      [credential_id, public_key, user.id, device_path.split('/').last.split('.').first, Time.current.iso8601, Time.current.iso8601]
    )
    db.close
    
    logger.debug "WebAuthn credential registered successfully"
    render json: { status: 'success', message: 'WebAuthn credential registered successfully' }
  rescue WebAuthn::Error => e
    logger.error "WebAuthn error: #{e.message}"
    render json: { error: "WebAuthn error: #{e.message}" }, status: :unprocessable_entity
  rescue StandardError => e
    logger.error "Error registering WebAuthn credential: #{e.message}"
    logger.error e.backtrace.join("\n")
    render json: { error: 'Error registering credential' }, status: :internal_server_error
  end
end

# Generate WebAuthn login options
def webauthn_login_options
  begin
    logger.debug "========== WEBAUTHN LOGIN OPTIONS =========="
    
    # Get the handle from params
    handle = params[:handle]
    
    unless handle
      logger.error "Handle is required for WebAuthn login options"
      return render json: { error: 'Handle is required' }, status: :unprocessable_entity
    end
    
    logger.debug "Generating login options for handle: #{handle}"
    
    # Find the user
    user = User.find_by(handle: handle)
    
    unless user
      logger.error "User not found for handle: #{handle}"
      return render json: { error: 'User not found' }, status: :not_found
    end
    
    # Generate a challenge
    challenge = SecureRandom.random_bytes(32)
    
    # Store in session for verification
    session[:webauthn_challenge] = challenge
    session[:webauthn_handle] = handle
    
    # Find all WebAuthn credentials for this user
    credentials = []
    
    # Search through all device databases for credentials
    logger.debug "Looking for WebAuthn credentials for user ID: #{user.id}"
    device_count = 0
    cred_count = 0
    
    Dir.glob(Rails.root.join('db', 'devices', '*.sqlite3')).each do |db_path|
      begin
        device_count += 1
        db = SQLite3::Database.new(db_path)
        
        # Check if the table exists
        has_table = db.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='webauthn_credentials'").any? rescue false
        
        if has_table
          # Get credentials for this user
          user_credentials = db.execute(
            "SELECT credential_id FROM webauthn_credentials WHERE user_id = ?",
            [user.id]
          )
          
          user_credentials.each do |cred|
            cred_count += 1
            credentials << { id: cred[0], type: 'public-key' }
          end
        end
        
        db.close
      rescue SQLite3::Exception => e
        logger.error "Error reading credentials from #{db_path}: #{e.message}"
      end
    end
    
    logger.debug "Found #{cred_count} WebAuthn credentials across #{device_count} device databases"
    
    options = WebAuthn::Credential.options_for_get(
      allow: credentials.empty? ? nil : credentials,
      user_verification: "discouraged"
    )

    # The challenge is generated by the gem, so get it from the options
    session[:webauthn_challenge] = options.challenge
    
    logger.debug "Generated WebAuthn login options"
    render json: options
  rescue => e
    logger.error "WebAuthn login options error: #{e.class} - #{e.message}"
    logger.error e.backtrace.join("\n")
    # Return a proper JSON error instead of letting Rails render an HTML error page
    render json: { error: "WebAuthn error: #{e.message}" }, status: :internal_server_error
  end
end

# Verify a WebAuthn login
def verify_webauthn_login
  logger.debug "========== VERIFY WEBAUTHN LOGIN =========="
  
  # Get stored data from session
  challenge = session.delete(:webauthn_challenge)
  handle = session.delete(:webauthn_handle) || params[:handle]
  
  unless challenge && handle
    logger.error "Authentication challenge expired or missing handle"
    return render json: { error: 'Authentication challenge expired' }, status: :unprocessable_entity
  end
  
  logger.debug "Verifying WebAuthn login for handle: #{handle}"
  
  # Find the user
  user = User.find_by(handle: handle)
  
  unless user
    logger.error "User not found for WebAuthn verification: #{handle}"
    return render json: { error: 'User not found' }, status: :not_found
  end
  
  begin
    # Get the credential from parameters
    logger.debug "Processing WebAuthn credential response"
    webauthn_credential = WebAuthn::Credential.from_get(params[:credential])
    
    # Find the stored credential with this ID
    credential_path = nil
    public_key = nil
    
    # Search for the credential in all device databases
    logger.debug "Searching for credential ID: #{webauthn_credential.id.slice(0, 10)}..."
    
    Dir.glob(Rails.root.join('db', 'devices', '*.sqlite3')).each do |db_path|
      begin
        db = SQLite3::Database.new(db_path)
        
        # Check if the table exists
        has_table = db.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='webauthn_credentials'").any? rescue false
        
        if has_table
          # Look for this credential
          cred = db.get_first_row(
            "SELECT public_key FROM webauthn_credentials WHERE credential_id = ? AND user_id = ?",
            [webauthn_credential.id, user.id]
          )
          
          if cred
            logger.debug "Found matching credential in device database: #{db_path.split('/').last}"
            public_key = cred[0]
            credential_path = db_path.split('db/').last
            
            # Update last_used_at
            db.execute(
              "UPDATE webauthn_credentials SET last_used_at = ? WHERE credential_id = ?",
              [Time.current.iso8601, webauthn_credential.id]
            )
            
            break
          end
        end
        
        db.close
      rescue SQLite3::Exception => e
        logger.error "Error finding credential in #{db_path}: #{e.message}"
      end
    end
    
    unless public_key && credential_path
      logger.error "Credential not found in any device database"
      return render json: { error: 'Credential not found' }, status: :not_found
    end
    
    # Verify the credential
    logger.debug "Verifying WebAuthn credential against stored public key"
    webauthn_credential.verify(
      challenge,
      public_key: public_key,
      origin: "https://staging.superappproject.com",
      rp_id: "staging.superappproject.com"
    )
    
    logger.debug "WebAuthn verification successful - setting up authenticated session"
    
    # Get device info
    db_path = Rails.root.join('db', credential_path)
    db = SQLite3::Database.new(db_path)
    device_info = db.get_first_row("SELECT device_id, phone FROM device_info LIMIT 1")
    db.close
    
    # Set up authenticated session using helper
    ensure_complete_session_data({
      handle: user.handle,
      guid: user.guid,
      phone: device_info ? device_info[1] : nil,
      device_key: device_info ? device_info[0] : nil,
      device_path: credential_path,
      auth_version: Time.current.to_i
    })
    
    logger.debug "Authentication successful - redirecting to dashboard"
    
    render json: {
      status: 'authenticated',
      redirect_to: '/dashboard',
      handle: user.handle,
      guid: user.guid,
      device_key: device_info ? device_info[0] : nil,
      auth_version: Time.current.to_i,
      message: "Welcome back #{user.handle}!"
    }
  rescue WebAuthn::Error => e
    logger.error "WebAuthn verification error: #{e.message}"
    render json: { error: "WebAuthn verification failed: #{e.message}" }, status: :unprocessable_entity
  rescue StandardError => e
    logger.error "Error in verify_webauthn_login: #{e.message}"
    logger.error e.backtrace.join("\n")
    render json: { error: 'Error during verification' }, status: :internal_server_error
  end
end

      private
      
def add_local_changes_table(db_path)
  db = SQLite3::Database.new(Rails.root.join('db', db_path))
  
  # Check if table exists
  table_exists = db.get_first_value("SELECT 1 FROM sqlite_master WHERE type='table' AND name='local_changes'")
  
  unless table_exists
    db.execute(<<~SQL)
      CREATE TABLE local_changes (
        id TEXT PRIMARY KEY,
        sql_statement TEXT,
        created_at TEXT,
        synced INTEGER DEFAULT 0
      )
    SQL
  end
  
  db.close
end

      # Helper method to ensure consistent session data
def ensure_complete_session_data(response_data)
  # Ensure all critical session fields are set
  session[:device_session] = 'authenticated'
  session[:login_time] = Time.current.to_s # Use consistent format
  
  # Store previous values before updating
  previous_handle = session[:current_handle]
  previous_guid = session[:current_guid]
  previous_phone = session[:current_phone]
  
  # User identity data - preserve existing values if new ones are nil
  session[:current_handle] = response_data[:handle] || previous_handle
  session[:current_phone] = response_data[:phone] || previous_phone
  session[:current_guid] = response_data[:guid] || previous_guid
  
  # Rest of the method remains the same...
  if response_data[:device_path]
    session[:device_path] = response_data[:device_path]
  end
  
  if response_data[:device_key]
    session[:current_device_id] = response_data[:device_key]
  end
  
  # Clear any temporary registration data
  session.delete(:device_registration_flow)
  session.delete(:device_registration)
  session.delete(:handle_first)
  session.delete(:pending_verification)
  session.delete(:auth_revoked)
  
  # Clear any redirection counters
  session.delete(:redirect_count)
  
  # Set verification timestamp
  session[:last_verified_at] = Time.current.iso8601
  
  # Update auth version in session if provided
  if response_data[:auth_version]
    session[:auth_version] = response_data[:auth_version]
  end
  
  logger.debug "Session data updated consistently: #{session.to_h.slice(
    :device_session, :login_time, :current_handle, :current_phone, 
    :current_guid, :device_path, :current_device_id, :last_verified_at
  )}"
end
      # Helper method to generate device header data consistently
      def generate_device_header_data(device_id, guid, handle)
        {
          deviceId: device_id,
          userGuid: guid,
          userHandle: handle
        }
      end
      
      # Check if a browser key exists in a device
      def browser_key_belongs_to_device(db_path, browser_key)
        return false unless db_path && browser_key
        
        begin
          db = SQLite3::Database.new(db_path)
          
          # Check if the browser_keys table exists
          has_browser_keys = db.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='browser_keys'").any? rescue false
          
          if has_browser_keys
            # Check if the browser key exists in this device
            exists = db.execute("SELECT 1 FROM browser_keys WHERE browser_id = ? LIMIT 1", [browser_key]).any?
            db.close
            return exists
          end
          
          db.close
          return false
        rescue => e
          logger.error "Error checking browser key in device: #{e.message}"
          return false
        end
      end
      
      # Generate handle suggestions for a base handle
      def generate_handle_suggestions(base_handle)
        [
          "@#{base_handle}1",
          "@#{base_handle}2",
          "@#{base_handle}_app",
          "@#{base_handle}_user", 
          "@#{base_handle}_#{rand(100..999)}"
        ]
      end

      # Clear device registration flag
      def clear_device_registration_flag
        session.delete(:device_registration_flow)
        logger.debug "Cleared device registration flag from session"
      end

      def scan_databases_for_handle(handle)
        Dir.glob(Rails.root.join('db', 'devices', '*.sqlite3')).each do |db_path|
          begin
            db = SQLite3::Database.new(db_path)
            result = db.get_first_row("SELECT device_id, handle, guid, phone FROM device_info WHERE handle = ? LIMIT 1", [handle])
            db.close
            
            if result
              return {
                device_id: result[0],
                handle: result[1],
                guid: result[2],
                phone: result[3],
                path: db_path.split('db/').last
              }
            end
          rescue => e
            logger.error "Error scanning database for handle: #{e.message}"
          end
        end
        nil
      end
      
      def mask_handle(handle)
        return nil unless handle
        return handle if handle.length <= 3
        
        # Handle format is @username
        first_char = handle[0..1] # Keep @ and first character
        last_char = handle[-1] # Keep last character
        
        # Replace middle characters with asterisks (max 3)
        middle_length = [handle.length - 3, 3].min
        asterisks = '*' * middle_length
        
        "#{first_char}#{asterisks}#{last_char}"
      end

      def send_verification(phone)
        logger.debug "========== SEND VERIFICATION =========="
        # Generate a verification code
        code = rand(100000..999999).to_s
        cache_key = "verification:#{phone}"
        
        # HIGHLY VISIBLE LOGGING FOR DEVELOPMENT
        puts "\n\n"
        puts "========================================================"
        puts "🔑 VERIFICATION CODE FOR #{phone}: #{code} 🔑"
        puts "========================================================"
        puts "\n\n"
        
        # More aggressive logging with multiple methods to ensure visibility
        logger.info "VERIFICATION CODE GENERATED: #{code} for #{phone}"
        logger.warn "VERIFICATION CODE: #{code} for #{phone}"
        
        # Use error level logging to ensure it appears even in production
        logger.error "VERIFICATION CODE (IMPORTANT): #{code} for #{phone}"
        
        # Print to STDOUT/STDERR directly
        STDOUT.puts "VERIFICATION CODE: #{code} for #{phone}"
        STDERR.puts "VERIFICATION CODE: #{code} for #{phone}"
        
        cache_data = {
          code: code,
          phone: phone,
          expires_at: 15.minutes.from_now  # Extended from 10 to 15 minutes
        }
        
        Rails.cache.write(
          cache_key, 
          cache_data,
          expires_in: 15.minutes,  # Extended from 10 to 15 minutes
          race_condition_ttl: 30.seconds,  # Increased race condition window
          force: true  # Ensure we overwrite any existing code
        )
        
        # Verify the write succeeded
        stored_data = Rails.cache.read(cache_key)
        if stored_data.nil?
          logger.error "Failed to store verification code in cache"
          raise "Cache write failed"
        end
        
        logger.debug "Generated code: #{code}"
        logger.debug "Cache key: #{cache_key}"
        logger.debug "Cache data: #{cache_data.inspect}"
        logger.debug "Verification data in cache: #{stored_data.inspect}"
        
        # Add a fallback log file specifically for verification codes
        begin
          File.open(Rails.root.join('log', 'verification_codes.log'), 'a') do |f|
            f.puts "[#{Time.current}] CODE: #{code} for PHONE: #{phone}"
          end
        rescue => e
          logger.error "Failed to write to verification_codes.log: #{e.message}"
        end
        
        TwilioService.send_sms(phone, "Your SuperApp verification code: #{code}")
        logger.debug "SMS sent successfully"
      end

      def recently_verified?(last_verified_at)
        return false unless last_verified_at
        
        begin
          Time.parse(last_verified_at) > 30.days.ago
        rescue
          false
        end
      end

      def handle_authenticated_device(device)
        logger.debug "Processing authenticated device: #{device.inspect}"
        db = SQLite3::Database.new(Rails.root.join('db', device[:path]))
        last_verified = db.get_first_row("SELECT last_verified_at FROM device_info LIMIT 1")[0]
        db.close
        
        if last_verified && Time.parse(last_verified) > 30.days.ago
          logger.debug "Device recently verified, confirming"
          confirm_device(device[:path])
          
          # Store full session info using helper
          ensure_complete_session_data({
            handle: device[:info][:handle],
            guid: device[:info][:guid],
            phone: device[:info][:phone],
            device_key: device[:info][:device_id],
            device_path: device[:path],
            auth_version: Time.current.to_i
          })
          
          render json: {
            status: 'authenticated',
            redirect_to: '/dashboard',
            device_key: device[:info][:device_id],
            handle: device[:info][:handle],
            phone: mask_phone(device[:info][:phone]),
            device_header_data: generate_device_header_data(
              device[:info][:device_id],
              device[:info][:guid],
              device[:info][:handle]            
            ),
            auth_version: Time.current.to_i,
            message: "Welcome back #{device[:info][:handle]}!"
          }
        else
          logger.debug "Device needs verification"
          session[:pending_device_path] = device[:path]
          session[:verification_phone] = device[:info][:phone]
          session[:current_handle] = device[:info][:handle] # Keep handle for welcome back
          
          send_verification(device[:info][:phone])
          
          render json: {
            status: 'needs_quick_verification',
            database_path: device[:path],
            handle: device[:info][:handle],
            guid: device[:info][:guid],
            device_key: device[:info][:device_id],
            masked_phone: mask_phone(device[:info][:phone]),
            message: "Welcome back #{device[:info][:handle]}! Please verify this device."
          }
        end
      end

      def get_device_info(path)
        logger.debug "Getting device info from: #{path}"
        
        db = SQLite3::Database.new(path)
        result = db.get_first_row("SELECT device_id, handle, guid, phone, created_at, last_verified_at FROM device_info LIMIT 1")
        
        # Try to get device characteristics
        device_characteristics = nil
        begin
          has_characteristics_table = db.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='device_characteristics'").any? rescue false
          if has_characteristics_table
            char_row = db.get_first_row("SELECT characteristics FROM device_characteristics LIMIT 1")
            if char_row && char_row[0]
              device_characteristics = char_row[0]
            end
          end
        rescue => e
          logger.error "Error retrieving device characteristics: #{e.message}"
        end
        
        db.close
        
        device_info = result ? {
          device_id: result[0],
          handle: result[1],
          guid: result[2],
          phone: result[3],
          created_at: result[4],
          last_verified_at: result[5],
          device_characteristics: device_characteristics
        } : nil
        
        logger.debug "Device info result: #{device_info.inspect}"
        device_info
      rescue SQLite3::Exception => e
        logger.error "Database error: #{e.message}"
        nil
      end

      def normalize_phone(phone)
        logger.debug "Normalizing phone: #{phone}"
        phone = phone.gsub(/[^0-9+]/, '')
        
        case phone
        when /^\+44/
          unless phone.match?(/^\+44[7][0-9]{9}$/)
            error_msg = "Invalid UK mobile number format. Must start with +447"
            logger.error "Error: #{error_msg}"
            raise error_msg
          end
        when /^\+65/
          unless phone.match?(/^\+65[689][0-9]{7}$/)
            error_msg = "Invalid Singapore mobile number format"
            logger.error "Error: #{error_msg}"
            raise error_msg
          end
        else
          error_msg = "Invalid phone format. Please use +44 or +65"
          logger.error "Error: #{error_msg}"
          raise error_msg
        end
        
        logger.debug "Normalized phone: #{phone}"
        phone
      end

      def mask_phone(phone)
        return unless phone
        masked = "*******#{phone.last(4)}"
        logger.debug "Masked phone: #{masked}"
        masked
      end

      def confirm_device(device_path)
        logger.debug "========== CONFIRM DEVICE =========="
        logger.debug "Device path: #{device_path}"
        
        db = SQLite3::Database.new(Rails.root.join('db', device_path))
        db.execute(
          "UPDATE device_info SET last_verified_at = ?",
          [Time.current.iso8601]
        )
        
        # Also confirm any pending browser keys
        db.execute("UPDATE browser_keys SET pending = 0 WHERE pending = 1")
        
        db.close
        logger.debug "Device verification updated"
      end

# Find or create a device for an existing user
def find_or_create_device_for_user(user)
  # Try to find existing device first
  browser_key = request.headers['HTTP_X_DEVICE_KEY'] || SecureRandom.hex(32)
  device_header = request.headers['HTTP_X_DEVICE_HEADER']
  
  # Try to find via device header first (for cross-browser)
  if device_header && defined?(DeviceRecognitionService)
    logger.debug "Trying to find device via device header"
    service = DeviceRecognitionService.new(browser_key, session, logger, device_header)
    devices = service.find_devices_for_user(user.guid) 
    
    if devices.any?
      # Return the most recently used device
      device = devices.max_by do |d|
        Time.parse(d[:last_verified_at] || "2000-01-01") rescue Time.parse("2000-01-01")
      end
      
      # Register this browser with the device
      service.add_browser_key_to_device(device[:path], browser_key)
      
      logger.debug "Found existing device via header: #{device[:path]}"
      return device[:path]
    end
  end
  
  # Create a new device if none found
  device_guid = SecureRandom.uuid
  new_path = "devices/#{device_guid}.sqlite3"
  
  # Ensure directory exists
  device_dir = Rails.root.join('db', 'devices')
  FileUtils.mkdir_p(device_dir) unless Dir.exist?(device_dir)
  
  # Create database
  db = SQLite3::Database.new(Rails.root.join('db', new_path))
  db.transaction do
    db.execute <<-SQL
      CREATE TABLE device_info (
        device_id TEXT PRIMARY KEY,
        handle TEXT,
        guid TEXT,
        phone TEXT,
        created_at TEXT,
        last_verified_at TEXT,
        device_name TEXT,
        is_trusted INTEGER DEFAULT 0
      )
    SQL

    db.execute <<-SQL
      CREATE TABLE sync_state (
        id INTEGER PRIMARY KEY,
        last_sync TEXT,
        status TEXT
      )
    SQL
    
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
    
    db.execute <<-SQL
      CREATE TABLE device_characteristics (
        id INTEGER PRIMARY KEY,
        characteristics TEXT,
        updated_at TEXT
      )
    SQL
    
    # Insert initial data
    db.execute(
      "INSERT INTO device_info (device_id, handle, guid, phone, created_at, last_verified_at) VALUES (?, ?, ?, ?, ?, ?)",
      [browser_key, user.handle, user.guid, user.phone, Time.current.iso8601, Time.current.iso8601]
    )
    
    db.execute(
      "INSERT INTO sync_state (last_sync, status) VALUES (?, ?)",
      [Time.current.iso8601, 'initialized']
    )
    
    # Add browser key
    db.execute(
      "INSERT INTO browser_keys (browser_id, browser_name, user_agent, added_at, last_used, pending) VALUES (?, ?, ?, ?, ?, ?)",
      [browser_key, detect_browser(request.user_agent), request.user_agent, Time.current.iso8601, Time.current.iso8601, 0]
    )
  end
  db.close
  
  logger.debug "Created new device for user: #{new_path}"
  return new_path
end

# Create a new device for a new user
def create_new_device_for_user(user)
  # Similar to above but ensure phone and handle are set
  # for the new user scenario
  
  browser_key = request.headers['HTTP_X_DEVICE_KEY'] || SecureRandom.hex(32)
  device_guid = SecureRandom.uuid
  new_path = "devices/#{device_guid}.sqlite3"
  
  # Ensure directory exists
  device_dir = Rails.root.join('db', 'devices')
  FileUtils.mkdir_p(device_dir) unless Dir.exist?(device_dir)
  
  # Create database
  db = SQLite3::Database.new(Rails.root.join('db', new_path))
  db.transaction do
    db.execute <<-SQL
      CREATE TABLE device_info (
        device_id TEXT PRIMARY KEY,
        handle TEXT,
        guid TEXT,
        phone TEXT,
        created_at TEXT,
        last_verified_at TEXT,
        device_name TEXT,
        is_trusted INTEGER DEFAULT 0
      )
    SQL

    db.execute <<-SQL
      CREATE TABLE sync_state (
        id INTEGER PRIMARY KEY,
        last_sync TEXT,
        status TEXT
      )
    SQL
    
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
    
    db.execute <<-SQL
      CREATE TABLE device_characteristics (
        id INTEGER PRIMARY KEY,
        characteristics TEXT,
        updated_at TEXT
      )
    SQL
    
    # Insert initial data
    db.execute(
      "INSERT INTO device_info (device_id, handle, guid, phone, created_at, last_verified_at) VALUES (?, ?, ?, ?, ?, ?)",
      [browser_key, user.handle, user.guid, user.phone, Time.current.iso8601, Time.current.iso8601]
    )
    
    db.execute(
      "INSERT INTO sync_state (last_sync, status) VALUES (?, ?)",
      [Time.current.iso8601, 'new_user_device']
    )
    
    # Add browser key
    db.execute(
      "INSERT INTO browser_keys (browser_id, browser_name, user_agent, added_at, last_used, pending) VALUES (?, ?, ?, ?, ?, ?)",
      [browser_key, detect_browser(request.user_agent), request.user_agent, Time.current.iso8601, Time.current.iso8601, 0]
    )
  end
  db.close
  
  logger.debug "Created new device for new user: #{new_path}"
  return new_path
end


      def update_device_verification(db, handle)
        logger.debug "========== UPDATE DEVICE VERIFICATION =========="
        logger.debug "Updating verification for handle: #{handle}"
        
        db.execute(
          "UPDATE device_info SET last_verified_at = ?",
          [Time.current.iso8601]
        )
        logger.debug "Device verification timestamp updated"
      end

      def link_device_to_user(user, device_path)
        logger.debug "========== LINK DEVICE TO USER =========="
        logger.debug "Linking device to user: #{user.inspect}"
        logger.debug "Device path: #{device_path}"
        
        db = SQLite3::Database.new(Rails.root.join('db', device_path))
        db.transaction do
          db.execute(
            "UPDATE device_info SET handle = ?, phone = ?, guid = ?, last_verified_at = ?",
            [user.handle, user.phone, user.guid, Time.current.iso8601]
          )
          
          db.execute(
            "INSERT INTO sync_state (last_sync, status) VALUES (?, ?)",
            [Time.current.iso8601, 'linked_to_user']
          )
        end
        db.close
      end

      def ensure_device_directory
        logger.debug "========== ENSURE DEVICE DIRECTORY =========="
        device_dir = Rails.root.join('db', 'devices')
        
        unless Dir.exist?(device_dir)
          logger.debug "Creating devices directory: #{device_dir}"
          FileUtils.mkdir_p(device_dir)
        end
      end

      def generate_device_key
        SecureRandom.hex(32)
      end
      
      def current_device
        return @current_device if defined?(@current_device)
        
        if session[:device_path] && File.exist?(Rails.root.join('db', session[:device_path]))
          begin
            @current_device = get_device_info(Rails.root.join('db', session[:device_path]))
          rescue => e
            logger.error "Error retrieving current device: #{e.message}"
            @current_device = nil
          end
        else
          @current_device = nil
        end
      end
      
      # Simple browser detection from user agent
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
        else
          "Unknown"
        end
      end
    end # End AuthController
  end # End V1
end # End Api
