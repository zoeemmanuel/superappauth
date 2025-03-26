module Api
  module V1
    class AuthController < ApplicationController
      skip_before_action :verify_authenticity_token

      # New endpoint for checking handle existence without triggering authentication
def check_handle
  begin
    handle = params[:handle]
    logger.debug "Checking handle: #{handle}"
    
    user = User.find_by(handle: handle)
    logger.debug "User found: #{user.present?}"
    
    if user
      device_key = request.headers['HTTP_X_DEVICE_KEY']
      is_your_device = false
      
      # Check if this device is registered for this user
      Dir.glob(Rails.root.join('db', 'devices', '*.sqlite3')).each do |db_path|
        begin
          db = SQLite3::Database.new(db_path)
          device_info = db.get_first_row("SELECT device_id, handle FROM device_info LIMIT 1")
          db.close
          
          if device_info && device_info[0] == device_key && device_info[1] == handle
            is_your_device = true
            break
          end
        rescue StandardError => e
          logger.error "Error checking device: #{e.message}"
        end
      end
      
      render json: {
        exists: true,
        is_your_device: is_your_device,
        masked_phone: mask_phone(user.phone),
        masked_handle: mask_handle(handle)
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
          user = User.find_by(phone: normalized_phone)
          
          if user
            device_key = request.headers['HTTP_X_DEVICE_KEY']
            is_your_device = false
            
            # Check if this device is registered for this user
            Dir.glob(Rails.root.join('db', 'devices', '*.sqlite3')).each do |db_path|
              begin
                db = SQLite3::Database.new(db_path)
                device_info = db.get_first_row("SELECT device_id, phone FROM device_info LIMIT 1")
                db.close
                
                if device_info && device_info[0] == device_key && device_info[1] == normalized_phone
                  is_your_device = true
                  break
                end
              rescue StandardError => e
                logger.error "Error checking device: #{e.message}"
              end
            end
            
            render json: {
              exists: true,
              is_your_device: is_your_device,
              handle: user.handle,
              masked_handle: mask_handle(user.handle),
              masked_phone: mask_phone(normalized_phone)
            }
          else
            render json: { exists: false }
          end
        rescue => e
          logger.error "Error in check_phone: #{e.message}"
          render json: { error: e.message }, status: :unprocessable_entity
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

      # Public API endpoints  
def check_device
  logger.debug "========== CHECK DEVICE START =========="
  logger.debug "Current session: #{session.to_h}"
  
  # SECURITY FIX: Aggressively check for and enforce device registration flow
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
      # Check if recently verified - if so, auto-login across browsers on same device
      is_recently_verified = matching_device[:info][:last_verified_at] && 
                            Time.parse(matching_device[:info][:last_verified_at]) > 30.days.ago
      
      # Only auto-login if not in device registration flow
      if is_recently_verified && auto_login_allowed
        # Auto-login for cross-browser on same device
        session[:device_path] = matching_device[:path]
        session[:current_handle] = matching_device[:info][:handle]
        session[:current_phone] = matching_device[:info][:phone]
        session[:current_guid] = matching_device[:info][:guid]
        session[:device_session] = 'authenticated'
        session[:current_device_id] = matching_device[:info][:device_id]
        
        return render json: {
          status: 'authenticated',
          redirect_to: '/dashboard',
          device_key: matching_device[:info][:device_id],
          handle: matching_device[:info][:handle],
          message: "Welcome back #{matching_device[:info][:handle]}!"
        }
      else
        # Return with quick verification
        session[:pending_device_path] = matching_device[:path]
        session[:verification_phone] = matching_device[:info][:phone]
        session[:current_handle] = matching_device[:info][:handle] # Save handle for welcome back
        session[:pending_verification] = true
        
        send_verification(matching_device[:info][:phone])
        
        device_key = request.headers['HTTP_X_DEVICE_KEY']
        
        return render json: {
          status: 'needs_quick_verification',
          handle: previous_handle,
          device_key: device_key || generate_device_key(),
          masked_phone: mask_phone(matching_device[:info][:phone]),
          message: "Welcome back #{previous_handle}! Please verify this device."
        }
      end
    end
  end
  
  begin
    logger.debug "========== ENSURE DEVICE DIRECTORY =========="
    ensure_device_directory
    device_key = request.headers['HTTP_X_DEVICE_KEY']
    logger.debug "Received Device Key: #{device_key.inspect}"
    
    # Check if DeviceRecognitionService is defined and use it
    if defined?(DeviceRecognitionService)
      logger.debug "Using DeviceRecognitionService"
      service = DeviceRecognitionService.new(device_key, session, logger)
      device_result = service.recognize_device
      
      case device_result[:status]
      when 'authenticated'
        # Only allow auto-login if not in device registration flow
        if auto_login_allowed
          # Store session data and redirect to dashboard
          session[:device_session] = 'authenticated'
          session[:current_handle] = device_result[:handle]
          session[:device_path] = device_result[:path]
          session[:current_phone] = device_result[:phone]
          session[:current_guid] = device_result[:guid]
          session[:current_device_id] = device_result[:device_key]
          
          # Create a new linked device for cross-browser if needed
          if device_result[:cross_browser] && device_key && device_key != device_result[:device_key]
            logger.debug "Cross-browser detected, creating linked device"
            new_device_path = create_linked_device(
              device_key,
              device_result[:guid],
              device_result[:handle],
              device_result[:phone]
            )
            
            # Update session with the new device path
            session[:device_path] = new_device_path
          end
          
          render json: {
            status: 'authenticated',
            redirect_to: '/dashboard',
            device_key: device_key || device_result[:device_key],
            handle: device_result[:handle],
            phone: mask_phone(device_result[:phone]),
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
            message: "Welcome back #{device_result[:handle]}! Please verify this device."
          }
          return
        end
        
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
          message: "Welcome back #{device_result[:handle]}! Please verify this device."
        }
        return
        
      when 'show_options', 'new_device'
        # Fall through to regular device check flow
      end
    end
    
    # Fallback to direct database scanning if no service or not recognized
    # Scan directory for device databases
    all_devices = []
    
    # Get session identifiers for the current user (if any)
    current_session_guid = session[:current_guid]
    current_session_handle = session[:current_handle]
    current_session_phone = session[:current_phone] || session[:verification_phone]
    
    Dir.glob(Rails.root.join('db', 'devices', '*.sqlite3')).each do |db_path|
      begin
        device_info = get_device_info(db_path)
        next unless device_info
        
        all_devices << {
          path: db_path.split('db/').last,
          info: device_info
        }
      rescue StandardError => e
        logger.error "Error reading device database #{db_path}: #{e.message}"
        next
      end
    end
    
    logger.debug "Found #{all_devices.size} total devices, #{all_devices.count { |d| d[:info][:handle].present? }} with user handles"
    
    # 1. Look for exact device key match (same browser)
    exact_match = all_devices.find { |d| d[:info][:device_id] == device_key }
    if exact_match && exact_match[:info][:handle].present?
      logger.debug "Found exact device key match: #{exact_match[:info][:handle]}"
      
      # Only allow auto-login if not in device registration flow
      if auto_login_allowed
        handle_authenticated_device(exact_match)
      else
        session[:pending_device_path] = exact_match[:path]
        session[:verification_phone] = exact_match[:info][:phone]
        session[:current_handle] = exact_match[:info][:handle]
        session[:pending_verification] = true
        
        send_verification(exact_match[:info][:phone])
        
        render json: {
          status: 'needs_quick_verification',
          handle: exact_match[:info][:handle],
          device_key: exact_match[:info][:device_id],
          masked_phone: mask_phone(exact_match[:info][:phone]),
          message: "Verify it's you, #{exact_match[:info][:handle]}"
        }
      end
      return
    end
    
    # 2. Cross-browser functionality - check for same device by checking session data
    if current_session_guid || current_session_handle || current_session_phone || 
      previous_guid || previous_handle || previous_phone
      
      user_devices = all_devices.select do |device|
        device[:info][:handle].present? && (
          (current_session_guid && device[:info][:guid] == current_session_guid) ||
          (current_session_handle && device[:info][:handle] == current_session_handle) ||
          (current_session_phone && device[:info][:phone] == current_session_phone) ||
          (previous_guid && device[:info][:guid] == previous_guid) ||
          (previous_handle && device[:info][:handle] == previous_handle) ||
          (previous_phone && device[:info][:phone] == previous_phone)
        )
      end
      
      if user_devices.any?
        # Get the most recently verified device for this user
        cross_browser_device = user_devices.max_by do |d|
          Time.parse(d[:info][:last_verified_at] || "2000-01-01") rescue Time.parse("2000-01-01")
        end
        
        logger.debug "CROSS-BROWSER: Found existing device for current user: #{cross_browser_device[:info][:handle]}"
        
        # Check if it's recently verified
        is_recently_verified = cross_browser_device[:info][:last_verified_at] && 
                              Time.parse(cross_browser_device[:info][:last_verified_at]) > 30.days.ago
        
        # For new device registration, always require verification
        if is_device_registration || !auto_login_allowed
          logger.debug "Device registration flow detected, requiring verification for cross-browser"
          session[:pending_device_path] = cross_browser_device[:path]
          session[:verification_phone] = cross_browser_device[:info][:phone]
          session[:current_handle] = cross_browser_device[:info][:handle]
          session[:pending_verification] = true
          
          send_verification(cross_browser_device[:info][:phone])
          
          render json: {
            status: 'needs_quick_verification',
            handle: cross_browser_device[:info][:handle],
            device_key: cross_browser_device[:info][:device_id],
            masked_phone: mask_phone(cross_browser_device[:info][:phone]),
            message: "Welcome back #{cross_browser_device[:info][:handle]}! Please verify this device."
          }
        elsif is_recently_verified && auto_login_allowed
          # Auto-login for cross-browser on same device (not new device registration)
          session[:device_path] = cross_browser_device[:path]
          session[:current_handle] = cross_browser_device[:info][:handle]
          session[:current_phone] = cross_browser_device[:info][:phone]
          session[:current_guid] = cross_browser_device[:info][:guid]
          session[:device_session] = 'authenticated'
          
          # Create a new device linked to this user
          new_device_path = create_linked_device(
            device_key, 
            cross_browser_device[:info][:guid],
            cross_browser_device[:info][:handle],
            cross_browser_device[:info][:phone]
          )
          
          session[:device_path] = new_device_path
          
          render json: {
            status: 'authenticated',
            redirect_to: '/dashboard',
            device_key: device_key,
            handle: cross_browser_device[:info][:handle],
            message: "Welcome back #{cross_browser_device[:info][:handle]}!"
          }
        else
          # Always require verification for old devices 
          session[:pending_device_path] = cross_browser_device[:path]
          session[:verification_phone] = cross_browser_device[:info][:phone]
          session[:current_handle] = cross_browser_device[:info][:handle]
          session[:pending_verification] = true
          
          send_verification(cross_browser_device[:info][:phone])
          
          render json: {
            status: 'needs_quick_verification',
            handle: cross_browser_device[:info][:handle],
            device_key: cross_browser_device[:info][:device_id],
            masked_phone: mask_phone(cross_browser_device[:info][:phone]),
            message: "Welcome back #{cross_browser_device[:info][:handle]}! Please verify this device."
          }
        end
        return
      end
    end
    
    # 3. Create new device as last resort
    if device_key&.match?(/\A[0-9a-f]{64}\z/)
      logger.debug "Valid device key format, creating new device"
      create_new_device(device_key)
    else
      logger.debug "Invalid device key format or no key provided"
      create_new_device
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
      
      def verify_code
        logger.debug "========== VERIFY CODE START =========="
        logger.debug "Parameters: #{params.inspect}"
        logger.debug "Session before: #{session.to_h}"
        
        device_path = session[:pending_device_path]
        unless device_path
          logger.error "No pending device path found"
          return render json: { error: 'Invalid session', status: 'error' }, status: :unprocessable_entity
        end

        code = params[:code].strip
        phone = session[:verification_phone] || params[:phone]
        cache_key = "verification:#{phone}"
        
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
        
        # Add a mutex for thread safety when verifying 
        @@verification_mutex ||= Mutex.new
        
        @@verification_mutex.synchronize do
          verification = Rails.cache.read(cache_key)
          logger.debug "Cache data: #{verification.inspect}"

          if verification.nil?
            logger.error "No verification found in cache for key: #{cache_key}"
            return render json: { error: 'Verification code expired', status: 'error' }, status: :unprocessable_entity
          end

          if verification[:code].to_s == code.to_s
            logger.debug "Code verified successfully"
            db = SQLite3::Database.new(Rails.root.join('db', device_path))
            device_info = db.get_first_row("SELECT device_id, handle, guid, phone FROM device_info LIMIT 1")
            logger.debug "Device info: #{device_info.inspect}"

            if device_info && device_info[1] # Quick verification for known device
              logger.debug "Known device - updating verification"
              update_device_verification(db, device_info[1])
              confirm_device(device_path)
              db.close
              
              # Clear ALL flags after successful verification
              session.delete(:device_registration_flow)
              session.delete(:device_registration)
              session.delete(:handle_first)
              
              return render json: {
                status: 'authenticated',
                redirect_to: '/dashboard',
                device_key: device_info[0]
              }
            end
            db.close
            
            user = User.find_by(phone: phone)
            # Check if we already have a handle stored in the session or params
            stored_handle = session[:pending_handle] || params[:handle] || params.dig(:auth, :handle)
            
            if user 
              logger.debug "Existing user found: #{user.inspect}"
              link_device_to_user(user, device_path)
              confirm_device(device_path)
              
              # Clear ALL flags after successful verification
              session.delete(:device_registration_flow)
              session.delete(:device_registration)
              session.delete(:handle_first)
              
              db = SQLite3::Database.new(Rails.root.join('db', device_path))
              device_info = db.get_first_row("SELECT device_id FROM device_info LIMIT 1")
              db.close
              
              render json: {
                status: 'authenticated',
                redirect_to: '/dashboard',
                device_key: device_info[0]
              }
            elsif stored_handle.present?
              # Use the handle that was already provided
              logger.debug "Using stored handle for new user: #{stored_handle}"
              
              user = User.new(phone: phone, handle: stored_handle, guid: SecureRandom.uuid)
              if user.save
                link_device_to_user(user, device_path)
                confirm_device(device_path)
                
                # Clear ALL flags after successful verification
                session.delete(:device_registration_flow)
                session.delete(:device_registration)
                session.delete(:handle_first)
                
                db = SQLite3::Database.new(Rails.root.join('db', device_path))
                device_info = db.get_first_row("SELECT device_id FROM device_info LIMIT 1")
                db.close
                
                render json: {
                  status: 'authenticated',
                  redirect_to: '/dashboard',
                  device_key: device_info[0]
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
          else
            logger.debug "Code verification failed"
            logger.debug "Expected: #{verification[:code]}"
            logger.debug "Received: #{code}"
            render json: { error: 'Invalid verification code', status: 'error' }, status: :unprocessable_entity
          end
        end
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
              device_key = request.headers['HTTP_X_DEVICE_KEY']
              if device_key.present?
                logger.debug "Creating new pending device for device key: #{device_key}"
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
                    
                    db.execute(
                      "INSERT INTO device_info (device_id, guid, created_at) VALUES (?, ?, ?)",
                      [device_key, device_guid, Time.current.iso8601]
                    )
                    
                    db.execute(
                      "INSERT INTO sync_state (last_sync, status) VALUES (?, ?)",
                      [Time.current.iso8601, 'pending_registration']
                    )
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
            
            # Send SMS verification
            send_verification(user.phone)
            
            render json: {
              status: 'verification_needed',
              handle: user.handle,
              masked_phone: mask_phone(user.phone),
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
            device_key = request.headers['HTTP_X_DEVICE_KEY']
            is_known_device = false
            
            # Store in session for cross-browser
            session[:current_handle] = user.handle
            session[:current_phone] = user.phone
            
            # Scan devices to see if this device key is associated with this user
            Dir.glob(Rails.root.join('db', 'devices', '*.sqlite3')).each do |db_path|
              begin
                db = SQLite3::Database.new(db_path)
                device_info = db.get_first_row("SELECT device_id, handle, guid FROM device_info LIMIT 1")
                db.close
                
                if device_info && device_info[0] == device_key && device_info[1] == handle
                  # This device is already registered for this user
                  is_known_device = true
                  logger.debug "Found known device with key #{device_key&.slice(0, 10)}..."
                  break
                end
              rescue StandardError => e
                logger.error "Error checking device: #{e.message}"
              end
            end
            
            if is_known_device
              # This is a known device, proceed with verification
              session[:verification_phone] = user.phone
              send_verification(user.phone)
              
              render json: {
                status: 'verification_needed',
                handle: handle,
                masked_phone: mask_phone(user.phone),
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
               masked_phone: mask_phone(user.phone)
               }
               session[:account_already_exists] = account_data.to_json
              
              render json: {
                status: 'handle_exists',  # This is the key status
                handle: handle,
                masked_handle: masked_handle,
                masked_phone: mask_phone(user.phone),
                suggested_handles: suggested_handles,
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
    device_key = request.headers['HTTP_X_DEVICE_KEY']
    is_known_device = false
    
    # Store user info in session for cross-browser recognition
    session[:current_handle] = user.handle
    session[:current_phone] = user.phone
    session[:current_guid] = user.guid
    
    # Scan devices to see if this device key is associated with this user
    Dir.glob(Rails.root.join('db', 'devices', '*.sqlite3')).each do |db_path|
      begin
        db = SQLite3::Database.new(db_path)
        device_info = db.get_first_row("SELECT device_id, phone, guid FROM device_info LIMIT 1")
        db.close
        
        if device_info && device_info[0] == device_key && 
           (device_info[1] == phone || device_info[2] == user.guid)
          # This device is already registered for this user
          is_known_device = true
          break
        end
      rescue StandardError => e
        logger.error "Error checking device: #{e.message}"
      end
    end
    
    if is_known_device
      # Known device, send verification
      logger.info "===== SENDING VERIFICATION TO KNOWN DEVICE ====="
      send_verification(phone)
      
      render json: {
        status: 'verification_needed',
        phone: phone,
        handle: user.handle,
        masked_phone: mask_phone(phone)
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
        masked_phone: mask_phone(phone)
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
        phone = session[:verification_phone]
        
        unless handle && handle.match?(/\A@[a-zA-Z0-9_]+\z/)
          return render json: { error: 'Invalid handle format', status: 'error' }, status: :unprocessable_entity
        end
        
        unless phone
          return render json: { error: 'No phone found in session', status: 'error' }, status: :unprocessable_entity
        end
        
        # Check if handle already exists
        if User.exists?(handle: handle)
          return render json: { 
            error: 'Handle already taken', 
            status: 'handle_exists',
            message: 'This handle is already taken. Please choose another.'
          }, status: :unprocessable_entity
        end
        
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
            confirm_device(device_path)
            
            # Clear temporary session data
            session.delete(:pending_device_path)
            session.delete(:verification_phone)
            
            # Set authenticated session
            session[:device_session] = 'authenticated'
            session[:current_handle] = user.handle
            session[:current_phone] = user.phone
            session[:current_guid] = user.guid
            
            render json: {
              status: 'authenticated',
              redirect_to: '/dashboard',
              handle: user.handle
            }
          else
            render json: { error: 'No device path found', status: 'error' }, status: :unprocessable_entity
          end
        else
          render json: { 
            error: user.errors.full_messages.join(', '), 
            status: 'error'
          }, status: :unprocessable_entity
        end
      end
      
      private

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

      def set_device_registration_state_from_request
        # Detect all possible indicators of a device registration flow
        is_device_registration = false
        
        # Check all possible sources that might indicate being in a device registration flow
        is_device_registration ||= request.referrer&.include?('account_exists')
        is_device_registration ||= params[:device_registration].present?
        is_device_registration ||= params.dig(:auth, :device_registration).present?
        is_device_registration ||= session[:device_registration_flow].present?
        is_device_registration ||= session[:device_registration] == 'true'
        is_device_registration ||= request.path.include?('account_exists')
        is_device_registration ||= request.original_fullpath.include?('account_exists')
        
        # Keep track of this state in the session (persists across page refreshes)
        if is_device_registration
          session[:device_registration_flow] = true
          logger.info "Setting device_registration_flow flag in session for security"
        end
        
        # Return the result so it can be used in the check_device method
        is_device_registration
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
        Time.parse(last_verified_at) > 30.days.ago
      end

      def handle_authenticated_device(device)
        logger.debug "Processing authenticated device: #{device.inspect}"
        db = SQLite3::Database.new(Rails.root.join('db', device[:path]))
        last_verified = db.get_first_row("SELECT last_verified_at FROM device_info LIMIT 1")[0]
        db.close
        
        if last_verified && Time.parse(last_verified) > 30.days.ago
          logger.debug "Device recently verified, confirming"
          confirm_device(device[:path])
          
          # Store full session info
          session[:device_session] = 'authenticated'
          session[:current_handle] = device[:info][:handle]
          session[:device_path] = device[:path]
          session[:current_phone] = device[:info][:phone]
          session[:current_guid] = device[:info][:guid]
          session[:current_device_id] = device[:info][:device_id]
          
          render json: {
            status: 'authenticated',
            redirect_to: '/dashboard',
            device_key: device[:info][:device_id],
            handle: device[:info][:handle],
            phone: mask_phone(device[:info][:phone]),
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
        result = db.get_first_row("SELECT device_id, handle, guid, phone FROM device_info LIMIT 1")
        db.close
        
        device_info = result ? {
          device_id: result[0],
          handle: result[1],
          guid: result[2],
          phone: result[3]
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
        db.close
        logger.debug "Device verification updated"
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
        
        # Update session with all necessary info for cross-browser
        session[:device_path] = device_path
        session[:current_handle] = user.handle
        session[:current_phone] = user.phone
        session[:device_session] = 'authenticated'
        session[:current_device_id] = get_device_info(Rails.root.join('db', device_path))[:device_id]
        session[:current_guid] = user.guid
        
        logger.debug "Device linked to user"
      end

      def ensure_device_directory
        logger.debug "========== ENSURE DEVICE DIRECTORY =========="
        device_dir = Rails.root.join('db', 'devices')
        
        unless Dir.exist?(device_dir)
          logger.debug "Creating devices directory: #{device_dir}"
          FileUtils.mkdir_p(device_dir)
        end
      end

      def create_linked_device(device_key, guid, handle, phone)
        logger.debug "========== CREATE LINKED DEVICE =========="
        logger.debug "Creating device linked to #{handle} with GUID #{guid}"
        
        begin
          device_id = device_key || SecureRandom.hex(32)
          device_guid = SecureRandom.uuid
          new_path = "devices/#{device_guid}.sqlite3"
          full_path = Rails.root.join('db', new_path)
          
          # Make sure directory exists
          FileUtils.mkdir_p(File.dirname(full_path))
          
          # Initialize database with transaction
          db = SQLite3::Database.new(full_path)
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
            
            # Create already linked to user
            db.execute(
              "INSERT INTO device_info (device_id, guid, handle, phone, created_at, last_verified_at) VALUES (?, ?, ?, ?, ?, ?)",
              [device_id, guid, handle, phone, Time.current.iso8601, Time.current.iso8601]
            )
            
            db.execute(
              "INSERT INTO sync_state (last_sync, status) VALUES (?, ?)",
              [Time.current.iso8601, 'cross_browser_linked']
            )
          end
          db.close
          
          logger.debug "Cross-browser device created and linked successfully"
          return new_path
          
        rescue SQLite3::Exception => e
          logger.error "Database error creating linked device: #{e.class} - #{e.message}\n#{e.backtrace.join("\n")}"
          raise e
        end
      end

      def create_new_device(device_key = nil)
        logger.debug "========== CREATE NEW DEVICE =========="
        
        begin
          device_id = device_key || SecureRandom.hex(32)
          device_guid = SecureRandom.uuid
          new_path = "devices/#{device_guid}.sqlite3"
          full_path = Rails.root.join('db', new_path)
          
          logger.debug "Creating new device:"
          logger.debug "Device ID: #{device_id}"
          logger.debug "GUID: #{device_guid}"
          logger.debug "Path: #{new_path}"
          
          # Make sure directory exists
          FileUtils.mkdir_p(File.dirname(full_path))
          
          # Check if we can write to the directory
          unless File.writable?(File.dirname(full_path))
            logger.error "Directory not writable: #{File.dirname(full_path)}"
            return render json: { error: 'Device storage not accessible' }, status: :internal_server_error
          end
          
          # Initialize database with transaction
          db = SQLite3::Database.new(full_path)
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
            
            db.execute(
              "INSERT INTO device_info (device_id, guid, created_at) VALUES (?, ?, ?)",
              [device_id, device_guid, Time.current.iso8601]
            )
            
            db.execute(
              "INSERT INTO sync_state (last_sync, status) VALUES (?, ?)",
              [Time.current.iso8601, 'initialized']
            )
          end
          db.close
          
          session[:pending_device_path] = new_path
          logger.debug "Device database initialized successfully"
          
          render json: {
            status: 'show_options',
            device_not_registered: true,  # Add this flag to indicate device not registered
            message: "This device is not registered. Please login or create a new account.",
            database_path: new_path,
            guid: device_guid,
            device_key: device_id
          }
          
        rescue SQLite3::Exception => e
          logger.error "Database error creating device: #{e.class} - #{e.message}\n#{e.backtrace.join("\n")}"
          render json: { error: 'Failed to create device database' }, status: :internal_server_error
        rescue StandardError => e
          logger.error "Error creating device: #{e.class} - #{e.message}\n#{e.backtrace.join("\n")}"
          render json: { error: 'Failed to create device' }, status: :internal_server_error
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
    end # End AuthController
  end # End V1
end # End Api
