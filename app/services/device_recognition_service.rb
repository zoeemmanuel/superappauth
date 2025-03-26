# Enhanced implementation with cross-browser device recognition and hardware-based differentiation
class DeviceRecognitionService
  attr_reader :browser_key, :device_header, :session, :logger

  # Confidence level thresholds - updated for stricter device matching
  CONFIDENCE_HIGH = 85  # Increased from 80 to require stronger evidence
  CONFIDENCE_MEDIUM = 60  # Increased from 50 for better separation
  CONFIDENCE_LOW = 30

  def initialize(browser_key, session, logger, device_header = nil)
    @browser_key = browser_key
    @device_header = device_header
    @session = session
    @logger = logger

    # Log important debugging info
    if @device_header
      logger.debug "Device header provided: #{@device_header.to_s[0..40]}..."
    else
      logger.debug "No device header provided in constructor"
    end
  end

  # Main entry point for device recognition with enhanced cross-browser support
  def recognize_device
    logger.debug "========== RECOGNIZE DEVICE =========="
    logger.debug "Browser key: #{browser_key&.slice(0, 10)}..."
    
    # Log device header if available
    if device_header
      begin
        # Check if header is already JSON or needs parsing
        if device_header.is_a?(String)
          begin
            # Try to parse if it's a JSON string
            parsed_header = JSON.parse(device_header)
            logger.debug "Device header parsed successfully: deviceId=#{parsed_header['deviceId']&.slice(0, 10)}..., userHandle=#{parsed_header['userHandle']}"
            
            # ADDED: Log device characteristics keys
            if parsed_header['deviceCharacteristics']
              char_keys = parsed_header['deviceCharacteristics'].keys.join(', ')
              logger.debug "Device characteristics keys: #{char_keys}"
            else
              logger.debug "No device characteristics found in header"
            end
          rescue JSON::ParserError => e
            # If it's not valid JSON, log the error
            logger.error "Error parsing device header as JSON: #{e.message}"
            logger.error "Header string: #{device_header[0..50]}..."
          end
        else
          # If it's already an object, log that
          logger.debug "Device header is already a hash object"
          parsed_header = device_header
          
          # ADDED: Log device characteristics keys for hash object
          if parsed_header['deviceCharacteristics']
            char_keys = parsed_header['deviceCharacteristics'].keys.join(', ')
            logger.debug "Device characteristics keys: #{char_keys}"
          else
            logger.debug "No device characteristics found in header hash"
          end
        end
      rescue => e
        logger.error "Error processing device header: #{e.message}"
      end
    else
      logger.debug "No device header available for recognition"
    end
    
    # Skip if logged out
    if session[:logging_out]
      logger.debug "Logout state detected, skipping device recognition"
      return { status: 'logged_out' }
    end
    
    # First check for cache hit by browser key
    if browser_key && session[:last_device_check] && 
       Time.now.to_i - session[:last_device_check] < 300 && 
       session[:current_device_id] == browser_key
      
      logger.debug "CACHE HIT: Using cached device recognition result"
      if session[:device_session] == 'authenticated'
        return {
          status: 'authenticated',
          device_key: browser_key,
          handle: session[:current_handle],
          guid: session[:current_guid],
          phone: session[:current_phone],
          path: session[:device_path]
        }
      end
    end
    
    # 1. HIGHEST PRIORITY: Cross-browser recognition via device header
    if device_header
      logger.debug "Attempting device header recognition"
      header_match = find_device_by_header(device_header)
      
      if header_match
        logger.debug "Found match by device header: #{header_match[:handle]}"
        
        # Calculate confidence score for this match
        confidence_score = calculate_confidence_score(header_match, :header_match)
        confidence_level = get_confidence_level(confidence_score)
        logger.debug "Match confidence score: #{confidence_score}, level: #{confidence_level}"
        
        # Add confidence data to match result
        header_match[:confidence_score] = confidence_score
        header_match[:confidence_level] = confidence_level
        
        # ENHANCED SECURITY: Reject different physical devices immediately
        if device_header && header_match[:path] && !same_physical_device?(header_match[:path])
          logger.warn "SECURITY: Rejecting authentication from different physical device"
          return { 
            status: 'show_options',
            device_not_registered: true 
            # Don't include any user information
          }
        end
        
        # SECURITY: Check user boundaries - reject if user doesn't match
        if session[:current_handle] && session[:current_handle] != header_match[:handle]
          logger.warn "SECURITY: User boundary violation detected. Session user: #{session[:current_handle]}, Header user: #{header_match[:handle]}"
          
          # Always require verification for user boundary changes
          return {
            status: 'needs_quick_verification',
            device_key: header_match[:device_id],
            handle: header_match[:handle],
            guid: header_match[:guid],
            phone: header_match[:phone],
            masked_phone: mask_phone(header_match[:phone]),
            path: header_match[:path],
            cross_browser: true,
            security_verification: true,
            confidence_score: confidence_score,
            confidence_level: confidence_level
          }
        end
        
        # We have a valid match with proper security boundary
        # Update cache timestamp
        session[:last_device_check] = Time.now.to_i
        
        # This is a cross-browser scenario
        header_match[:cross_browser] = true
        
        # IMPROVED AUTO-LOGIN: Require both recent verification AND acceptable confidence
        if (recently_verified?(header_match[:last_verified_at]) && 
            confidence_level != 'low' && confidence_level != 'very_low') || 
           confidence_level == 'high'
          
          # Auto-login for cross-browser on same device
          logger.debug "Device has sufficient confidence for auto-login, returning authenticated status"
          logger.debug "Cross-browser auto-login enabled"
          
          # Add browser key to device if this is a new browser
          if browser_key && browser_key != header_match[:device_id]
            logger.debug "Adding browser key to cross-browser device"
            add_browser_key_to_device(header_match[:path], browser_key)
          end
          
          return {
            status: 'authenticated',
            device_key: header_match[:device_id],
            handle: header_match[:handle],
            guid: header_match[:guid],
            phone: header_match[:phone],
            path: header_match[:path],
            cross_browser: true,
            confidence_score: confidence_score,
            confidence_level: confidence_level
          }
        elsif confidence_level == 'medium' && has_pin?(header_match[:handle])
          # For medium confidence with PIN available, offer PIN verification
          logger.debug "Medium confidence with PIN available, offering PIN verification"
          
          # Add browser key as pending until verified
          if browser_key && browser_key != header_match[:device_id]
            logger.debug "Adding pending browser key to device for verification"
            add_browser_key_to_device(header_match[:path], browser_key, pending: true)
          end
          
          return {
            status: 'needs_pin_verification',
            device_key: header_match[:device_id],
            handle: header_match[:handle],
            guid: header_match[:guid],
            phone: header_match[:phone],
            masked_phone: mask_phone(header_match[:phone]),
            path: header_match[:path],
            cross_browser: true,
            confidence_score: confidence_score,
            confidence_level: confidence_level,
            pin_available: true
          }
        else
          # Device not recently verified or low confidence, require verification
          logger.debug "Device found but needs verification (confidence: #{confidence_level})"
          logger.debug "Cross-browser verification required"
          
          # Add browser key as pending until verified
          if browser_key && browser_key != header_match[:device_id]
            logger.debug "Adding pending browser key to device for verification"
            add_browser_key_to_device(header_match[:path], browser_key, pending: true)
          end
          
          return {
            status: 'needs_quick_verification',
            device_key: header_match[:device_id],
            handle: header_match[:handle],
            guid: header_match[:guid],
            phone: header_match[:phone],
            masked_phone: mask_phone(header_match[:phone]),
            path: header_match[:path],
            cross_browser: true,
            confidence_score: confidence_score,
            confidence_level: confidence_level,
            pin_available: has_pin?(header_match[:handle])
          }
        end
      end
    end
    
    # 2. Exact browser key match (same browser)
    if browser_key
      logger.debug "Trying to match by browser key: #{browser_key&.slice(0, 10)}..."
      exact_match = find_device_by_browser_key(browser_key)
      
      if exact_match
        logger.debug "Found exact browser key match: #{exact_match[:handle]}"
        
        # Calculate confidence score for this match
        confidence_score = calculate_confidence_score(exact_match, :exact_browser_match)
        confidence_level = get_confidence_level(confidence_score)
        logger.debug "Match confidence score: #{confidence_score}, level: #{confidence_level}"
        
        # Add confidence data to match result
        exact_match[:confidence_score] = confidence_score
        exact_match[:confidence_level] = confidence_level
        
        # Check for recent verification or high confidence
        if recently_verified?(exact_match[:last_verified_at]) || confidence_level == 'high'
          # Auto-login for same browser
          return {
            status: 'authenticated',
            device_key: browser_key,
            handle: exact_match[:handle],
            guid: exact_match[:guid],
            phone: exact_match[:phone],
            path: exact_match[:path],
            confidence_score: confidence_score,
            confidence_level: confidence_level
          }
        elsif confidence_level == 'medium' && has_pin?(exact_match[:handle])
          # For medium confidence with PIN available, offer PIN verification
          logger.debug "Medium confidence with PIN available, offering PIN verification"
          
          return {
            status: 'needs_pin_verification',
            device_key: browser_key,
            handle: exact_match[:handle],
            guid: exact_match[:guid],
            phone: exact_match[:phone],
            masked_phone: mask_phone(exact_match[:phone]),
            path: exact_match[:path],
            confidence_score: confidence_score,
            confidence_level: confidence_level,
            pin_available: true
          }
        else
          # Needs verification
          return {
            status: 'needs_quick_verification',
            device_key: browser_key,
            handle: exact_match[:handle],
            guid: exact_match[:guid],
            phone: exact_match[:phone],
            masked_phone: mask_phone(exact_match[:phone]),
            path: exact_match[:path],
            confidence_score: confidence_score,
            confidence_level: confidence_level,
            pin_available: has_pin?(exact_match[:handle])
          }
        end
      end
    end
    
    # 3. User context matching (fallback for backward compatibility)
    logger.debug "Trying to match by user context from session..."
    user_context_match = find_device_by_user_context
    if user_context_match
      logger.debug "Found user context match: #{user_context_match[:handle]}"
      
      # Calculate confidence score for this match
      confidence_score = calculate_confidence_score(user_context_match, :user_context_match)
      confidence_level = get_confidence_level(confidence_score)
      logger.debug "Match confidence score: #{confidence_score}, level: #{confidence_level}"
      
      # Add confidence data to match result
      user_context_match[:confidence_score] = confidence_score
      user_context_match[:confidence_level] = confidence_level
      
      if recently_verified?(user_context_match[:last_verified_at]) || confidence_level == 'high'
        # Auto-login
        return {
          status: 'authenticated',
          device_key: user_context_match[:device_id],
          handle: user_context_match[:handle],
          guid: user_context_match[:guid],
          phone: user_context_match[:phone],
          path: user_context_match[:path],
          confidence_score: confidence_score,
          confidence_level: confidence_level
        }
      elsif confidence_level == 'medium' && has_pin?(user_context_match[:handle])
        # For medium confidence with PIN available, offer PIN verification
        logger.debug "Medium confidence with PIN available, offering PIN verification"
        
        return {
          status: 'needs_pin_verification',
          device_key: user_context_match[:device_id],
          handle: user_context_match[:handle],
          guid: user_context_match[:guid],
          phone: user_context_match[:phone],
          masked_phone: mask_phone(user_context_match[:phone]),
          path: user_context_match[:path],
          confidence_score: confidence_score,
          confidence_level: confidence_level,
          pin_available: true
        }
      else
        # Needs verification
        return {
          status: 'needs_quick_verification',
          device_key: user_context_match[:device_id],
          handle: user_context_match[:handle],
          guid: user_context_match[:guid],
          phone: user_context_match[:phone],
          masked_phone: mask_phone(user_context_match[:phone]),
          path: user_context_match[:path],
          confidence_score: confidence_score,
          confidence_level: confidence_level,
          pin_available: has_pin?(user_context_match[:handle])
        }
      end
    end
    
    # No match found
    logger.debug "No registered device found using all matching methods"
    return { status: 'show_options', device_not_registered: true }
  end

  # Calculate device confidence score based on multiple signals
  # Returns a numeric confidence score (0-100)
  def calculate_confidence_score(match_data, match_type)
    logger.debug "========== CALCULATE CONFIDENCE SCORE =========="
    logger.debug "Match type: #{match_type}"
    
    # Start with base confidence based on match type
    base_score = case match_type
      when :exact_browser_match
        # Exact browser key matches are highest confidence
        90
      when :header_match
        # Header matches are high confidence by default
        70
      when :user_context_match
        # User context matches are medium confidence
        50
      else
        30
    end
    
    logger.debug "Base confidence score: #{base_score}"
    
    # Add points for verification recency
    if match_data[:last_verified_at] && Time.parse(match_data[:last_verified_at]) > 7.days.ago
      base_score += 15  # Recently verified device
      logger.debug "Adding 15 points for recent verification"
    end
    
    # Add points for multiple browsers for this device
    if match_data[:path]
      browser_count = count_browsers_for_device(match_data[:path])
      if browser_count > 1
        points = [browser_count * 5, 15].min # Max 15 points
        base_score += points
        logger.debug "Adding #{points} points for #{browser_count} known browsers"
      end
    end
    
    # Add points for matching characteristics
    if device_header && match_data[:path]
      matching_characteristics = count_matching_characteristics(match_data[:path])
      points = matching_characteristics * 2  # 2 points per matching characteristic
      base_score += points
      logger.debug "Adding #{points} points for #{matching_characteristics} matching characteristics"
    end
    
    # Subtract points for different MAC address or hardware identifier
    # This is the key change to differentiate physical devices
    if device_header && match_data[:path] && !same_physical_device?(match_data[:path])
      base_score -= 40  # Large penalty for different physical hardware
      logger.debug "Subtracting 40 points for different physical hardware"
    end
    
    # Factor: IP address match with history
    if match_data[:path] && request_ip
      ip_match = check_ip_history(match_data[:path], request_ip)
      if ip_match
        base_score += 10
        logger.debug "Adding 10 points for IP address match"
      end
    end
    
    # Calculate final score (cap at 100)
    final_score = [base_score, 100].min
    logger.debug "Final confidence score: #{final_score}"
    
    final_score
  end
  
  # ENHANCED: Improved physical device matching with browser-specific comparisons
  def same_physical_device?(device_path)
    logger.debug "========== CHECKING PHYSICAL DEVICE MATCH =========="
    return false unless device_header
    
    # Try to get unique hardware identifiers from both current device and stored device
    current_device_chars = parse_device_header_characteristics
    unless current_device_chars
      logger.debug "No device characteristics in current header"
      return false
    end
    
    # ADDED: Log all current device characteristics keys for debugging
    logger.debug "Current device characteristics keys: #{current_device_chars.keys.join(', ')}"
    
    # Get characteristics from the stored device
    stored_device_info = get_stored_device_characteristics(device_path)
    unless stored_device_info
      logger.debug "No stored device characteristics found"
      return false
    end
    
    # ADDED: Log all stored device characteristics keys for debugging
    logger.debug "Stored device characteristics keys: #{stored_device_info[:characteristics].keys.join(', ')}"
    
    stored_chars = stored_device_info[:characteristics]
    stored_browser = stored_device_info[:browser_family]
    
    # Detect current browser family
    current_browser = current_device_chars["browserFamily"] || "Unknown"
    
    # Log browser information
    logger.debug "Current browser: #{current_browser}, Stored browser: #{stored_browser}"
    
    # Use browser-specific comparisons when browsers differ
    if current_browser != stored_browser
      logger.debug "Using cross-browser hardware matching (#{current_browser} vs #{stored_browser})"
      return cross_browser_device_match?(current_device_chars, stored_chars, current_browser, stored_browser)
    else
      # Same browser - use standard comparison
      logger.debug "Using same-browser hardware matching"
      return standard_device_match?(current_device_chars, stored_chars)
    end
  end
  
  # Enhanced cross-browser device matching with improved scoring system
  def cross_browser_device_match?(current, stored, current_browser, stored_browser)
    # ADDED: Initialize score-based matching system
    total_score = 0
    max_possible_score = 0
    match_details = {}
    
    # Define browser pair for lookups
    browser_pair = [current_browser, stored_browser].sort.join('-')
    logger.debug "Cross-browser comparison for pair: #{browser_pair}"
    
    # ADDED: Detailed logging of available hardware identifiers
    hardware_identifiers = {
      cpu: current["cpuModel"] && stored["cpuModel"],
      gpu: current["webglRenderer"] && stored["webglRenderer"],
      canvas: current["canvasFingerprint"] && stored["canvasFingerprint"],
      webgl: current["webglFingerprint"] && stored["webglFingerprint"],
      memory: current["memorySize"] && stored["memorySize"],
      platform: current["platform"] && stored["platform"],
      pixel_ratio: current["devicePixelRatio"] && stored["devicePixelRatio"],
      screen_size: current["screenWidth"] && current["screenHeight"] && 
                  stored["screenWidth"] && stored["screenHeight"]
    }
    
    logger.debug "Available hardware identifiers: #{hardware_identifiers.select{|k,v| v}.keys.join(', ')}"
    
    # ----- PLATFORM MATCH (HIGH WEIGHT) -----
    # Platform is one of the most reliable cross-browser identifiers
    if current["platform"] && stored["platform"]
      max_possible_score += 60  # High weight
      platform_match = current["platform"] == stored["platform"]
      if platform_match
        total_score += 60
        match_details[:platform] = "Match: #{current["platform"]}"
      else
        match_details[:platform] = "No match: #{current["platform"]} vs #{stored["platform"]}"
      end
      logger.debug "Platform comparison: #{current["platform"]} vs #{stored["platform"]} - #{platform_match ? 'MATCH' : 'DIFFERENT'}"
    end
    
    # ----- TIMEZONE MATCH (MEDIUM WEIGHT) -----
    if current["timezone"] && stored["timezone"]
      max_possible_score += 20  # Medium weight
      timezone_match = current["timezone"] == stored["timezone"]
      if timezone_match
        total_score += 20
        match_details[:timezone] = "Match: #{current["timezone"]}"
      else
        match_details[:timezone] = "No match: #{current["timezone"]} vs #{stored["timezone"]}"
      end
      logger.debug "Timezone comparison: #{current["timezone"]} vs #{stored["timezone"]} - #{timezone_match ? 'MATCH' : 'DIFFERENT'}"
    end
    
    # ----- SCREEN DIMENSIONS MATCH (MEDIUM WEIGHT) -----
    if current["screenWidth"] && stored["screenWidth"] && 
       current["screenHeight"] && stored["screenHeight"]
      
      max_possible_score += 15  # Medium weight
      
      # Allow reasonable variation in screen dimensions for browser differences
      width_diff = (current["screenWidth"].to_i - stored["screenWidth"].to_i).abs
      height_diff = (current["screenHeight"].to_i - stored["screenHeight"].to_i).abs
      
      screen_match = width_diff <= 300 && height_diff <= 300
      
      # Calculate partial score based on how close dimensions are
      screen_score = 0
      if screen_match
        # Full match if very close
        if width_diff <= 100 && height_diff <= 100
          screen_score = 15
        else
          # Partial score for close match
          screen_score = 10
        end
        total_score += screen_score
        match_details[:screen] = "Match: #{current["screenWidth"]}x#{current["screenHeight"]} (diff: #{width_diff}x#{height_diff})"
      else
        match_details[:screen] = "No match: #{current["screenWidth"]}x#{current["screenHeight"]} vs #{stored["screenWidth"]}x#{stored["screenHeight"]}"
      end
      
      logger.debug "Screen dimensions: #{current["screenWidth"]}x#{current["screenHeight"]} vs #{stored["screenWidth"]}x#{stored["screenHeight"]} - Score: #{screen_score}/15"
    end
    
    # ----- DEVICE PIXEL RATIO (MEDIUM-LOW WEIGHT WITH BROWSER-SPECIFIC TOLERANCE) -----
    if current["devicePixelRatio"] && stored["devicePixelRatio"]
      max_possible_score += 10  # Medium-low weight
      
      # IMPROVED: Browser-specific tolerance for pixel ratio differences
      pixel_tolerance_map = {
        "Chrome-Safari" => 0.45,
        "Chrome-Firefox" => 0.3,
        "Chrome-Opera" => 0.25,
        "Chrome-Edge" => 0.2,
        "Firefox-Safari" => 0.5,
        "Firefox-Opera" => 0.3,
        "Firefox-Edge" => 0.3,
        "Safari-Opera" => 0.5,
        "Safari-Edge" => 0.5,
        "Opera-Edge" => 0.25,
        "default" => 0.2
      }
      
      tolerance = pixel_tolerance_map[browser_pair] || pixel_tolerance_map["default"]
      
      current_ratio = current["devicePixelRatio"].to_f
      stored_ratio = stored["devicePixelRatio"].to_f
      ratio_diff = (current_ratio - stored_ratio).abs
      
      pixel_ratio_match = ratio_diff < tolerance
      
      ratio_score = 0
      if pixel_ratio_match
        # Full or partial score based on how close the match is
        if ratio_diff < (tolerance / 2)
          ratio_score = 10
        else
          ratio_score = 5
        end
        total_score += ratio_score
        match_details[:pixel_ratio] = "Match: #{current_ratio} vs #{stored_ratio} (diff: #{ratio_diff}, tolerance: #{tolerance})"
      else
        match_details[:pixel_ratio] = "No match: #{current_ratio} vs #{stored_ratio} (diff: #{ratio_diff}, tolerance: #{tolerance})"
      end
      
      logger.debug "Device pixel ratio: #{current_ratio} vs #{stored_ratio} - diff: #{ratio_diff}, tolerance: #{tolerance} - Score: #{ratio_score}/10"
    end
    
    # ----- CPU MODEL COMPARISON (MEDIUM WEIGHT) -----
    if current["cpuModel"] && stored["cpuModel"]
      max_possible_score += 15  # Medium weight
      current_cpu = normalize_cpu_model(current["cpuModel"], current_browser)
      stored_cpu = normalize_cpu_model(stored["cpuModel"], stored_browser)
      
      cpu_match = cpu_models_match?(current_cpu, stored_cpu, current_browser, stored_browser)
      
      if cpu_match
        total_score += 15
        match_details[:cpu] = "Match: #{current_cpu} ~ #{stored_cpu}"
      else
        match_details[:cpu] = "No match: #{current_cpu} vs #{stored_cpu}"
      end
      
      logger.debug "CPU model comparison: #{current_cpu} vs #{stored_cpu} - #{cpu_match ? 'MATCH' : 'DIFFERENT'}"
    end
    
    # ----- GPU/WEBGL RENDERER COMPARISON (MEDIUM WEIGHT) -----
    if current["webglRenderer"] && stored["webglRenderer"]
      max_possible_score += 15  # Medium weight
      current_gpu = normalize_gpu_info(current["webglRenderer"], current_browser)
      stored_gpu = normalize_gpu_info(stored["webglRenderer"], stored_browser)
      
      gpu_match = gpu_info_matches?(current_gpu, stored_gpu, current_browser, stored_browser)
      
      if gpu_match
        total_score += 15
        match_details[:gpu] = "Match: #{current_gpu} ~ #{stored_gpu}"
      else
        match_details[:gpu] = "No match: #{current_gpu} vs #{stored_gpu}"
      end
      
      logger.debug "GPU/WebGL comparison: #{current_gpu} vs #{stored_gpu} - #{gpu_match ? 'MATCH' : 'DIFFERENT'}"
    end
    
    # ----- CANVAS FINGERPRINT COMPARISON (LOW-MEDIUM WEIGHT) -----
    if current["canvasFingerprint"] && stored["canvasFingerprint"]
      max_possible_score += 10  # Low-medium weight
      
      # Compare fingerprints with browser-specific tolerance
      canvas_match = compare_canvas_fingerprints(
        current["canvasFingerprint"], 
        stored["canvasFingerprint"],
        current_browser, 
        stored_browser
      )
      
      canvas_score = canvas_match ? 10 : 0
      total_score += canvas_score
      
      if canvas_match
        match_details[:canvas] = "Match: Fingerprints similar enough for #{browser_pair}"
      else
        match_details[:canvas] = "No match: Canvas fingerprints too different"
      end
      
      logger.debug "Canvas fingerprint comparison - #{canvas_match ? 'MATCH' : 'DIFFERENT'} - Score: #{canvas_score}/10"
    end
    
    # ----- WEBGL FINGERPRINT COMPARISON (LOW-MEDIUM WEIGHT) -----
    if current["webglFingerprint"] && stored["webglFingerprint"]
      max_possible_score += 10  # Low-medium weight
      
      webgl_match = compare_webgl_fingerprints(
        current["webglFingerprint"], 
        stored["webglFingerprint"],
        current_browser, 
        stored_browser
      )
      
      webgl_score = webgl_match ? 10 : 0
      total_score += webgl_score
      
      if webgl_match
        match_details[:webgl] = "Match: WebGL fingerprints similar enough for #{browser_pair}"
      else
        match_details[:webgl] = "No match: WebGL fingerprints too different"
      end
      
      logger.debug "WebGL fingerprint comparison - #{webgl_match ? 'MATCH' : 'DIFFERENT'} - Score: #{webgl_score}/10"
    end
    
    # ----- MEMORY SIZE COMPARISON (LOW WEIGHT) -----
    if current["memorySize"] && stored["memorySize"]
      max_possible_score += 5  # Low weight
      
      memory_match = compare_memory_sizes(
        current["memorySize"].to_f, 
        stored["memorySize"].to_f,
        current_browser, 
        stored_browser
      )
      
      memory_score = memory_match ? 5 : 0
      total_score += memory_score
      
      logger.debug "Memory size comparison: #{current["memorySize"]} vs #{stored["memorySize"]} - #{memory_match ? 'MATCH' : 'DIFFERENT'} - Score: #{memory_score}/5"
    end
    
    # Calculate final percentage score if we have any comparisons
    logger.debug "Match details: #{match_details.inspect}"
    
    if max_possible_score > 0
      percentage_score = (total_score.to_f / max_possible_score) * 100
      logger.debug "Cross-browser match score: #{total_score}/#{max_possible_score} (#{percentage_score.round(2)}%)"
      
      # Accept as match if score is at least 60%
      # OR if we have a strong platform match and at least one other strong hardware identifier
      strong_match = percentage_score >= 60.0
      
      # Special case: Platform match + at least one hardware identifier = likely same device
      platform_plus_hardware = match_details[:platform] && match_details[:platform].start_with?("Match:") &&
                              (match_details[:gpu]&.start_with?("Match:") || 
                               match_details[:cpu]&.start_with?("Match:") ||
                               match_details[:screen]&.start_with?("Match:"))
      
      result = strong_match || platform_plus_hardware
      
      if result
        logger.debug "MATCH ACCEPTED: Same physical device identified across different browsers"
        return true
      else
        logger.debug "MATCH REJECTED: Score too low for confident cross-browser match"
        return false
      end
    else
      logger.debug "No comparable characteristics found between browsers"
      return false
    end
  end
  
  # Standard device matching (same browser)
  def standard_device_match?(current, stored)
    # For same browser, we can use more strict matching
    hardware_matches = [
      cpu_model_matches?(current, stored),
      hardware_fingerprint_matches?(current, stored),
      canvas_fingerprint_matches?(current, stored),
      webgl_fingerprint_matches?(current, stored),
      memory_size_matches?(current, stored)
    ]
    
    # Log the hardware match results
    matches_count = hardware_matches.count(true)
    logger.debug "Hardware match check - #{matches_count} of #{hardware_matches.length} matches"
    
    # Require at least one hardware identifier to match for physical device match
    if matches_count > 0
      logger.debug "Same physical device identified"
      return true
    else
      logger.debug "Different physical device detected"
      return false
    end
  end
  
  # Browser-specific normalization methods
  
  # Normalize CPU model strings across browsers
  def normalize_cpu_model(cpu_string, browser)
    return nil unless cpu_string
    
    # ADDED: Log original CPU string
    logger.debug "Normalizing CPU model for #{browser}: '#{cpu_string}'"
    
    # Remove common decorators and standardize spacing
    normalized = cpu_string.gsub(/\(R\)|\(TM\)/, '')
                           .gsub(/CPU @.*/, '')
                           .gsub(/\s+/, ' ')
                           .strip
    
    # Browser-specific normalization
    case browser
    when "Safari"
      # Safari often reports abbreviated CPU models
      normalized = normalized.gsub(/^Intel /, '')
                            .gsub(/^AMD /, '')
      
      # For Apple Silicon, normalize M1/M2 reports
      if normalized.match?(/Apple/)
        if normalized.match?(/M1|M2|M3/)
          # Extract just the chip generation (M1, M2, etc)
          if match = normalized.match(/(M\d+)/)
            normalized = "Apple #{match[1]}"
          end
        end
      end
    when "Firefox"
      # Firefox sometimes includes extra info
      normalized = normalized.gsub(/ with.*$/, '')
                            .gsub(/\d+-Core /, '')
    when "Chrome", "Edge"
      # Chrome/Edge tend to include full model numbers
      # Extract model numbers (like i7-10750H)
      if model_match = normalized.match(/i\d+-\d+[A-Z0-9]*/)
        normalized = model_match[0]
      end
    end
    
    # ADDED: Log normalized CPU string
    logger.debug "Normalized CPU model: '#{normalized}'"
    
    normalized
  end
  
  # Compare CPU models with browser-specific tolerance
  def cpu_models_match?(cpu1, cpu2, browser1, browser2)
    return false unless cpu1 && cpu2
    
    # ADDED: Log CPU comparison
    logger.debug "Comparing CPU models: '#{cpu1}' vs '#{cpu2}', browsers: #{browser1} vs #{browser2}"
    
    # Simple case: exact match
    return true if cpu1 == cpu2
    
    # Special case for Apple Silicon
    if cpu1.include?("Apple") && cpu2.include?("Apple")
      # Match Apple Silicon generations (M1, M2, etc)
      apple1 = cpu1.match(/M\d+/)&.[](0)
      apple2 = cpu2.match(/M\d+/)&.[](0)
      if apple1 && apple2 && apple1 == apple2
        logger.debug "Matched Apple Silicon generation: #{apple1}"
        return true
      end
    end
    
    # Try to find similar patterns for Intel/AMD CPUs
    if cpu1.match?(/i\d+/) && cpu2.match?(/i\d+/)
      i_level1 = cpu1.match(/i(\d+)/)[1].to_i
      i_level2 = cpu2.match(/i(\d+)/)[1].to_i
      
      # Match CPU generation (e.g., i7 matches i7)
      if i_level1 == i_level2
        logger.debug "Matched Intel CPU generation: i#{i_level1}"
        return true
      end
    end
    
    # Check for substrings (Safari often reports abbreviated CPU model)
    if browser1 == 'Safari' || browser2 == 'Safari'
      if cpu1.include?(cpu2) || cpu2.include?(cpu1)
        logger.debug "CPU substring match across browsers (Safari involved)"
        return true
      end
    end
    
    logger.debug "CPU models don't match"
    false
  end
  
  # Normalize GPU information across browsers
  def normalize_gpu_info(renderer_string, browser)
    return nil unless renderer_string
    
    # ADDED: Log original GPU string
    logger.debug "Normalizing GPU info for #{browser}: '#{renderer_string}'"
    
    # Remove ANGLE wrapper from Chromium browsers
    if renderer_string.include?('ANGLE')
      # Extract the content inside parentheses
      if match = renderer_string.match(/ANGLE \((.*?)\)/)
        renderer_string = match[1]
      end
    end
    
    # Browser-specific normalization
    normalized = case browser
    when "Safari"
      # Safari has unique formatting for Apple GPUs
      if renderer_string.include?('Apple')
        # Extract Apple chip model
        if match = renderer_string.match(/(Apple M\d+\s?(?:Pro|Max|Ultra)?)/)
          match[1]
        else
          "Apple GPU"
        end
      else
        renderer_string
      end
      
    when "Firefox"
      # Firefox may include driver info
      renderer_string.gsub(/ \(.+\)$/, '')
                     .gsub(/\/PCIe\/SSE\d+$/, '')
                     .gsub(/\s+/, ' ')
                     .strip
      
    when "Chrome", "Edge", "Opera"
      # Handle ANGLE formatting
      if renderer_string.include?('ANGLE')
        renderer_string.gsub(/ANGLE \((.+)\)/) { $1 }
      else
        renderer_string
      end
      
    else
      # Default normalization
      renderer_string
    end
    
    # General normalization for all browsers
    
    # Handle Apple-specific naming
    if normalized.include?('Apple')
      # Extract Apple chip model
      if match = normalized.match(/(Apple M\d+\s?(?:Pro|Max|Ultra)?)/)
        normalized = match[1]
      end
    end
    
    # Handle NVIDIA naming
    if normalized.include?('NVIDIA') || normalized.include?('GeForce')
      # Extract model number
      if match = normalized.match(/((?:NVIDIA\s)?(?:GeForce\s)?(?:RTX|GTX)\s\d+\s?(?:Ti|Super)?)/)
        normalized = match[1].gsub(/\s+/, ' ').strip
      end
    end
    
    # Handle AMD naming
    if normalized.include?('AMD') || normalized.include?('Radeon')
      # Extract model number
      if match = normalized.match(/((?:AMD\s)?(?:Radeon\s)?(?:RX|HD)\s\d+\s?(?:XT|Pro)?)/)
        normalized = match[1].gsub(/\s+/, ' ').strip
      end
    end
    
    # Handle Intel integrated graphics
    if normalized.include?('Intel') && normalized.include?('Graphics')
      # Extract Intel graphics model
      if match = normalized.match(/(Intel\s+(?:HD|UHD|Iris|Xe)\s+Graphics\s+\d*)/)
        normalized = match[1].gsub(/\s+/, ' ').strip
      end
    end
    
    # ADDED: Log normalized GPU string
    logger.debug "Normalized GPU info: '#{normalized}'"
    
    # Fallback to original with standardized spacing
    normalized
  end
  
  # Compare GPU information with browser-specific tolerance
  def gpu_info_matches?(gpu1, gpu2, browser1, browser2)
    return false unless gpu1 && gpu2
    
    # ADDED: Log GPU comparison
    logger.debug "Comparing GPU info: '#{gpu1}' vs '#{gpu2}', browsers: #{browser1} vs #{browser2}"
    
    # Simple case: exact match
    if gpu1 == gpu2
      logger.debug "Exact GPU info match"
      return true
    end
    
    # For Apple devices, match Apple GPU regardless of specific model
    if gpu1.include?('Apple') && gpu2.include?('Apple')
      logger.debug "Apple GPU family match"
      return true
    end
    
    # For NVIDIA GPUs, check if the model numbers match
    if (gpu1.include?('NVIDIA') || gpu1.include?('GeForce')) && 
       (gpu2.include?('NVIDIA') || gpu2.include?('GeForce'))
      
      # Extract basic model numbers (e.g., "RTX 3080")
      model1 = gpu1.match(/(?:RTX|GTX)\s\d+/)&.[](0)
      model2 = gpu2.match(/(?:RTX|GTX)\s\d+/)&.[](0)
      
      if model1 && model2 && model1 == model2
        logger.debug "NVIDIA GPU model match: #{model1}"
        return true
      end
    end
    
    # For AMD GPUs, similar check
    if (gpu1.include?('AMD') || gpu1.include?('Radeon')) && 
       (gpu2.include?('AMD') || gpu2.include?('Radeon'))
      
      # Extract basic model numbers
      model1 = gpu1.match(/(?:RX|HD)\s\d+/)&.[](0)
      model2 = gpu2.match(/(?:RX|HD)\s\d+/)&.[](0)
      
      if model1 && model2 && model1 == model2
        logger.debug "AMD GPU model match: #{model1}"
        return true
      end
    end
    
    # For Intel integrated graphics
    if gpu1.include?('Intel') && gpu2.include?('Intel') &&
       gpu1.include?('Graphics') && gpu2.include?('Graphics')
      
      # If both are Intel integrated, they're likely the same if the generation is similar
      logger.debug "Intel integrated graphics match"
      return true
    end
    
    # Check for substrings between Safari and other browsers (Safari often abbreviates)
    if browser1 == 'Safari' || browser2 == 'Safari'
      if gpu1.include?(gpu2) || gpu2.include?(gpu1)
        logger.debug "GPU substring match (Safari involved)"
        return true
      end
    end
    
    logger.debug "GPU info doesn't match"
    false
  end
  
  # Compare canvas fingerprints with browser-specific tolerance
  def compare_canvas_fingerprints(fp1, fp2, browser1, browser2)
    return false unless fp1 && fp2
    
    # ADDED: Log canvas fingerprint comparison
    logger.debug "Comparing canvas fingerprints across browsers: #{browser1} vs #{browser2}"
    logger.debug "Canvas FP1: #{fp1.slice(0, 10)}..., FP2: #{fp2.slice(0, 10)}..."
    
    # Base threshold for similarity (0-100%)
    base_threshold = 85
    
    # Adjust threshold based on browser combinations
    threshold_adjustments = {
      'Chrome-Firefox' => -5,    # More lenient
      'Chrome-Safari' => -10,    # Even more lenient
      'Chrome-Edge' => -5,       # Fairly similar engines
      'Chrome-Opera' => -3,      # Very similar engines
      'Firefox-Safari' => -10,   # Very different engines
      'Firefox-Edge' => -7,      # Different engines
      'Firefox-Opera' => -7,     # Different engines
      'Safari-Edge' => -10,      # Very different engines
      'Safari-Opera' => -10,     # Very different engines
      'Edge-Opera' => -3,        # Similar Chromium engines
    }
    
    # Get browser pair key (normalized order)
    browser_pair = [browser1, browser2].sort.join('-')
    
    # Apply adjustment
    adjustment = threshold_adjustments[browser_pair] || 0
    threshold = base_threshold + adjustment
    
    # Compare fingerprints using similarity algorithm
    similarity_score = calculate_fingerprint_similarity(fp1, fp2)
    
    # Log similarity results
    logger.debug "Canvas fingerprint similarity: #{similarity_score.round(2)}%, threshold: #{threshold}% (base #{base_threshold}% with #{adjustment}% adjustment for #{browser_pair})"
    
    # Return true if similar enough based on adjusted threshold
    result = similarity_score >= threshold
    logger.debug "Canvas fingerprint match: #{result ? 'YES' : 'NO'}"
    result
  end
  
  # Compare memory sizes with browser-specific unit conversion
  def compare_memory_sizes(size1, size2, browser1, browser2)
    return false unless size1 && size2
    
    # ADDED: Log memory comparison
    logger.debug "Comparing memory sizes: #{size1} vs #{size2}, browsers: #{browser1} vs #{browser2}"
    
    # Convert to MB for comparison if needed (Firefox reports in MB, others in GB)
    normalized1 = browser1 == 'Firefox' ? size1 : size1 * 1024
    normalized2 = browser2 == 'Firefox' ? size2 : size2 * 1024
    
    # Log normalized values
    logger.debug "Normalized memory sizes (MB): #{normalized1} vs #{normalized2}"
    
    # Browser-specific tolerance adjustments
    tolerance_map = {
      'Chrome-Safari' => 1024,  # 1GB difference allowed
      'Chrome-Firefox' => 768,  # 0.75GB difference allowed
      'Chrome-Edge' => 512,     # 0.5GB difference allowed
      'Chrome-Opera' => 512,    # 0.5GB difference allowed
      'Firefox-Safari' => 1024, # 1GB difference allowed
      'Firefox-Edge' => 768,    # 0.75GB difference allowed
      'Firefox-Opera' => 768,   # 0.75GB difference allowed
      'Safari-Edge' => 1024,    # 1GB difference allowed
      'Safari-Opera' => 1024,   # 1GB difference allowed
      'Edge-Opera' => 512,      # 0.5GB difference allowed
      'default' => 768          # Default tolerance
    }
    
    # Get browser pair key (normalized order)
    browser_pair = [browser1, browser2].sort.join('-')
    
    # Apply browser-specific tolerance
    tolerance = tolerance_map[browser_pair] || tolerance_map['default']
    
    # Check if within acceptable range
    difference = (normalized1 - normalized2).abs
    result = difference <= tolerance
    
    logger.debug "Memory size difference: #{difference}MB, tolerance: #{tolerance}MB - #{result ? 'MATCH' : 'NO MATCH'}"
    
    result
  end
  
  # Compare WebGL fingerprints with browser-specific tolerance
  def compare_webgl_fingerprints(fp1, fp2, browser1, browser2)
    return false unless fp1 && fp2
    
    # ADDED: Log WebGL fingerprint comparison
    logger.debug "Comparing WebGL fingerprints across browsers: #{browser1} vs #{browser2}"
    logger.debug "WebGL FP1: #{fp1.slice(0, 10)}..., FP2: #{fp2.slice(0, 10)}..."
    
    # Use same logic as canvas fingerprints, but with different thresholds
    base_threshold = 80  # More lenient than canvas by default
    
    # Adjust threshold based on browser combinations
    threshold_adjustments = {
      'Chrome-Firefox' => -10,    # Very different WebGL implementations
      'Chrome-Safari' => -15,     # Extremely different WebGL implementations
      'Chrome-Edge' => -5,        # Similar but not identical
      'Chrome-Opera' => -3,       # Very similar engines
      'Firefox-Safari' => -15,    # Extremely different implementations
      'Firefox-Edge' => -10,      # Different implementations
      'Firefox-Opera' => -10,     # Different implementations
      'Safari-Edge' => -15,       # Very different implementations
      'Safari-Opera' => -15,      # Very different implementations
      'Edge-Opera' => -3,         # Similar Chromium engines
    }
    
    # Get browser pair key
    browser_pair = [browser1, browser2].sort.join('-')
    
    # Apply adjustment
    adjustment = threshold_adjustments[browser_pair] || 0
    threshold = base_threshold + adjustment
    
    # Compare fingerprints using similarity algorithm
    similarity_score = calculate_fingerprint_similarity(fp1, fp2)
    
    # Log similarity results
    logger.debug "WebGL fingerprint similarity: #{similarity_score.round(2)}%, threshold: #{threshold}% (base #{base_threshold}% with #{adjustment}% adjustment for #{browser_pair})"
    
    # Return true if similar enough based on adjusted threshold
    result = similarity_score >= threshold
    logger.debug "WebGL fingerprint match: #{result ? 'YES' : 'NO'}"
    result
  end
  
  # Calculate similarity between two fingerprint strings
  def calculate_fingerprint_similarity(fp1, fp2)
    # Basic implementation - could be replaced with a more sophisticated algorithm
    # For strings of different lengths, compare the shorter one
    min_length = [fp1.length, fp2.length].min
    
    # Count matching characters
    matches = 0
    min_length.times do |i|
      matches += 1 if fp1[i] == fp2[i]
    end
    
    # Return percentage match
    (matches.to_f / min_length) * 100
  end
  
  # Parse device characteristics from header with enhanced logging
  def parse_device_header_characteristics
    return nil unless device_header
    
    begin
      # ADDED: Log start of parsing
      logger.debug "Parsing device characteristics from header"
      
      parsed_header = device_header.is_a?(String) ? JSON.parse(device_header) : device_header
      
      if parsed_header['deviceCharacteristics']
        # ADDED: Log available characteristics
        char_count = parsed_header['deviceCharacteristics'].keys.count
        logger.debug "Found #{char_count} device characteristics"
        
        # Log hardware identifiers (first 10 chars for fingerprints)
        if parsed_header['deviceCharacteristics']['webglRenderer']
          logger.debug "Header has WebGL renderer: #{parsed_header['deviceCharacteristics']['webglRenderer'].to_s[0..40]}..."
        end
        
        if parsed_header['deviceCharacteristics']['cpuModel']
          logger.debug "Header has CPU model: #{parsed_header['deviceCharacteristics']['cpuModel']}"
        end
        
        if parsed_header['deviceCharacteristics']['canvasFingerprint']
          logger.debug "Header has canvas fingerprint: #{parsed_header['deviceCharacteristics']['canvasFingerprint'].to_s[0..10]}..."
        end
        
        if parsed_header['deviceCharacteristics']['webglFingerprint']
          logger.debug "Header has WebGL fingerprint: #{parsed_header['deviceCharacteristics']['webglFingerprint'].to_s[0..10]}..."
        end
        
        if parsed_header['deviceCharacteristics']['devicePixelRatio']
          logger.debug "Header has device pixel ratio: #{parsed_header['deviceCharacteristics']['devicePixelRatio']}"
        end
        
        return parsed_header['deviceCharacteristics']
      else
        logger.debug "No deviceCharacteristics found in parsed header"
        return nil
      end
    rescue => e
      logger.error "Error parsing device header characteristics: #{e.message}"
      return nil
    end
  end
  
  # Get stored characteristics from device database with enhanced logging
  def get_stored_device_characteristics(device_path)
    begin
      # ADDED: Log database retrieval attempt
      logger.debug "Retrieving stored device characteristics from: #{device_path}"
      
      db = SQLite3::Database.new(Rails.root.join('db', device_path))
      has_table = db.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='device_characteristics'").any? rescue false
      
      if has_table
        logger.debug "Found device_characteristics table in database"
        char_row = db.get_first_row("SELECT characteristics FROM device_characteristics LIMIT 1")
        
        if char_row && char_row[0]
          begin
            # Get the browser family as well if available
            browser_family = "Unknown"
            device_info = db.get_first_row("SELECT * FROM device_info LIMIT 1")
            
            if device_info
              characteristics = JSON.parse(char_row[0])
              
              # ADDED: Log retrieved characteristics info
              char_count = characteristics.keys.count
              logger.debug "Parsed stored characteristics JSON with #{char_count} fields"
              
              # Log hardware identifiers
              if characteristics["webglRenderer"]
                logger.debug "Stored WebGL renderer: #{characteristics["webglRenderer"].to_s[0..40]}..."
              end
              
              if characteristics["cpuModel"]
                logger.debug "Stored CPU model: #{characteristics["cpuModel"]}"
              end
              
              if characteristics["canvasFingerprint"]
                logger.debug "Stored canvas fingerprint: #{characteristics["canvasFingerprint"].to_s[0..10]}..."
              end
              
              browser_family = characteristics["browserFamily"] || "Unknown"
              logger.debug "Stored browser family: #{browser_family}"
              
              return {
                characteristics: characteristics,
                browser_family: browser_family
              }
            else
              logger.debug "No device_info record found"
            end
          rescue => e
            logger.error "Error parsing stored characteristics JSON: #{e.message}"
            return nil
          end
        else
          logger.debug "No characteristics record found in table"
        end
      else
        logger.debug "No device_characteristics table found in database"
      end
      
      db.close
      nil
    rescue => e
      logger.error "Error getting stored device characteristics: #{e.message}"
      nil
    end
  end
  
  # Legacy hardware matching methods (kept for backward compatibility)
  
  # Check specific hardware fingerprinting methods
  def cpu_model_matches?(current, stored)
    return false unless current["cpuModel"] && stored["cpuModel"]
    match = current["cpuModel"] == stored["cpuModel"]
    logger.debug "CPU model match: #{match} (#{current["cpuModel"]} vs #{stored["cpuModel"]})"
    match
  end
  
  def hardware_fingerprint_matches?(current, stored)
    return false unless current["hardwareFingerprint"] && stored["hardwareFingerprint"]
    match = current["hardwareFingerprint"] == stored["hardwareFingerprint"]
    logger.debug "Hardware fingerprint match: #{match}"
    match
  end
  
  def memory_size_matches?(current, stored)
    return false unless current["memorySize"] && stored["memorySize"]
    # Allow small variations in reported memory size (rounding differences)
    current_size = current["memorySize"].to_f
    stored_size = stored["memorySize"].to_f
    match = (current_size - stored_size).abs < 0.5
    logger.debug "Memory size match: #{match} (#{current_size} vs #{stored_size})"
    match
  end
  
  def canvas_fingerprint_matches?(current, stored)
    return false unless current["canvasFingerprint"] && stored["canvasFingerprint"]
    match = current["canvasFingerprint"] == stored["canvasFingerprint"]
    logger.debug "Canvas fingerprint match: #{match}"
    match
  end
  
  def webgl_fingerprint_matches?(current, stored)
    return false unless current["webglFingerprint"] && stored["webglFingerprint"]
    match = current["webglFingerprint"] == stored["webglFingerprint"]
    logger.debug "WebGL fingerprint match: #{match}"
    match
  end
  
  # Count matching characteristics between current and stored device
  def count_matching_characteristics(device_path)
    begin
      current_chars = parse_device_header_characteristics
      return 0 unless current_chars
      
      stored_device_info = get_stored_device_characteristics(device_path)
      return 0 unless stored_device_info
      
      stored_chars = stored_device_info[:characteristics]
      matches = 0
      
      # ADDED: Log characteristics matching
      logger.debug "Counting matching characteristics between devices"
      
      # Compare basic properties that should be consistent across browsers
      if current_chars['platform'] == stored_chars['platform']
        matches += 1
        logger.debug "Platform match: '#{current_chars['platform']}'"
      else
        logger.debug "Platform mismatch: '#{current_chars['platform']}' vs '#{stored_chars['platform']}'"
      end
      
      if current_chars['screenWidth'] == stored_chars['screenWidth'] && 
         current_chars['screenHeight'] == stored_chars['screenHeight']
        matches += 1
        logger.debug "Screen dimensions match: #{current_chars['screenWidth']}x#{current_chars['screenHeight']}"
      else
        logger.debug "Screen mismatch: #{current_chars['screenWidth']}x#{current_chars['screenHeight']} vs #{stored_chars['screenWidth']}x#{stored_chars['screenHeight']}"
      end
      
      if current_chars['timezone'] == stored_chars['timezone']
        matches += 1
        logger.debug "Timezone match: '#{current_chars['timezone']}'"
      else
        logger.debug "Timezone mismatch: '#{current_chars['timezone']}' vs '#{stored_chars['timezone']}'"
      end
      
      if current_chars['language'] == stored_chars['language']
        matches += 1
        logger.debug "Language match: '#{current_chars['language']}'"
      else
        logger.debug "Language mismatch: '#{current_chars['language']}' vs '#{stored_chars['language']}'"
      end
      
      # More lenient pixel ratio comparison
      if current_chars['devicePixelRatio'] && stored_chars['devicePixelRatio']
        ratio_diff = (current_chars['devicePixelRatio'].to_f - stored_chars['devicePixelRatio'].to_f).abs
        if ratio_diff < 0.5 # IMPROVED: More lenient tolerance for pixel ratio
          matches += 1
          logger.debug "Device pixel ratio match: #{current_chars['devicePixelRatio']} vs #{stored_chars['devicePixelRatio']} (diff: #{ratio_diff})"
        else
          logger.debug "Device pixel ratio mismatch: #{current_chars['devicePixelRatio']} vs #{stored_chars['devicePixelRatio']} (diff: #{ratio_diff})"
        end
      end
      
      # Browser family check - should be different for cross-browser scenarios
      # but we include it for completeness
      if current_chars['browserFamily'] == stored_chars['browserFamily']
        matches += 1
        logger.debug "Browser family match: '#{current_chars['browserFamily']}'"
      else
        logger.debug "Different browser families: '#{current_chars['browserFamily']}' vs '#{stored_chars['browserFamily']}'"
      end
      
      logger.debug "Found #{matches} matching characteristics"
      matches
    rescue => e
      logger.error "Error counting matching characteristics: #{e.message}"
      return 0
    end
  end
  
  # Get confidence level from numeric score
  def get_confidence_level(score)
    if score >= CONFIDENCE_HIGH  # Increased from 80 to 85
      'high'
    elsif score >= CONFIDENCE_MEDIUM  # Increased from 50 to 60
      'medium'
    elsif score >= CONFIDENCE_LOW
      'low'
    else
      'very_low'
    end
  end
  
  # Count how many browsers are registered to this device
  def count_browsers_for_device(device_path)
    begin
      db = SQLite3::Database.new(Rails.root.join('db', device_path))
      
      # Check if browser_keys table exists
      has_browser_keys = db.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='browser_keys'").any? rescue false
      
      if has_browser_keys
        count = db.get_first_value("SELECT COUNT(*) FROM browser_keys WHERE pending = 0") || 0
        db.close
        return count
      end
      
      db.close
      return 1 # Default to 1 if no browser_keys table
    rescue => e
      logger.error "Error counting browsers: #{e.message}"
      return 1
    end
  end
  
  # Check if user's IP matches historical IPs for this device
  def check_ip_history(device_path, current_ip)
    return false unless current_ip
    
    begin
      db = SQLite3::Database.new(Rails.root.join('db', device_path))
      
      # Check if ip_log table exists
      has_ip_log = db.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='ip_log'").any? rescue false
      
      if has_ip_log
        ip_match = db.execute("SELECT 1 FROM ip_log WHERE ip = ? LIMIT 1", [current_ip]).any?
        db.close
        return ip_match
      end
      
      db.close
      return false
    rescue => e
      logger.error "Error checking IP history: #{e.message}"
      return false
    end
  end
  
  # Get current request IP (if available)
  def request_ip
    if defined?(request) && request.respond_to?(:remote_ip)
      request.remote_ip
    elsif session[:request] && session[:request].respond_to?(:remote_ip)
      session[:request].remote_ip
    else
      nil
    end
  end

  # Check if a user has a PIN set
  def has_pin?(handle)
    return false unless handle
    
    begin
      user = User.find_by(handle: handle)
      return user && user.pin_hash.present?
    rescue => e
      logger.error "Error checking PIN status: #{e.message}"
      return false
    end
  end

  # Find device by device header (for cross-browser recognition)
  def find_device_by_header(header_data)
    logger.debug "========== FIND DEVICE BY HEADER =========="
    
    # Handle different input formats
    if header_data.is_a?(String)
      begin
        # Try to parse it as JSON first
        parsed_header = JSON.parse(header_data)
        logger.debug "Successfully parsed header string as JSON"
      rescue JSON::ParserError => e
        logger.error "Failed to parse header as JSON: #{e.message}"
        logger.error "Header data: #{header_data[0..50]}..."
        return nil
      rescue => e
        logger.error "Unexpected error parsing header: #{e.message}"
        return nil
      end
    elsif header_data.is_a?(Hash)
      # Already a hash
      parsed_header = header_data
      logger.debug "Header is already a hash object"
    else
      logger.error "Unknown header data type: #{header_data.class.name}"
      return nil
    end
    
    # Extract the essential components
    device_id = parsed_header['deviceId']
    user_guid = parsed_header['userGuid']
    user_handle = parsed_header['userHandle']
    device_characteristics = parsed_header['deviceCharacteristics']
    
    logger.debug "Parsed header data: ID=#{device_id&.slice(0, 10)}..., GUID=#{user_guid}, Handle=#{user_handle}"
    logger.debug "Device characteristics available: #{device_characteristics ? 'Yes' : 'No'}"
    
    # ADDED: Log device characteristics if available
    if device_characteristics
      logger.debug "Device characteristics keys: #{device_characteristics.keys.join(', ')}"
    end
    
    # MODIFIED: Only require device_id - allow missing guid/handle if we have characteristics
    if !device_id
      logger.warn "Invalid device header: missing deviceId"
      return nil
    end
    
    # First try to find by device ID
    device_match = find_device_by_id(device_id)
    
    if device_match
      # If we found a match by device ID and have a user_guid,
      # verify this device is associated with the claimed user
      if user_guid && device_match[:guid] != user_guid
        # Security concern: device ID found but associated with different user
        logger.warn "SECURITY: Device ID found but associated with different user. Header user: #{user_guid}, DB user: #{device_match[:guid]}"
        return nil
      end
      
      # Store device characteristics if they're provided
      if device_characteristics && device_match[:path]
        update_device_characteristics(device_match[:path], device_characteristics)
      end
      
      logger.debug "Found matching device with ID"
      return device_match
    end
    
    # If we have a user_guid, try to find any device for this user
    if user_guid
      user_devices = find_devices_for_user(user_guid)
      
      if user_devices.any?
        # Return the most recently verified device for this user
        most_recent = user_devices.max_by do |d|
          Time.parse(d[:last_verified_at] || "2000-01-01") rescue Time.parse("2000-01-01")
        end
        
        logger.debug "Found device for user via GUID: #{most_recent[:handle]}"
        
        # Store device characteristics if they're provided
        if device_characteristics && most_recent[:path]
          update_device_characteristics(most_recent[:path], device_characteristics)
        end
        
        return most_recent
      end
    end
    
    # If we have a handle, try to find by handle
    if user_handle
      handle_devices = find_devices_by_handle(user_handle)
      
      if handle_devices.any?
        most_recent = handle_devices.max_by do |d|
          Time.parse(d[:last_verified_at] || "2000-01-01") rescue Time.parse("2000-01-01")
        end
        
        logger.debug "Found device for user via handle: #{user_handle}"
        
        # Store device characteristics if they're provided
        if device_characteristics && most_recent[:path]
          update_device_characteristics(most_recent[:path], device_characteristics)
        end
        
        return most_recent
      end
    end
    
    # If we have device characteristics, try to find by characteristics
    if device_characteristics
      logger.debug "Attempting to match device by characteristics"
      
      # Get current user context for security boundary check
      current_handle = session[:current_handle]
      current_guid = session[:current_guid]
      
      # Scan all device databases
      Dir.glob(Rails.root.join('db', 'devices', '*.sqlite3')).each do |db_path|
        begin
          db = SQLite3::Database.new(db_path)
          
          # Check if device_characteristics table exists
          has_characteristics = db.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='device_characteristics'").any? rescue false
          
          if has_characteristics
            # Get the stored characteristics
            stored_json = db.get_first_value("SELECT characteristics FROM device_characteristics LIMIT 1")
            
            if stored_json
              # Get basic device info for this database
              device_info = db.get_first_row("SELECT device_id, handle, guid, phone, last_verified_at FROM device_info LIMIT 1")
              
              # Skip if no device info
              unless device_info
                db.close
                next
              end
              
              # SECURITY: If we have a user context in session, only match with same user
              if current_handle && device_info[1] && current_handle != device_info[1]
                logger.debug "Skipping device due to user mismatch"
                db.close
                next
              end
              
              if current_guid && device_info[2] && current_guid != device_info[2]
                logger.debug "Skipping device due to GUID mismatch"
                db.close
                next
              end
              
              # Parse stored characteristics
              begin
                stored_characteristics = JSON.parse(stored_json)
                
                # ADDED: Log stored characteristics keys
                logger.debug "Stored characteristics keys: #{stored_characteristics.keys.join(', ')}"
                
                # Create a device match object for checking
                potential_match = {
                  device_id: device_info[0],
                  handle: device_info[1],
                  guid: device_info[2],
                  phone: device_info[3],
                  last_verified_at: device_info[4],
                  path: db_path.split('db/').last,
                  device_characteristics: stored_json,
                  characteristic_match: true
                }
                
                # Get stored browser family
                stored_browser = stored_characteristics["browserFamily"] || "Unknown"
                current_browser = device_characteristics["browserFamily"] || "Unknown"
                
                # Enhanced cross-browser check
                if current_browser != stored_browser
                  # Cross-browser device matching
                  if cross_browser_device_match?(device_characteristics, stored_characteristics, current_browser, stored_browser)
                    logger.debug "Found device match by characteristics with cross-browser matching: #{device_info[1]}"
                    db.close
                    return potential_match
                  end
                else
                  # Same browser - standard check
                  if standard_device_match?(device_characteristics, stored_characteristics)
                    logger.debug "Found device match by characteristics with same browser: #{device_info[1]}"
                    db.close
                    return potential_match
                  end
                end
                
                # Compare the characteristics as fallback - look for strong matches
                # Platform match
                platform_match = device_characteristics['platform'] == stored_characteristics['platform']
                
                # Timezone match (important for physical location)
                timezone_match = device_characteristics['timezone'] == stored_characteristics['timezone']
                
                # Screen resolution similarity (allow some difference for window size)
                screen_match = 
                  (device_characteristics['screenWidth'].to_i - stored_characteristics['screenWidth'].to_i).abs <= 300 &&
                  (device_characteristics['screenHeight'].to_i - stored_characteristics['screenHeight'].to_i).abs <= 300
                
                # ENHANCED: Require more confident matching including user identity verification
                # Only allow matching by generic characteristics when:
                # 1. We already know the user handle AND
                # 2. The basic platform/timezone/screen checks pass
                if device_info[1].present? && platform_match && timezone_match && screen_match
                  logger.debug "Found device match by characteristics with user verification: #{device_info[1]}"
                  db.close
                  
                  # Log that this is a limited confidence match
                  logger.warn "SECURITY: Device matched by generic characteristics only - will require higher verification"
                  potential_match[:generic_match_only] = true
                  
                  return potential_match
                end
              rescue => e
                logger.error "Error comparing characteristics for #{db_path}: #{e.message}"
              end
            end
          end
          
          db.close
        rescue => e
          logger.error "Error checking characteristics in #{db_path}: #{e.message}"
        end
      end
    end
    
    logger.debug "No device match found for header"
    nil
  end
  
  # Find device by exact device ID
  def find_device_by_id(device_id)
    return nil unless device_id
    
    logger.debug "Looking for exact device ID: #{device_id&.slice(0, 10)}..."
    
    # Get current user context for security boundary check
    current_handle = session[:current_handle]
    current_guid = session[:current_guid]
    
    Dir.glob(Rails.root.join('db', 'devices', '*.sqlite3')).each do |db_path|
      begin
        db = SQLite3::Database.new(db_path)
        device_info = db.get_first_row("SELECT device_id, handle, guid, phone, last_verified_at FROM device_info LIMIT 1")
        
        # Get device characteristics if available
        device_characteristics = get_device_characteristics(db)
        
        db.close
        
        if device_info && device_info[0] == device_id
          # Found matching device ID
          result = {
            device_id: device_info[0],
            handle: device_info[1],
            guid: device_info[2],
            phone: device_info[3],
            last_verified_at: device_info[4],
            path: db_path.split('db/').last,
            device_characteristics: device_characteristics
          }
          
          # SECURITY: If we have a user context in session, only match with same user
          if current_handle && device_info[1] && current_handle != device_info[1]
            logger.warn "SECURITY: User context mismatch. Session user: #{current_handle}, Device user: #{device_info[1]}"
            # Skip this device - it belongs to a different user
            next
          end
          
          if current_guid && device_info[2] && current_guid != device_info[2]
            logger.warn "SECURITY: GUID mismatch. Session GUID: #{current_guid}, Device GUID: #{device_info[2]}"
            # Skip this device - it belongs to a different user
            next
          end
          
          return result
        end
      rescue => e
        logger.error "Error checking device ID in #{db_path}: #{e.message}"
      end
    end
    
    nil
  end

  # Find device by browser key (exact match)
  def find_device_by_browser_key(browser_key)
    return nil unless browser_key
    
    logger.debug "========== FIND DEVICE BY BROWSER KEY =========="
    logger.debug "Looking for browser key: #{browser_key&.slice(0, 10)}..."
    
    # Get current user context for security boundary check
    current_handle = session[:current_handle]
    current_guid = session[:current_guid]
    
    # Fast path: Check the browser_keys table for each device
    Dir.glob(Rails.root.join('db', 'devices', '*.sqlite3')).each do |db_path|
      begin
        db = SQLite3::Database.new(db_path)
        
        # First check if browser_keys table exists
        has_browser_keys = db.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='browser_keys'").any? rescue false
        
        if has_browser_keys
          # Check for this browser key
          browser_match = db.execute("SELECT 1 FROM browser_keys WHERE browser_id = ? LIMIT 1", [browser_key]).any?
          
          if browser_match
            # Update last_used timestamp
            db.execute("UPDATE browser_keys SET last_used = ? WHERE browser_id = ?",
              [Time.current.iso8601, browser_key])
            
            # Get device info
            device_info = db.get_first_row(
              "SELECT device_id, handle, guid, phone, last_verified_at FROM device_info LIMIT 1"
            )
            
            # Get device characteristics if available
            device_characteristics = get_device_characteristics(db)
            
            if device_info && device_info[1] # Has handle
              # SECURITY: If we have a user context in session, only match with same user
              if current_handle && device_info[1] && current_handle != device_info[1]
                logger.warn "SECURITY: User context mismatch. Session user: #{current_handle}, Device user: #{device_info[1]}"
                # Skip this device - it belongs to a different user
                next
              end
              
              if current_guid && device_info[2] && current_guid != device_info[2]
                logger.warn "SECURITY: GUID mismatch. Session GUID: #{current_guid}, Device GUID: #{device_info[2]}"
                # Skip this device - it belongs to a different user
                next
              end
              
              db.close
              
              return {
                device_id: device_info[0],
                handle: device_info[1],
                guid: device_info[2],
                phone: device_info[3],
                last_verified_at: device_info[4],
                path: db_path.split('db/').last,
                match_type: 'exact_browser_key',
                device_characteristics: device_characteristics
              }
            end
          end
        end
        
        # Legacy fallback: Check device_info for older database schema
        device_info = db.get_first_row(
          "SELECT device_id, handle, guid, phone, last_verified_at FROM device_info WHERE device_id = ? LIMIT 1",
          [browser_key]
        )
        
        if device_info && device_info[1] # Has handle
          # SECURITY: If we have a user context in session, only match with same user
          if current_handle && device_info[1] && current_handle != device_info[1]
            logger.warn "SECURITY: User context mismatch. Session user: #{current_handle}, Device user: #{device_info[1]}"
            # Skip this device - it belongs to a different user
            db.close
            next
          end
          
          if current_guid && device_info[2] && current_guid != device_info[2]
            logger.warn "SECURITY: GUID mismatch. Session GUID: #{current_guid}, Device GUID: #{device_info[2]}"
            # Skip this device - it belongs to a different user
            db.close
            next
          end
          
          # Get device characteristics if available
          device_characteristics = get_device_characteristics(db)
          
          db.close
          
          return {
            device_id: device_info[0],
            handle: device_info[1],
            guid: device_info[2],
            phone: device_info[3],
            last_verified_at: device_info[4],
            path: db_path.split('db/').last,
            match_type: 'legacy_device_id',
            device_characteristics: device_characteristics
          }
        end
        
        db.close
      rescue SQLite3::Exception => e
        logger.error "Error checking browser key: #{e.message}"
      end
    end
    
    logger.debug "No browser key match found"
    nil
  end

  # Get device characteristics from database
  def get_device_characteristics(db)
    begin
      # Check if device_characteristics table exists
      has_characteristics = db.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='device_characteristics'").any? rescue false
      
      if has_characteristics
        row = db.get_first_row("SELECT characteristics FROM device_characteristics LIMIT 1")
        if row && row[0]
          return row[0]
        end
      end
      
      nil
    rescue => e
      logger.error "Error getting device characteristics: #{e.message}"
      nil
    end
  end
  
  # Update device characteristics in database with enhanced logging
  def update_device_characteristics(device_path, characteristics)
    begin
      # ADDED: Log update attempt
      logger.debug "Updating device characteristics in database: #{device_path}"
      
      db = SQLite3::Database.new(Rails.root.join('db', device_path))
      
      # Check if device_characteristics table exists
      has_characteristics = db.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='device_characteristics'").any? rescue false
      
      unless has_characteristics
        # Create table if it doesn't exist
        logger.debug "Creating device_characteristics table"
        db.execute("CREATE TABLE device_characteristics (id INTEGER PRIMARY KEY, characteristics TEXT)")
      end
      
      # Convert to JSON if it's a hash
      if characteristics.is_a?(Hash)
        # ADDED: Log characteristics keys before storing
        logger.debug "Storing characteristics with keys: #{characteristics.keys.join(', ')}"
        characteristics_json = characteristics.to_json
      else
        logger.debug "Characteristics is not a hash, storing as-is"
        characteristics_json = characteristics
      end
      
      # Check if record exists
      has_record = db.execute("SELECT 1 FROM device_characteristics LIMIT 1").any? rescue false
      
      if has_record
        # Update existing record
        db.execute("UPDATE device_characteristics SET characteristics = ?", [characteristics_json])
        logger.debug "Updated existing device characteristics record"
      else
        # Insert new record
        db.execute("INSERT INTO device_characteristics (characteristics) VALUES (?)", [characteristics_json])
        logger.debug "Created new device characteristics record"
      end
      
      db.close
      logger.debug "Updated device characteristics successfully"
      true
    rescue => e
      logger.error "Error updating device characteristics: #{e.message}"
      false
    end
  end

  # Find all devices for a specific user by GUID
  def find_devices_for_user(user_guid)
    return [] unless user_guid
    
    logger.debug "Looking for devices for user GUID: #{user_guid}"
    
    devices = []
    
    Dir.glob(Rails.root.join('db', 'devices', '*.sqlite3')).each do |db_path|
      begin
        db = SQLite3::Database.new(db_path)
        device_info = db.get_first_row("SELECT device_id, handle, guid, phone, last_verified_at FROM device_info WHERE guid = ? LIMIT 1", [user_guid])
        
        # Get device characteristics if available
        device_characteristics = get_device_characteristics(db)
        
        db.close
        
        if device_info
          devices << {
            device_id: device_info[0],
            handle: device_info[1],
            guid: device_info[2],
            phone: device_info[3],
            last_verified_at: device_info[4],
            path: db_path.split('db/').last,
            device_characteristics: device_characteristics
          }
        end
      rescue => e
        logger.error "Error checking device for user in #{db_path}: #{e.message}"
      end
    end
    
    logger.debug "Found #{devices.count} devices for user #{user_guid}"
    devices
  end
  
  # Find devices by handle
  def find_devices_by_handle(handle)
    return [] unless handle
    
    logger.debug "Looking for devices with handle: #{handle}"
    
    devices = []
    
    Dir.glob(Rails.root.join('db', 'devices', '*.sqlite3')).each do |db_path|
      begin
        db = SQLite3::Database.new(db_path)
        device_info = db.get_first_row("SELECT device_id, handle, guid, phone, last_verified_at FROM device_info WHERE handle = ? LIMIT 1", [handle])
        
        # Get device characteristics if available
        device_characteristics = get_device_characteristics(db)
        
        db.close
        
        if device_info
          devices << {
            device_id: device_info[0],
            handle: device_info[1],
            guid: device_info[2],
            phone: device_info[3],
            last_verified_at: device_info[4],
            path: db_path.split('db/').last,
            device_characteristics: device_characteristics
          }
        end
      rescue => e
        logger.error "Error checking device for handle in #{db_path}: #{e.message}"
      end
    end
    
    logger.debug "Found #{devices.count} devices for handle #{handle}"
    devices
  end

  # Find device by session context for backward compatibility
  def find_device_by_user_context
    logger.debug "========== FIND DEVICE BY USER CONTEXT =========="
    
    # Extract session identifiers
    session_guid = session[:current_guid]
    session_handle = session[:current_handle]
    session_phone = session[:current_phone] || session[:verification_phone]
    previous_handle = session[:previous_handle]
    previous_guid = session[:previous_guid]
    previous_phone = session[:previous_phone]
    
    return nil unless session_guid || session_handle || session_phone || 
                     previous_handle || previous_guid || previous_phone
    
    logger.debug "Looking for devices matching user context"
    logger.debug "GUID: #{session_guid || previous_guid}"
    logger.debug "Handle: #{session_handle || previous_handle}"
    logger.debug "Phone: #{session_phone || previous_phone}"
    
    # Find devices with handles
    devices_with_handles = []
    Dir.glob(Rails.root.join('db', 'devices', '*.sqlite3')).each do |db_path|
      begin
        device_info = get_device_info(db_path)
        next unless device_info && device_info[:handle].present?
        
        # Add path to device info
        device_info[:path] = db_path.split('db/').last
        devices_with_handles << device_info
      rescue SQLite3::Exception => e
        logger.error "Error reading device database #{db_path}: #{e.message}"
        next
      end
    end
    
    # Find matches based on guid/handle/phone
    matched_devices = devices_with_handles.select do |device|
      (session_guid && device[:guid] == session_guid) ||
      (session_handle && device[:handle] == session_handle) ||
      (session_phone && device[:phone] == session_phone) ||
      (previous_guid && device[:guid] == previous_guid) ||
      (previous_handle && device[:handle] == previous_handle) ||
      (previous_phone && device[:phone] == previous_phone)
    end
    
    # Get the most recently verified device for this user
    if matched_devices.any?
      device = matched_devices.max_by do |d|
        Time.parse(d[:last_verified_at] || "2000-01-01") rescue Time.parse("2000-01-01")
      end
      
      logger.debug "Found device by user context: #{device[:handle]}"
      return device
    end
    
    logger.debug "No devices found matching user context"
    nil
  end

  # Add browser key to device
  def add_browser_key_to_device(device_path, browser_key, options = {})
    pending = options[:pending] || false
    return unless device_path && browser_key
    
    logger.debug "========== ADD BROWSER KEY TO DEVICE =========="
    logger.debug "Adding browser key #{browser_key.slice(0, 10)}... to device #{device_path}"
    
    begin
      db = SQLite3::Database.new(Rails.root.join('db', device_path))
      
      # Ensure browser_keys table exists
      begin
        db.execute("CREATE TABLE IF NOT EXISTS browser_keys (
          browser_id TEXT PRIMARY KEY,
          browser_name TEXT,
          user_agent TEXT,
          added_at TEXT,
          last_used TEXT,
          pending BOOLEAN
        )")
      rescue SQLite3::Exception => e
        logger.error "Error creating browser_keys table: #{e.message}"
      end
      
      # Get user agent from session or request
      user_agent = nil
      if defined?(request) && request.respond_to?(:user_agent)
        user_agent = request.user_agent
      elsif session[:request] && session[:request].headers && session[:request].headers['HTTP_USER_AGENT']
        user_agent = session[:request].headers['HTTP_USER_AGENT']
      else
        user_agent = 'Unknown'
      end
      
      # Detect browser
      browser_name = detect_browser(user_agent)
      
      # Add or update browser key
      begin
        # Check if browser key already exists
        existing = db.execute("SELECT browser_id FROM browser_keys WHERE browser_id = ?", [browser_key]).any?
        
        if existing
          # Update last_used timestamp
          db.execute(
            "UPDATE browser_keys SET last_used = ?, pending = ? WHERE browser_id = ?",
            [Time.current.iso8601, pending ? 1 : 0, browser_key]
          )
          logger.debug "Updated existing browser key"
        else
          # Add new browser key
          db.execute(
            "INSERT INTO browser_keys (browser_id, browser_name, user_agent, added_at, last_used, pending) VALUES (?, ?, ?, ?, ?, ?)",
            [browser_key, browser_name, user_agent, Time.current.iso8601, Time.current.iso8601, pending ? 1 : 0]
          )
          logger.debug "Added new browser key to device"
        end
      rescue SQLite3::Exception => e
        logger.error "Error adding browser key: #{e.message}"
      end
      
      # Update sync state
      begin
        db.execute(
          "INSERT INTO sync_state (last_sync, status) VALUES (?, ?)",
          [Time.current.iso8601, pending ? 'browser_key_pending' : 'browser_key_added']
        )
      rescue SQLite3::Exception => e
        logger.error "Error updating sync state: #{e.message}"
      end
      
      db.close
      
      logger.debug "Browser key added successfully"
      true
    rescue StandardError => e
      logger.error "Error adding browser key to device: #{e.message}"
      false
    end
  end

  # Confirm pending browser keys after verification
  def confirm_pending_identifiers(device_path)
    return unless device_path
    
    logger.debug "========== CONFIRM PENDING IDENTIFIERS =========="
    logger.debug "Confirming pending identifiers for device: #{device_path}"
    
    begin
      db = SQLite3::Database.new(Rails.root.join('db', device_path))
      
      # Confirm pending browser keys
      db.execute(
        "UPDATE browser_keys SET pending = 0 WHERE pending = 1"
      )
      
      # Update sync state
      db.execute(
        "INSERT INTO sync_state (last_sync, status) VALUES (?, ?)",
        [Time.current.iso8601, 'pending_identifiers_confirmed']
      )
      
      db.close
      
      logger.debug "Pending identifiers confirmed successfully"
      true
    rescue StandardError => e
      logger.error "Error confirming pending identifiers: #{e.message}"
      false
    end
  end

# Fast authentication for high-confidence scenarios
def fast_authenticate(identifier)
  logger.debug "========== FAST AUTHENTICATE =========="
  logger.debug "Fast authentication attempt for: #{identifier}"
  
  # Make sure we have a device key
  unless browser_key
    logger.debug "No browser key available for fast authentication"
    return { status: 'verification_needed' }
  end
  
  # First try to find the user
  user = nil
  if identifier.start_with?('@')
    user = User.find_by(handle: identifier)
    logger.debug "Looking up by handle: #{identifier}, found: #{user.present?}"
  else
    begin
      normalized_phone = normalize_phone(identifier)
      user = User.find_by(phone: normalized_phone)
      logger.debug "Looking up by phone: #{normalized_phone}, found: #{user.present?}"
    rescue StandardError => e
      logger.error "Phone normalization error: #{e.message}"
      return { error: e.message, status: 'error' }
    end
  end
  
  unless user
    logger.debug "User not found for fast authentication"
    return { status: 'user_not_found' }
  end
  
  # Try to find a device for this user
  user_devices = find_devices_for_user(user.guid)
  if user_devices.empty?
    logger.debug "No devices found for user"
    return { status: 'verification_needed' }
  end
  
  # If we already have a session for this user, use it
  if session[:current_handle] == user.handle && session[:device_session] == 'authenticated'
    logger.debug "Already authenticated in session"
    
    return {
      status: 'authenticated',
      handle: user.handle,
      guid: user.guid,
      device_key: session[:current_device_id],
      device_header_data: {
        deviceId: session[:current_device_id],
        userGuid: user.guid,
        userHandle: user.handle
      }
    }
  end
  
  # Try to match by device header for cross-browser
  if device_header
    logger.debug "Checking device header for fast authentication"
    header_match = find_device_by_header(device_header)
    
    if header_match && header_match[:handle] == user.handle
      # Calculate confidence for this match
      confidence_score = calculate_confidence_score(header_match, :header_match)
      confidence_level = get_confidence_level(confidence_score)
      
      logger.debug "Found device by header, confidence: #{confidence_level} (#{confidence_score})"
      
      # For high confidence, authenticate immediately
      if confidence_level == 'high'
        # Register this browser key with the device
        if browser_key != header_match[:device_id]
          add_browser_key_to_device(header_match[:path], browser_key)
        end
        
        return {
          status: 'authenticated',
          handle: user.handle,
          guid: user.guid,
          device_key: browser_key,
          path: header_match[:path],
          confidence_level: confidence_level,
          confidence_score: confidence_score,
          device_header_data: {
            deviceId: header_match[:device_id],
            userGuid: user.guid,
            userHandle: user.handle
          }
        }
      elsif confidence_level == 'medium' && has_pin?(user.handle)
        # For medium confidence with PIN, offer PIN verification
        return {
          status: 'needs_pin_verification',
          handle: user.handle,
          guid: user.guid,
          device_key: browser_key,
          masked_phone: mask_phone(user.phone),
          path: header_match[:path],
          confidence_level: confidence_level,
          confidence_score: confidence_score,
          pin_available: true
        }
      else
        # For low confidence, require full verification
        return {
          status: 'verification_needed',
          handle: user.handle,
          masked_phone: mask_phone(user.phone),
          confidence_level: confidence_level,
          confidence_score: confidence_score
        }
      end
    end
  end
  
  # If no match by header, we need verification
  logger.debug "No high-confidence match found, verification needed"
  return { 
    status: 'verification_needed',
    handle: user.handle,
    masked_phone: mask_phone(user.phone)
  }
end

  private
  
  def get_device_info(path)
    db = SQLite3::Database.new(path)
    result = db.get_first_row("SELECT device_id, handle, guid, phone, created_at, last_verified_at FROM device_info LIMIT 1")
    
    # Get device characteristics if available
    device_characteristics = get_device_characteristics(db)
    
    db.close
    
    return nil unless result
    
    {
      device_id: result[0],
      handle: result[1],
      guid: result[2],
      phone: result[3],
      created_at: result[4],
      last_verified_at: result[5],
      device_characteristics: device_characteristics
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
  
  def normalize_phone(phone)
    phone = phone.gsub(/[^0-9+]/, '')
    
    case phone
    when /^\+44/
      unless phone.match?(/^\+44[7][0-9]{9}$/)
        raise "Invalid UK mobile number format. Must start with +447"
      end
    when /^\+65/
      unless phone.match?(/^\+65[689][0-9]{7}$/)
        raise "Invalid Singapore mobile number format"
      end
    else
      raise "Invalid phone format. Please use +44 or +65"
    end
    
    phone
  end
  
  # Detect browser from user agent
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
end
