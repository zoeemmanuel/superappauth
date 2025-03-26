const React = require('react');
const { useState, useEffect, useRef, useCallback } = React;
const { X, Phone, User, ArrowRight, Check, ArrowLeft, ChevronDown, Lock } = require('lucide-react');
const axios = require('../../config/axios');
const { 
  generateDeviceKey, 
  getStoredDeviceKey, 
  storeDeviceKey, 
  storeDeviceSessionData, 
  clearDeviceSession 
} = require('../../utils/deviceKey');

const UnifiedLogin = () => {
  // Flow state following the exact flowchart
  const [flowState, setFlowState] = useState('checking');
  /*
    Possible states:
    - checking: initial loading state
    - deviceRegistered: device found in database
    - deviceNotRegistered: device not found in database
    - loginOptions: show login/register options
    - handleEntry: user is entering a handle for registration
    - handleStatus: checking handle availability
    - phoneEntry: user is entering a phone number
    - deviceRegistration: confirming device registration for existing account
    - verification: verification code entry
    - createHandle: handle creation for new users
    - loginSuccess: successfully logged in, redirecting
    - handleSuggestions: showing handle suggestions when handle is taken
  */
  
  // User input states
  const [identifier, setIdentifier] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [handle, setHandle] = useState('');
  const [error, setError] = useState('');
  const [phone, setPhone] = useState('');
  const [isQuickVerification, setIsQuickVerification] = useState(false);
  const [countryCode, setCountryCode] = useState('+44');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [showCountrySelect, setShowCountrySelect] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [redirectAttempts, setRedirectAttempts] = useState(0);
  const [welcomeMessage, setWelcomeMessage] = useState('');
  const [loginMethod, setLoginMethod] = useState('handle'); // Default to handle first per flowchart
  const [existingUserData, setExistingUserData] = useState(null);
  const [autoSubmit, setAutoSubmit] = useState(true); // Added for verification control
  const [deviceNotRegistered, setDeviceNotRegistered] = useState(false); // Flag for device registration status
  const [suggestedHandles, setSuggestedHandles] = useState([]); // For handle suggestions
  const [showExistingAccountAlert, setShowExistingAccountAlert] = useState(false); // For existing account alert
  const [accountType, setAccountType] = useState(null); // 'handle' or 'phone'
  const [existingHandle, setExistingHandle] = useState(''); // For masking handles
  const [isHandleFirst, setIsHandleFirst] = useState(false); // Added to track handle-first flow
  const [customHandle, setCustomHandle] = useState(''); // For custom handle input in suggestions
  
  const verificationInputRef = useRef(null); // Added for focusing the verification input
  const yesButtonRef = useRef(null); // Added for the device registration screen
  const noButtonRef = useRef(null); // Added for the device registration screen
  const MAX_REDIRECT_ATTEMPTS = 3;
  
  // Define handleRegisterDevice and handleNotMyAccount as useCallback functions
  // so they maintain consistent references for the useEffect

const handleRegisterDevice = useCallback(async () => {
  console.log("handleRegisterDevice called");
  
  // Prevent duplicate calls
  if (isLoading) {
    console.log("Already loading, ignoring duplicate call");
    return;
  }
  
  // Immediately transition to verification for better UX
  setFlowState('verification');
  setWelcomeMessage(`Verify it's you, ${existingUserData?.handle || ''}`);
  setIsLoading(true);
  setError('');
  
  try {
    // Explicitly store flags in sessionStorage for cross-request persistence
    sessionStorage.setItem('device_registration', 'true');
    sessionStorage.setItem('device_registration_flow', 'true');
    sessionStorage.setItem('pending_verification', 'true');
    
    // If we're in handle-first flow, also set that flag
    if (accountType === 'handle' || loginMethod === 'handle') {
      sessionStorage.setItem('handle_first', 'true');
    }
    
    // More reliable CSRF token retrieval
    const metaElement = document.querySelector('meta[name="csrf-token"]');
    const csrfToken = metaElement ? metaElement.getAttribute('content') : null;
    console.log("CSRF token:", csrfToken ? "Found" : "Not found");
    
    if (!csrfToken) {
      console.error('CSRF token missing');
      setError('Security verification failed. Please refresh the page.');
      return;
    }
    
    // Make sure we're using the correct identifier
    let userIdentifier;
    
    if (existingUserData) {
      // Use the handle or phone from existingUserData
      if (accountType === 'handle' && existingUserData.handle) {
        userIdentifier = existingUserData.handle;
      } else if (accountType === 'phone' && existingUserData.phone) {
        userIdentifier = existingUserData.phone;
      } else {
        userIdentifier = loginMethod === 'handle' ? identifier : phone;
      }
    } else {
      userIdentifier = loginMethod === 'handle' ? identifier : phone;
    }
    
    console.log(`Registering device for: ${userIdentifier}`);
    
    const deviceKey = await getStoredDeviceKey();
    console.log(`Using device key: ${deviceKey?.substring(0, 10)}...`);
    
    // Using fetch directly for more reliable network request
    console.log("Sending verify_login request with device_registration=true");
    const response = await fetch('/api/v1/auth/verify_login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-CSRF-Token': csrfToken,
        'X-Device-Key': deviceKey || ''
      },
      body: JSON.stringify({
        identifier: userIdentifier,
        device_registration: true, // Explicit flag
        auth: { 
          identifier: userIdentifier,
          device_registration: true // Duplicate for Rails nested params
        }
      })
    });
    
    if (!response.ok) {
      throw new Error(`Server responded with status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('Device registration response:', data);
    
    if (data.status === 'verification_needed') {
      // Store the pending device path - THIS IS THE CRITICAL MISSING PIECE
      if (data.pending_device_path) {
        sessionStorage.setItem('pending_device_path', data.pending_device_path);
      }
      
      setPhone(data.masked_phone || phone);
      setHandle(data.handle || handle);
      setWelcomeMessage(`Verify it's you, ${data.handle || ''}`);
      
      // Store in sessionStorage for persistence
      sessionStorage.setItem('current_handle', data.handle);
      sessionStorage.setItem('verification_in_progress', 'true');
      sessionStorage.setItem('device_registration_flow', 'true'); // Important flag
      sessionStorage.setItem('pending_verification', 'true'); // Add this flag
    } else if (data.status === 'error') {
      setError(data.message || 'Registration failed. Please try again.');
    } else {
      console.warn('Unexpected response status:', data.status);
      setError('Unable to process request. Please try again.');
    }
  } catch (err) {
    console.error('Device registration error:', err);
    console.error('Error details:', {
      message: err.message,
      stack: err.stack
    });
    
    setError('Failed to register device. Please try again.');
  } finally {
    setIsLoading(false);
  }
}, [isLoading, loginMethod, identifier, phone, handle, accountType, existingUserData, setIsLoading, setError, setPhone, setHandle, setWelcomeMessage, setFlowState]);

  // Handle "This isn't my account" button click
  const handleNotMyAccount = useCallback(() => {
    setIsLoading(true);
    setError('');
    
    // If it's a handle login, suggest alternative handles
    if (loginMethod === 'handle' && identifier.startsWith('@')) {
      try {
        const suggestions = generateHandleSuggestions(identifier);
        setSuggestedHandles(suggestions);
        // Set handle-first flow flag
        setIsHandleFirst(true);
        setFlowState('handleSuggestions');
      } catch (err) {
        console.error('Error generating handle suggestions:', err);
        // Fall back to login options if suggestions fail
        setIdentifier('');
        setFlowState('loginOptions');
      }
    } else {
      // For phone number, just go back to login options
      setIdentifier('');
      setLoginMethod('phone'); // Ensure we stay in phone entry mode
      sessionStorage.setItem('clear_phone_entry', 'true');
      setAccountType(null);
      setExistingUserData(null);  // Clear existing user data
      setShowExistingAccountAlert(false);  // Hide the alert
      setFlowState('loginOptions');
    }
    
    setIsLoading(false);
  }, [loginMethod, identifier, setIsLoading, setError, setSuggestedHandles, setFlowState, setIdentifier]);

  // Add debugging useEffect with proper dependencies
  useEffect(() => {
    window.debugUnifiedLogin = {
      handleRegisterDevice,
      handleNotMyAccount,
      setFlowState,
      flowState
    };
    
    console.log("UnifiedLogin debug methods attached to window.debugUnifiedLogin");
    return () => {
      delete window.debugUnifiedLogin;
    };
  }, [handleRegisterDevice, handleNotMyAccount, setFlowState, flowState]);

  // Ensure CSRF token is available
  useEffect(() => {
    const csrfMetaTag = document.querySelector('meta[name="csrf-token"]');
    if (csrfMetaTag) {
      window.csrfToken = csrfMetaTag.getAttribute('content');
      console.log("CSRF token loaded:", window.csrfToken?.substring(0, 10) + "...");
    } else {
      console.error("CSRF token meta tag not found!");
    }
  }, []);

  // On initial load, check device status
  useEffect(() => {
    console.log('UnifiedLogin: Component mounted, initializing...');
    console.log('Checking session storage for account_already_exists:', 
        sessionStorage.getItem('account_already_exists'));
    
    // IMPORTANT FIX: Use localStorage to prevent tab loops
    const storedTabId = localStorage.getItem('superapp_tab_id');
    const currentTabId = Math.random().toString(36).substring(2, 15);
    
    // First tab handling
    if (!storedTabId) {
      localStorage.setItem('superapp_tab_id', currentTabId);
      console.log('First tab initialized with ID:', currentTabId);
    } else {
      console.log('Using existing tab ID:', storedTabId);
      
      // For subsequent tabs, check if the dashboard redirect is happening
      const redirectCount = parseInt(sessionStorage.getItem('redirect_count') || '0');
      if (redirectCount > 2 && window.location.pathname !== '/dashboard') {
        console.log('Detected potential redirect loop, stopping authentication check');
        localStorage.setItem('loop_detected', 'true');
        setFlowState('loginOptions');
        return;
      }
      
      // Track redirects to detect loops
      if (window.location.pathname === '/') {
        sessionStorage.setItem('redirect_count', (redirectCount + 1).toString());
      }
    }
    
    // FIX: Check localStorage for authenticated state to prevent tab loops
    if (window.location.pathname === '/dashboard' || 
        (localStorage.getItem('authenticated_user') === 'true' && 
         !localStorage.getItem('logout_state'))) {
      console.log('Already on dashboard or authenticated, skipping initialization');
      return;
    }
    
    // Check if we're on logout confirmation page
    if (window.location.pathname.includes('logout_confirmation')) {
      console.log('On logout confirmation page, skipping device check');
      return;
    }
    
    // IMPROVED LOGIC: Check for recent device check to avoid unnecessary API calls
    const deviceSession = sessionStorage.getItem('device_session');
    const currentHandle = sessionStorage.getItem('current_handle');
    const deviceKey = sessionStorage.getItem('device_key');
    const lastCheck = sessionStorage.getItem('last_device_check');
    const now = Date.now();
    
    // If fully authenticated with data in session, go directly to dashboard
    // BUT ONLY if we're not in the logout state
    if (deviceSession === 'authenticated' && 
        currentHandle && 
        deviceKey && 
        !localStorage.getItem('logout_state')) {
      console.log('Using cached device session:', currentHandle);
      // FIX: Set localStorage flag to prevent tab loops
      localStorage.setItem('authenticated_user', 'true');
      
      // Only redirect if not already on dashboard to prevent loops
      if (window.location.pathname !== '/dashboard') {
        window.location.href = '/dashboard';
      }
      return;
    }
    
    // Check for existing account information
    const alreadyExists = sessionStorage.getItem('account_already_exists');
    if (alreadyExists) {
      try {
        const data = JSON.parse(alreadyExists);
        console.log('Found existing account data:', data);
        setShowExistingAccountAlert(true);
        setAccountType(data.type);
        setExistingHandle(data.masked_handle || '');
        setIdentifier(data.phone || data.handle || '');
        setLoginMethod(data.type); // Switch tab appropriately
        
        // Also set existingUserData for device registration flow
        setExistingUserData({
          type: data.type,
          handle: data.handle,
          phone: data.phone,
          masked_handle: data.masked_handle,
          masked_phone: data.masked_phone
        });
        
        // Clear it after using
        sessionStorage.removeItem('account_already_exists');
      } catch (e) {
        console.error('Error parsing account data:', e);
      }
    }
    
    // Check for recent device check to avoid unnecessary API calls
    if (lastCheck && (now - parseInt(lastCheck)) < 2000) {
      console.log('Recent device check found, using cached data');
      const cachedHandle = sessionStorage.getItem('current_handle');
      const cachedPhone = sessionStorage.getItem('current_phone');
      
      if (cachedHandle) {
        console.log('Using cached device info:', cachedHandle);
        setHandle(cachedHandle);
        if (cachedPhone) setPhone(cachedPhone);
        setIsQuickVerification(true);
        setFlowState('verification');
        setIsLoading(false); // Ensure loading is reset
        setWelcomeMessage(`Welcome back, ${cachedHandle}!`);
      } else {
        setFlowState('loginOptions');
        setDeviceNotRegistered(true); // Set this flag for unregistered devices
      }
      return;
    }
    
    sessionStorage.setItem('last_device_check', now.toString());
    
    // FIX: Clear any stale loop detection
    localStorage.removeItem('loop_detected');
    
    // Continue with device check
    checkDevice();
  }, []);
  
  // Add storage event listener useEffect
  useEffect(() => {
    // Handle storage events for cross-tab communication
    const handleStorageChange = (e) => {
      if (e.key === 'authenticated_user' && e.newValue === 'true') {
        console.log('Authentication detected in another tab');
        
        // Only redirect if we're not already on dashboard
        if (window.location.pathname !== '/dashboard') {
          window.location.href = '/dashboard';
        }
      }
      
      if (e.key === 'logout_state' && e.newValue === 'true') {
        console.log('Logout detected in another tab');
        // Clear local session data
        sessionStorage.removeItem('device_session');
        sessionStorage.removeItem('current_handle');
        
        // Reset UI state to login options
        setFlowState('loginOptions');
        setDeviceNotRegistered(true);
        clearDeviceSession();
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  // When entering verification state, reset loading and focus on input
  useEffect(() => {
    if (flowState === 'verification') {
      // Reset loading state when entering verification screen
      setIsLoading(false);
      setAutoSubmit(true);
      
      // Focus on the verification input after a short delay
      setTimeout(() => {
        if (verificationInputRef.current) {
          verificationInputRef.current.focus();
        }
      }, 100);
    } else if (flowState === 'handleSuggestions') {
      // Check for stored suggestions
      const storedSuggestions = sessionStorage.getItem('handle_suggestions');
      if (storedSuggestions) {
        try {
          const parsedSuggestions = JSON.parse(storedSuggestions);
          setSuggestedHandles(parsedSuggestions);
          // Clear it after using
          sessionStorage.removeItem('handle_suggestions');
        } catch (e) {
          console.error('Error parsing stored suggestions:', e);
        }
      }
    }
  }, [flowState]);

  // Auto-submit verification when code is complete
  useEffect(() => {
    if (verificationCode.length === 6 && 
        (flowState === 'verification' || flowState === 'deviceRegistration') &&
        !isLoading && autoSubmit) {  // Only auto-submit if enabled and not loading
      handleVerificationSubmit();
    }
  }, [verificationCode, isLoading, autoSubmit, flowState]);

  // Main device check function - determines initial flow state
  const checkDevice = async () => {
    console.log('Starting device check...');
    
    // Check for loop detection flag
    if (localStorage.getItem('loop_detected') === 'true') {
      console.log('Loop previously detected, skipping device check');
      setFlowState('loginOptions');
      return;
    }
    
    // Check URL for logout confirmation state
    const urlParams = new URLSearchParams(window.location.search);
    if (window.location.pathname.includes('logout_confirmation') || 
        urlParams.has('logout')) {
      console.log('On logout confirmation page - skipping device check');
      return;
    }
    
    // Check local storage for logout state
    if (localStorage.getItem('logout_state') === 'true') {
      console.log('Logout state detected in localStorage');
      localStorage.removeItem('logout_state'); // Clear it after detection
      clearDeviceSession(); // Make sure this completely clears all session data
      setFlowState('loginOptions');
      setDeviceNotRegistered(true);
      return;
    }
    
    // Skip if already authenticated or logging out
    if (shouldSkipDeviceCheck()) {
      console.log('Skipping device check: already authenticated or logging out');
      return;
    }

    try {
      setIsLoading(true);
      let deviceKey = await getStoredDeviceKey();
      
      // Check for previous handle stored during logout
      const previousHandle = localStorage.getItem('previous_handle');
      if (previousHandle) {
        console.log('Found previous handle in localStorage:', previousHandle);
      }
      
      if (sessionStorage.getItem('verification_in_progress')) {
        console.log('Verification in progress, skipping device check');
        return;
      }

      if (!deviceKey) {
        console.log('No device key found, generating...');
        deviceKey = await generateDeviceKey();
        if (deviceKey) {
          console.log('Storing new device key');
          storeDeviceKey(deviceKey);
        }
      }

      console.log('Sending device check request with key:', deviceKey?.substring(0, 10) + '...');
      const response = await axios.post('check_device', {}, {
        headers: deviceKey ? {
          'X-Device-Key': deviceKey,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        } : {},
        timeout: 10000 // Add timeout to prevent hanging requests
      });

      console.log('Check device response:', response.data);

      // Handle response based on device status
      if (response.data.device_key) {
        storeDeviceKey(response.data.device_key);
      }

      // Special handling for logout state
      if (response.data.status === 'logged_out' || 
          response.data.next === 'logout_confirmation') {
        console.log('Logout state detected from server');
        clearDeviceSession();
        // Don't change state - the page should be redirecting to logout confirmation
        return;
      }

      // Follow flowchart states based on response
      if (response.data.status === 'authenticated') {
        // Device is registered and recently verified - go to dashboard
        console.log('Device authenticated, redirecting to dashboard');
        storeDeviceSessionData(response.data);
        // FIX: Set localStorage flag to prevent tab loops
        localStorage.setItem('authenticated_user', 'true');
        setFlowState('loginSuccess');
        setTimeout(() => {
          window.location.href = response.data.redirect_to || '/dashboard';
        }, 500);
      } else if (response.data.status === 'needs_quick_verification') {
        // Device is registered but needs verification
        console.log('Device recognized but needs quick verification');
        storeDeviceSessionData(response.data);
        setHandle(response.data.handle);
        setPhone(response.data.masked_phone);
        setIsQuickVerification(true);
        setWelcomeMessage(`Welcome back, ${response.data.handle}!`);
        setFlowState('verification');
        setIsLoading(false);  // Ensure loading is reset
      } else if (response.data.status === 'show_options') {
        // New device, no registration found
        console.log('New device or no registration found, showing login options');
        setFlowState('loginOptions');
        
        // Set device not registered flag if present
        if (response.data.device_not_registered) {
          setDeviceNotRegistered(true);
        }
      } else {
        // Default to login options for any other status
        console.log('Unknown status, defaulting to login options');
        if (response.data.guid) {
          sessionStorage.setItem('device_guid', response.data.guid);
        }
        setFlowState('loginOptions');
        setDeviceNotRegistered(true); // Default to showing device not registered
      }
    } catch (err) {
      console.error('Device check failed:', err);
      setError('Connection error. Please try again.');
      setFlowState('loginOptions');
      setDeviceNotRegistered(true); // Show device not registered on error
    } finally {
      setIsLoading(false);
    }
  };

  // Phone input formatter
  const handlePhoneInput = (e) => {
    const value = e.target.value.replace(/[^\d]/g, '');
    setPhoneNumber(value);
    const fullNumber = `${countryCode}${value}`;
    setIdentifier(fullNumber);
  };

  // Format phone for display
  const formatPhoneDisplay = (number) => {
    if (!number) return '';
    const digits = number.replace(/[^\d]/g, '');
    
    if (countryCode === '+44') { // UK format
      if (digits.length <= 4) return digits;
      if (digits.length <= 7) return `${digits.slice(0, 4)} ${digits.slice(4)}`;
      return `${digits.slice(0, 4)} ${digits.slice(4, 7)} ${digits.slice(7)}`;
    } else { // Singapore format
      if (digits.length <= 4) return digits;
      return `${digits.slice(0, 4)} ${digits.slice(4)}`;
    }
  };

  // Phone number validation
  const validatePhoneNumber = () => {
    if (countryCode === '+44' && phoneNumber.length !== 10) return false;
    if (countryCode === '+65' && phoneNumber.length !== 8) return false;
    return true;
  };

  // Handle validation (for registration)
  const validateHandle = () => {
    if (!identifier.startsWith('@')) return false;
    if (identifier.length < 2) return false;
    return identifier.match(/^@[a-zA-Z0-9_]+$/);
  };

  // Initial login/registration option selection
  const handleLoginMethodSelect = (method) => {
    setLoginMethod(method);
    setIdentifier(method === 'handle' ? '@' : '');
    setPhoneNumber('');
    setError('');
    
    // Clear existing account alert when switching methods
    setShowExistingAccountAlert(false);
  };

  // Generate handle suggestions based on the existing handle
  const generateHandleSuggestions = (originalHandle) => {
    const baseName = originalHandle.replace('@', '');
    
    // Generate some variations
    const suggestions = [
      `@${baseName}1`, 
      `@${baseName}2`, 
      `@${baseName}_app`,
      `@${baseName}_${Math.floor(Math.random() * 1000)}`
    ];
    
    return suggestions;
  };

  // Helper function to mask a handle (e.g. @username -> @u***e)
  const maskHandle = (handle) => {
    if (!handle || handle.length <= 3) return handle;
    
    const prefix = handle.charAt(0); // Keep the @ symbol
    const firstChar = handle.charAt(1); // Keep first character after @
    const lastChar = handle.charAt(handle.length - 1); // Keep last character
    
    // Replace middle characters with asterisks
    const middleLength = handle.length - 3;
    const masked = middleLength > 0 ? '*'.repeat(Math.min(middleLength, 3)) : '';
    
    return `${prefix}${firstChar}${masked}${lastChar}`;
  };
  
  // Helper function to mask a phone number (keep last 4 digits)
  const maskPhone = (phone) => {
    if (!phone) return '';
    return '*******' + phone.slice(-4);
  };

  // Handle initial login/registration submission
  const handleInitialSubmit = async () => {
    setError('');
    setIsLoading(true);
    
    // Verify CSRF token
    if (!window.csrfToken) {
      console.error('CSRF token missing');
      setError('Security verification failed. Please refresh the page.');
      setIsLoading(false);
      return;
    }
    
    // Handle-first flow for new users (per flowchart)
    if (loginMethod === 'handle') {
      // Validate handle format
      if (!validateHandle()) {
        setError('Please enter a valid handle starting with @');
        setIsLoading(false);
        return;
      }
      
      try {
        // First check if handle exists using our new endpoint
        console.log('Pre-checking handle:', identifier);
        const deviceKey = await getStoredDeviceKey();
        const checkResponse = await axios.get(`check_handle?handle=${encodeURIComponent(identifier)}`, {
          headers: {
            'X-Device-Key': deviceKey,
            'X-CSRF-Token': window.csrfToken,
            'Accept': 'application/json'
          }
        });
          
        console.log('Handle pre-check response:', checkResponse.data);
          
        // If handle exists and this is a new device, force the Account Already Exists screen
        if (checkResponse.data.exists && !checkResponse.data.is_your_device) {
          console.log('Handle exists on another device, showing Account Already Exists screen');
          
          // Store in sessionStorage for persistence across refreshes
          sessionStorage.setItem('account_already_exists', JSON.stringify({
            type: 'handle',
            handle: identifier,
            masked_handle: checkResponse.data.masked_handle || maskHandle(identifier),
            masked_phone: checkResponse.data.masked_phone
          }));
          
          setShowExistingAccountAlert(true);
          setAccountType('handle');
          setExistingHandle(checkResponse.data.masked_handle || maskHandle(identifier));
          setExistingUserData({
            handle: identifier,
            masked_phone: checkResponse.data.masked_phone
          });
          setIsLoading(false);
          return;
        }
        
        // If handle pre-check succeeded but it's your device or handle doesn't exist, proceed with normal flow
        console.log('Checking handle with main verification endpoint:', identifier);
        const response = await axios.post('verify_login', {
          identifier: identifier,
          auth: { identifier: identifier }
        }, {
          headers: {
            'X-Device-Key': deviceKey,
            'X-CSRF-Token': window.csrfToken,
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          timeout: 10000 // 10 second timeout
        });

        console.log('Handle check response:', response.data);

        // Handle response based on status
        if (response.data.status === 'verification_needed') {
          // Existing user - needs verification
          console.log('Existing user found, going to verification');
          setHandle(response.data.handle || '');
          setPhone(response.data.masked_phone);
          setFlowState('verification');
          setWelcomeMessage(`Welcome back, ${response.data.handle}!`);
          return;
        } else if (response.data.status === 'handle_not_found') {
          // Handle not found - proceed with registration
          console.log('Handle not found, proceeding with registration');
          // Per flowchart: Handle is entered first, then phone number
          setHandle(identifier);
          setIsHandleFirst(true); // Set handle-first flow flag
          setFlowState('phoneEntry');
          return;
        } else if (response.data.status === 'handle_exists') {
          // Handle exists but on different device - force device registration screen
          console.log('Handle exists, showing Account Already Exists screen');
          
          // Store in sessionStorage for persistence
          sessionStorage.setItem('account_already_exists', JSON.stringify({
            type: 'handle',
            handle: response.data.handle || identifier,
            masked_handle: response.data.masked_handle || maskHandle(identifier),
            masked_phone: response.data.masked_phone
          }));
          
          setShowExistingAccountAlert(true);
          setAccountType('handle');
          setExistingHandle(response.data.masked_handle || maskHandle(response.data.handle || identifier));
          setExistingUserData({
            handle: response.data.handle || identifier,
            masked_phone: response.data.masked_phone
          });
          return;
        }
      } catch (err) {
        console.error('Handle check error:', err);
        console.error('Error details:', {
          message: err.message,
          response: err.response?.data,
          status: err.response?.status,
          url: err.config?.url  // Add this to see the actual URL being called
        });
        
        // Handle specific error cases
        if (err.response?.data?.status === 'handle_not_found') {
          // Handle not found - proceed with registration
          console.log('Error indicates handle not found, proceeding with registration');
          setHandle(identifier);
          setIsHandleFirst(true); // Set handle-first flow flag
          setFlowState('phoneEntry');
        } else if (err.response?.data?.status === 'handle_exists') {
          // Show Account Already Exists screen
          console.log('Handle exists (from error), showing Account Already Exists screen');
          
          // Store in sessionStorage for persistence
          sessionStorage.setItem('account_already_exists', JSON.stringify({
            type: 'handle',
            handle: err.response?.data?.handle || identifier,
            masked_handle: err.response?.data?.masked_handle || maskHandle(identifier),
            masked_phone: err.response?.data?.masked_phone
          }));
          
          setShowExistingAccountAlert(true);
          setAccountType('handle');
          setExistingHandle(err.response?.data?.masked_handle || maskHandle(err.response?.data?.handle || identifier));
          setExistingUserData({
            handle: err.response?.data?.handle || identifier,
            masked_phone: err.response?.data?.masked_phone
          });
        } else {
          setError(err.response?.data?.error || 'Verification failed');
        }
      } finally {
        setIsLoading(false);
      }
    } else {
      // Phone login flow
      if (!validatePhoneNumber()) {
        setError(`Please enter a valid ${countryCode === '+44' ? 'UK' : 'Singapore'} phone number`);
        setIsLoading(false);
        return;
      }
      
      try {
        console.log('Checking phone:', identifier);
        const deviceKey = await getStoredDeviceKey();
        const response = await axios.post('verify_login', {
          identifier: identifier,
          auth: { identifier: identifier }
        }, {
          headers: {
            'X-Device-Key': deviceKey,
            'X-CSRF-Token': window.csrfToken,
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          timeout: 10000 // 10 second timeout
        });

        console.log('Phone check response:', response.data);

        if (response.data.status === 'verification_needed') {
          // Existing user - needs verification
          console.log('Existing user found, going to verification');
          setHandle(response.data.handle || '');
          setPhone(response.data.masked_phone || identifier);
          setFlowState('verification');
          if (response.data.handle) {
            setWelcomeMessage(`Welcome back, ${response.data.handle}!`);
          } else {
            setWelcomeMessage('Verify your number');
          }
          return;
        } else if (response.data.status === 'phone_not_found') {
          // Phone not found - show handle entry for new registration
          console.log('Phone not found, showing handle entry for registration');
          setPhone(identifier);
          // For phone login flow, we're in phone-first mode
          setIsHandleFirst(false); // Not handle-first flow
          setFlowState('handleEntry');
          return;
        } else if (response.data.status === 'phone_exists') {
          // Phone exists but on different device - show Account Already Exists screen
          console.log('Phone exists, showing Account Already Exists screen');
          
          // Store in sessionStorage for persistence
          sessionStorage.setItem('account_already_exists', JSON.stringify({
            type: 'phone',
            phone: identifier,
            handle: response.data.handle,
            masked_handle: response.data.masked_handle || maskHandle(response.data.handle),
            masked_phone: response.data.masked_phone || maskPhone(identifier)
          }));
          
          setShowExistingAccountAlert(true);
          setAccountType('phone');
          setExistingUserData({
            type: 'phone',
            phone: identifier,
            handle: response.data.handle,
            masked_phone: response.data.masked_phone || maskPhone(identifier)
          });
          return;
        }
      } catch (err) {
        console.error('Phone check error:', err);
        console.error('Error details:', {
          message: err.message,
          response: err.response?.data,
          status: err.response?.status,
          url: err.config?.url  // Add this to see the actual URL being called
        });
        
        if (err.response?.data?.status === 'phone_not_found') {
          // Phone not found - show handle entry for new registration
          console.log('Error indicates phone not found, showing handle entry');
          setPhone(identifier);
          // For phone login flow, we're in phone-first mode
          setIsHandleFirst(false); // Not handle-first flow
          setFlowState('handleEntry');
        } else if (err.response?.data?.status === 'phone_exists') {
          // Show Account Already Exists screen
          console.log('Phone exists (from error), showing Account Already Exists screen');
          
          // Store in sessionStorage for persistence
          sessionStorage.setItem('account_already_exists', JSON.stringify({
            type: 'phone',
            phone: identifier,
            handle: err.response?.data?.handle,
            masked_handle: err.response?.data?.masked_handle || maskHandle(err.response?.data?.handle),
            masked_phone: err.response?.data?.masked_phone || maskPhone(identifier)
          }));
          
          setShowExistingAccountAlert(true);
          setAccountType('phone');
          setExistingUserData({
            type: 'phone',
            phone: identifier,
            handle: err.response?.data?.handle,
            masked_phone: err.response?.data?.masked_phone || maskPhone(identifier)
          });
        } else {
          setError(err.response?.data?.error || 'Verification failed');
        }
      } finally {
        setIsLoading(false);
      }
    }
  };

  // Submit phone number after handle (for new registrations)
  const handlePhoneSubmit = async () => {
    setError('');
    setIsLoading(true);
    
    // Verify CSRF token
    if (!window.csrfToken) {
      console.error('CSRF token missing');
      setError('Security verification failed. Please refresh the page.');
      setIsLoading(false);
      return;
    }
    
    if (!validatePhoneNumber()) {
      setError(`Please enter a valid ${countryCode === '+44' ? 'UK' : 'Singapore'} phone number`);
      setIsLoading(false);
      return;
    }
    
    try {
      console.log('Registering with handle and phone:', handle, identifier);
      console.log('Handle-first flow:', isHandleFirst);
      const deviceKey = await getStoredDeviceKey();
      
      // Store handle-first flag in sessionStorage for cross-request persistence
      sessionStorage.setItem('handle_first', isHandleFirst.toString());
      
      // Send verification code to this phone
      const response = await axios.post('verify_login', {
        identifier: identifier,
        auth: { 
          identifier: identifier,
          handle: handle, // Also send the handle for context
          handle_first: isHandleFirst // Indicate handle-first flow - critical!
        }
      }, {
        headers: {
          'X-Device-Key': deviceKey,
          'X-CSRF-Token': window.csrfToken,
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        timeout: 10000 // 10 second timeout
      });

      console.log('Phone verification response:', response.data);
      
      // Proceed to verification step
      setPhone(response.data.masked_phone || identifier);
      setFlowState('verification');
      setWelcomeMessage('Verify your number');
      setIsLoading(false);
    } catch (err) {
      console.error('Phone verification error:', err);
      console.error('Error details:', {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status,
        url: err.config?.url  // Add this to see the actual URL being called
      });
      
      setError(err.response?.data?.error || 'Failed to send verification code');
      setIsLoading(false);
    }
  };

  // Handle submitting handle after phone (for phone-first flow)
  const handleHandleSubmit = async () => {
    if (!handle || handle.length < 2 || isLoading || !handle.match(/^@[a-zA-Z0-9_]{1,29}$/)) {
      setError('Please enter a valid handle starting with @');
      return;
    }
    
    setError('');
    setIsLoading(true);
    
    try {
      console.log('Submitting handle for verification:', handle);
      console.log('Phone from previous step:', phone);
      
      // First check if handle exists using our check endpoint
      const deviceKey = await getStoredDeviceKey();   
      const checkResponse = await axios.get(`check_handle?handle=${encodeURIComponent(handle)}`, {
        headers: {
          'X-Device-Key': deviceKey,
          'X-CSRF-Token': window.csrfToken,
          'Accept': 'application/json'
        }
      });
      
      if (checkResponse.data.exists) {
        // Handle already exists, show error
        setError('This handle is already taken. Please choose another.');
        setIsLoading(false);
        return;
      }
      
      // Store handle for verification step
      sessionStorage.setItem('pending_handle', handle);
      
      // Get the verification code that was already sent
      if (phone) {
        // If we have a phone, we're in phone-first flow
        // Submit to verify code with the handle
        const response = await axios.post('verify_code', {
          code: verificationCode,
          handle: handle, // Important: Pass the handle for createHandle flow
          phone: phone,
          auth: {
            code: verificationCode,
            handle: handle,
            phone: phone,
            handle_first: false // Not handle-first in this case
          }
        }, {
          headers: {
            'X-Device-Key': deviceKey,
            'X-CSRF-Token': window.csrfToken
          }
        });
        
        console.log('Handle creation response:', response.data);
        
        if (response.data.status === 'authenticated') {
          // Account created successfully
          storeDeviceSessionData(response.data);
          localStorage.setItem('authenticated_user', 'true');
          setFlowState('loginSuccess');
          
          setTimeout(() => {
            window.location.href = response.data.redirect_to || '/dashboard';
          }, 1000);
        } else {
          setError(response.data.error || 'Failed to create account');
        }
      } else {
        // Redirect to phone entry since we're in handle-first flow
        setIsHandleFirst(true);
        setFlowState('phoneEntry');
      }
    } catch (err) {
      console.error('Handle submission error:', err);
      console.error('Error details:', {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status,
        url: err.config?.url  // Add this to see the actual URL being called
      });
      
      // Check for handle already exists error
      if (err.response?.data?.status === 'handle_exists') {
        setError('This handle is already taken. Please choose another.');
      } else {
        setError(err.response?.data?.error || 'Failed to register handle');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Handle verification code submission
  const handleVerificationSubmit = async () => {
    if (verificationCode.length !== 6 || isLoading) return;
    
    // Verify CSRF token
    if (!window.csrfToken) {
      console.error('CSRF token missing');
      setError('Security verification failed. Please refresh the page.');
      setIsLoading(false);
      return;
    }
    
    // Disable auto-submit to prevent multiple submissions
    setAutoSubmit(false);
    setIsLoading(true);
    setError('');

    try {
      console.log('Submitting verification code:', verificationCode);
      const deviceKey = await getStoredDeviceKey();
      
      // Build payload with all necessary context
      const payload = { 
        code: verificationCode,
        auth: { 
          code: verificationCode 
        }
      };
      
      // Add phone if available
      if (phone) {
        payload.phone = phone;
        payload.auth.phone = phone;
      }
      
      // Add handle if available (for handle-first flow)
      if (handle) {
        payload.handle = handle;
        payload.auth.handle = handle;
      }
      
      // Add handle-first flag if we're in that flow
      if (isHandleFirst || sessionStorage.getItem('handle_first') === 'true') {
        payload.handle_first = true;
        payload.auth.handle_first = true;
      }
      
      // Flag for device registration if applicable
      if (flowState === 'deviceRegistration' || 
          sessionStorage.getItem('device_registration') === 'true' ||
          sessionStorage.getItem('device_registration_flow') === 'true') {
        
        payload.device_registration = true;
        payload.auth.device_registration = true;
      }

      console.log('Sending verification payload:', payload);

      const response = await axios.post('verify_code', payload, {
        headers: {
          'X-Device-Key': deviceKey,
          'X-CSRF-Token': window.csrfToken
        },
        timeout: 10000 // 10 second timeout
      });

      console.log('Verification response:', response.data);

      // Clear device registration flags after successful verification
      sessionStorage.removeItem('device_registration');
      sessionStorage.removeItem('device_registration_flow');
      sessionStorage.removeItem('handle_first');

      if (response.data.status === 'authenticated') {
        // Store all relevant session data
        storeDeviceSessionData(response.data);
        // FIX: Set localStorage flag to prevent tab loops
        localStorage.setItem('authenticated_user', 'true');
        setFlowState('loginSuccess');
        
        // Clear verification state and redirect
        sessionStorage.removeItem('verification_in_progress');
        
        setTimeout(() => {
          window.location.href = response.data.redirect_to || '/dashboard';
        }, 1000);
      } else if (response.data.status === 'needs_handle') {
        // New user needs to create a handle
        console.log('Phone verified, now needs handle creation');
        setFlowState('createHandle');
      }
    } catch (err) {
      console.error('Verification error:', err);
      console.error('Error details:', {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status,
        url: err.config?.url  // Add this to see the actual URL being called
      });
      
      setError(err.response?.data?.error || 'Invalid verification code');
      setVerificationCode('');
      setAutoSubmit(true); // Re-enable auto-submit for the next attempt
    } finally {
      setIsLoading(false);
    }
  };

  // Format phone number with country code
  const formatPhoneNumber = (value) => {
    if (!value) return value;
    const phoneNumber = value.replace(/[^\d+]/g, '');
    if (phoneNumber.startsWith('44')) return `+${phoneNumber}`;
    if (phoneNumber.startsWith('65')) return `+${phoneNumber}`;
    if (phoneNumber.startsWith('4')) return `+4${phoneNumber}`;
    if (phoneNumber.startsWith('6')) return `+6${phoneNumber}`;
    return phoneNumber;
  };

  // Generic phone input handler
  const handlePhoneChange = (e) => {
    const formattedPhone = formatPhoneNumber(e.target.value);
    setIdentifier(formattedPhone);
  };

  // Skip device check in certain conditions
  const shouldSkipDeviceCheck = () => {
    return window.location.pathname === '/dashboard' || 
           sessionStorage.getItem('logging_out') === 'true' ||
           localStorage.getItem('authenticated_user') === 'true' || // FIX: Check localStorage
           (sessionStorage.getItem('device_session') === 'authenticated' && 
            sessionStorage.getItem('current_handle'));
  };

  // Render loading state
  const renderLoadingState = () => (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="flex flex-col items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-teal-500 mb-4"></div>
        <p className="text-white text-lg">Connecting to SuperApp...</p>
      </div>
    </div>
  );

  // Render device not registered message
  const renderDeviceNotRegistered = () => (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6 text-center">
        <div className="mb-6 flex justify-center">
          <div className="w-16 h-16 rounded-full bg-gray-800 flex items-center justify-center">
            <X className="w-8 h-8 text-gray-400" />
          </div>
        </div>
        <h1 className="text-2xl font-bold">Device Not Registered</h1>
        <p className="text-gray-400">This device is not linked to any SuperApp account</p>
        <div className="animate-pulse flex justify-center mt-4">
          <div className="w-8 h-8 rounded-full border-t-2 border-teal-500 animate-spin"></div>
        </div>
      </div>
    </div>
  );

  // Render device registered state
  const renderDeviceRegistered = () => (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6 text-center">
        <div className="mb-6 flex justify-center">
          <div className="w-16 h-16 rounded-full bg-teal-500 flex items-center justify-center">
            <Check className="w-8 h-8 text-white" />
          </div>
        </div>
        <h1 className="text-2xl font-bold">Device Recognized</h1>
        <p className="text-gray-400">Redirecting you to dashboard...</p>
        <div className="animate-pulse flex justify-center mt-4">
          <div className="w-8 h-8 rounded-full border-t-2 border-teal-500 animate-spin"></div>
        </div>
      </div>
    </div>
  );

  // Render login success state
  const renderLoginSuccess = () => (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6 text-center">
        <div className="mb-6 flex justify-center">
          <div className="w-16 h-16 rounded-full bg-teal-500 flex items-center justify-center">
            <Check className="w-8 h-8 text-white" />
          </div>
        </div>
        <h1 className="text-2xl font-bold">Login Successful</h1>
        <p className="text-gray-400">Redirecting you to dashboard...</p>
        <div className="animate-pulse flex justify-center mt-4">
          <div className="w-8 h-8 rounded-full border-t-2 border-teal-500 animate-spin"></div>
        </div>
      </div>
    </div>
  );

  // Render verification step
 const renderVerificationStep = () => (
  <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-4">
    <div className="w-full max-w-md">
      <div className="mb-8 flex justify-center">
        <div className="w-16 h-16 rounded-full bg-teal-500 flex items-center justify-center text-xl font-bold">
          {handle ? handle[0].toUpperCase() : 'S'}
        </div>
      </div>

      <div className="text-center space-y-2 mb-8">
        <h1 className="text-2xl font-bold">
          {welcomeMessage || (isQuickVerification ? `Welcome back, ${handle}` : 'Verify your number')}
        </h1>
        <p className="text-gray-400">
          {isQuickVerification ? (
            <>
              Please enter the code sent to {phone} to confirm this is your account
            </>
          ) : (
            `Please enter the code sent to ${phone} to confirm this is your account`
          )}
        </p>
      </div>

      <div className="mb-8">
        <div className="flex justify-center gap-3">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className={`w-12 h-14 flex items-center justify-center text-xl 
                border-2 rounded-lg transition-colors
                ${verificationCode[i] ? 'border-teal-500 bg-gray-800' : 'border-gray-600'}`}
            >
              {verificationCode[i] || ''}
            </div>
          ))}
        </div>
        
        <input
          type="tel"
          value={verificationCode}
          onChange={(e) => {
            const value = e.target.value.replace(/[^0-9]/g, '').slice(0, 6);
            setVerificationCode(value);
          }}
          ref={verificationInputRef}
          className="sr-only"
          maxLength={6}
          autoFocus
        />
      </div>

      <div className="grid grid-cols-3 gap-6 mb-8">
        {[1,2,3,4,5,6,7,8,9,'',0,'⌫'].map((num, i) => (
          <button
            key={i}
            onClick={() => {
              if (num === '⌫') {
                setVerificationCode(prev => prev.slice(0, -1));
              } else if (num !== '') {
                setVerificationCode(prev => 
                  prev.length < 6 ? prev + num : prev
                );
              }
            }}
            className={`h-14 text-2xl font-light rounded-full
              ${num === '' ? 'cursor-default' : 'hover:bg-gray-800 active:bg-gray-700'}`}
            disabled={isLoading}
          >
            {num}
          </button>
        ))}
      </div>

      {error && (
        <div className="text-red-500 text-center mb-4 flex items-center justify-center p-3 bg-red-500 bg-opacity-10 rounded-lg">
          <span>{error}</span>
          <button onClick={() => setError('')} className="ml-2">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {isLoading && (
        <div className="text-center mb-4 text-gray-400">
          <div className="inline-block animate-spin rounded-full h-5 w-5 border-b-2 border-teal-500 mr-2"></div>
          Verifying...
        </div>
      )}

      {/* Added explicit verify button */}
      <div className="flex justify-center mt-4">
        <button 
          onClick={handleVerificationSubmit}
          disabled={verificationCode.length < 6 || isLoading}
          className="bg-teal-500 text-white py-3 px-6 rounded-lg hover:bg-teal-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed w-full font-medium"
        >
          {isLoading ? 'Verifying...' : 'Verify Code'}
        </button>
      </div>

      <button
        onClick={() => {
          setFlowState('loginOptions');
          setVerificationCode('');
          setIsQuickVerification(false);
          setError('');
          setIsLoading(false); // Reset loading state when going back
        }}
        className="text-sm text-gray-400 w-full text-center mt-4 hover:text-gray-300 transition-colors"
        disabled={isLoading}
      >
        Didn't receive code?
      </button>
    </div>
  </div>
);


  // Render login/register options
  const renderLoginOptions = () => (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Welcome to SuperApp</h1>
          <p className="text-gray-400">
            {deviceNotRegistered 
              ? "This device is not registered. Please login with an existing account or create a new one."
              : "Login or register to continue"}
          </p>
        </div>

        {/* Existing Account Alert - Updated Messaging */}
        {showExistingAccountAlert && (
          <div className="flex flex-col items-center text-center space-y-6 py-4">
            <div className="w-16 h-16 rounded-full bg-teal-500 flex items-center justify-center">
              {accountType === 'handle' ? <span className="text-white text-2xl">@</span> : <User className="w-8 h-8 text-white" />}
            </div>
            
            <div className="space-y-2">
              <h2 className="text-2xl font-bold">
                {accountType === 'handle' 
                  ? "This Handle Is Already Registered" 
                  : "Phone Number Already Registered"}
              </h2>
              <p className="text-gray-400">
                {accountType === 'handle' 
                  ? `The handle ${existingHandle || identifier} is already in use. Are you the owner of this account or would you like to choose a different handle?` 
                  : `This phone number is associated with an existing account. If this is your account, you can sign in. Otherwise, please use a different number.`}
              </p>
            </div>
            
            <div className="space-y-3 w-full">
              <button 
                onClick={handleRegisterDevice}
                className="w-full bg-teal-500 rounded-lg py-3 text-white font-medium hover:bg-teal-600 transition-colors"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Verifying...
                  </div>
                ) : (
                  accountType === 'handle' ? "Sign In As Owner" : "Sign In To Existing Account"
                )}
              </button>
              
              <button
                onClick={handleNotMyAccount}
                className="w-full bg-gray-800 hover:bg-gray-700 rounded-lg py-3 text-white font-medium transition-colors"
              >
                {accountType === 'handle' ? 'Choose Different Handle' : 'Use Different Number'}
              </button>
            </div>
          </div>
        )}

        {!showExistingAccountAlert && (
          <>
            {/* Login/Register method toggle */}
            <div className="bg-gray-800 p-1 rounded-lg flex mb-6">
              <button
                onClick={() => handleLoginMethodSelect('handle')}
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-md transition-colors ${
                  loginMethod === 'handle' 
                    ? 'bg-teal-600 text-white' 
                    : 'bg-transparent text-gray-400 hover:text-white'
                }`}
              >
                <User size={18} />
                <span>Handle</span>
              </button>
              <button
                onClick={() => handleLoginMethodSelect('phone')}
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-md transition-colors ${
                  loginMethod === 'phone' 
                    ? 'bg-teal-600 text-white' 
                    : 'bg-transparent text-gray-400 hover:text-white'
                }`}
              >
                <Phone size={18} />
                <span>Phone</span>
              </button>
            </div>

            <div className="relative">
              {loginMethod === 'phone' ? (
                <div className="flex">
                  <button 
                    onClick={() => setShowCountrySelect(!showCountrySelect)}
                    className="bg-gray-800 rounded-l-lg py-4 px-4 flex items-center gap-2 border-r border-gray-700"
                    disabled={isLoading}
                  >
                    {countryCode === '+44' ? '🇬🇧' : '🇸🇬'} {countryCode} <ChevronDown size={16} className="text-gray-400" />
                  </button>
                  
                  <input
                    type="tel"
                    value={formatPhoneDisplay(phoneNumber)}
                    onChange={handlePhoneInput}
                    placeholder={countryCode === '+44' ? "7XXX XXX XXX" : "XXXX XXXX"}
                    className="flex-1 bg-gray-800 border-0 rounded-r-lg py-4 px-6 text-lg
                             focus:ring-2 focus:ring-teal-500 focus:outline-none"
                    disabled={isLoading}
                    autoFocus
                  />
                </div>
              ) : (
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
                    <span className="text-gray-400">@</span>
                  </div>
                  <input
                    type="text"
                    value={identifier.replace('@', '')}
                    onChange={(e) => setIdentifier('@' + e.target.value.replace('@', ''))}
                    placeholder="username"
                    className="w-full bg-gray-800 border-0 rounded-lg py-4 pl-10 pr-6 text-lg
                             focus:ring-2 focus:ring-teal-500 focus:outline-none"
                    disabled={isLoading}
                    autoFocus
                  />
                </div>
              )}

              {showCountrySelect && (
                <div className="absolute mt-2 w-40 bg-gray-800 rounded-lg shadow-lg z-10 overflow-hidden">
                  <button 
                    onClick={() => {
                      setCountryCode('+44');
                      setShowCountrySelect(false);
                      setPhoneNumber('');
                    }}
                    className="w-full px-4 py-3 text-left hover:bg-gray-700 flex items-center gap-2 transition-colors"
                  >
                    🇬🇧 United Kingdom
                  </button>
                  <button 
                    onClick={() => {
                      setCountryCode('+65');
                      setShowCountrySelect(false);
                      setPhoneNumber('');
                    }}
                    className="w-full px-4 py-3 text-left hover:bg-gray-700 flex items-center gap-2 transition-colors"
                  >
                    🇸🇬 Singapore
                  </button>
                </div>
              )}
            </div>

            <button
              onClick={handleInitialSubmit}
              disabled={
                isLoading ||
                !identifier ||
                (loginMethod === 'handle' ? !validateHandle() : !validatePhoneNumber())
              }
              className="w-full bg-teal-500 text-white rounded-lg py-4 font-medium
                      disabled:opacity-50 disabled:cursor-not-allowed
                      hover:bg-teal-600 transition-colors flex items-center justify-center"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Processing...
                </div>
              ) : (
                <span className="flex items-center">
                  Continue <ArrowRight size={18} className="ml-2" />
                </span>
              )}
            </button>
          </>
        )}

        {error && !showExistingAccountAlert && (
          <div className="text-red-500 text-center flex items-center justify-center p-3 bg-red-500 bg-opacity-10 rounded-lg">
            <Lock size={16} className="mr-2" />
            <span>{error}</span>
            <button onClick={() => setError('')} className="ml-2">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );

  // Render handle entry for registration (after phone verification)
  const renderHandleEntry = () => (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Create your handle</h1>
          <p className="text-gray-400">Choose a unique username to identify yourself</p>
        </div>

        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
            <span className="text-gray-400">@</span>
          </div>
          <input
            type="text"
            value={identifier.replace('@', '')}
            onChange={(e) => setIdentifier('@' + e.target.value.replace('@', ''))}
            placeholder="username"
            className="w-full bg-gray-800 border-0 rounded-lg py-4 pl-10 pr-6 text-lg
                     focus:ring-2 focus:ring-teal-500 focus:outline-none"
            disabled={isLoading}
            autoFocus
          />
        </div>

        <button
          onClick={() => {
            setHandle(identifier);
            
            if (isHandleFirst) {
              // If we're in handle-first flow, go to phone entry next
              setFlowState('phoneEntry');
            } else {
              // If we're in phone-first flow, proceed with handle submission
              handleHandleSubmit();
            }
          }}
          disabled={isLoading || !validateHandle()}
          className="w-full bg-teal-500 text-white rounded-lg py-4 font-medium
                   disabled:opacity-50 disabled:cursor-not-allowed
                   hover:bg-teal-600 transition-colors flex items-center justify-center"
        >
          {isLoading ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              Processing...
            </div>
          ) : (
            <span className="flex items-center">
              Continue <ArrowRight size={18} className="ml-2" />
            </span>
          )}
        </button>

        {error && (
          <div className="text-red-500 text-center flex items-center justify-center p-3 bg-red-500 bg-opacity-10 rounded-lg">
            <span>{error}</span>
            <button onClick={() => setError('')} className="ml-2">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );

  // Render phone entry (after handle entry for new users)
  const renderPhoneEntry = () => (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Enter your phone</h1>
          <p className="text-gray-400">
            We'll send a verification code to verify your number
          </p>
        </div>

        <div className="flex mb-2">
          <button 
            onClick={() => setShowCountrySelect(!showCountrySelect)}
            className="bg-gray-800 rounded-l-lg py-4 px-4 flex items-center gap-2 border-r border-gray-700"
            disabled={isLoading}
          >
            {countryCode === '+44' ? '🇬🇧' : '🇸🇬'} {countryCode} <ChevronDown size={16} className="text-gray-400" />
          </button>
          
          <input
            type="tel"
            value={formatPhoneDisplay(phoneNumber)}
            onChange={handlePhoneInput}
            placeholder={countryCode === '+44' ? "7XXX XXX XXX" : "XXXX XXXX"}
            className="flex-1 bg-gray-800 border-0 rounded-r-lg py-4 px-6 text-lg
                     focus:ring-2 focus:ring-teal-500 focus:outline-none"
            disabled={isLoading}
            autoFocus
          />
        </div>

        {showCountrySelect && (
          <div className="absolute mt-2 w-40 bg-gray-800 rounded-lg shadow-lg z-10 overflow-hidden">
            <button 
              onClick={() => {
                setCountryCode('+44');
                setShowCountrySelect(false);
                setPhoneNumber('');
              }}
              className="w-full px-4 py-3 text-left hover:bg-gray-700 flex items-center gap-2 transition-colors"
            >
              🇬🇧 United Kingdom
            </button>
            <button 
              onClick={() => {
                setCountryCode('+65');
                setShowCountrySelect(false);
                setPhoneNumber('');
              }}
              className="w-full px-4 py-3 text-left hover:bg-gray-700 flex items-center gap-2 transition-colors"
            >
              🇸🇬 Singapore
            </button>
          </div>
        )}

        <button
          onClick={handlePhoneSubmit}
          disabled={isLoading || !validatePhoneNumber()}
          className="w-full bg-teal-500 text-white rounded-lg py-4 font-medium
                   disabled:opacity-50 disabled:cursor-not-allowed
                   hover:bg-teal-600 transition-colors flex items-center justify-center"
        >
          {isLoading ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              Sending code...
            </div>
          ) : (
            <span className="flex items-center">
              Send Verification Code <ArrowRight size={18} className="ml-2" />
            </span>
          )}
        </button>

        <button
          onClick={() => setFlowState('handleEntry')}
          className="w-full bg-gray-800 text-white rounded-lg py-4 font-medium
                   hover:bg-gray-700 transition-colors mt-4"
          disabled={isLoading}
        >
          Back
        </button>

        {error && (
          <div className="text-red-500 text-center flex items-center justify-center p-3 bg-red-500 bg-opacity-10 rounded-lg">
            <span>{error}</span>
            <button onClick={() => setError('')} className="ml-2">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );

  // Render handle creation (after phone verification for new users)
  const renderCreateHandle = () => (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Create your handle</h1>
          <p className="text-gray-400">This will be your unique identifier</p>
        </div>

        <div>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
              <span className="text-gray-400">@</span>
            </div>
            <input
              type="text"
              value={handle.replace('@', '')}
              onChange={(e) => setHandle('@' + e.target.value.replace('@', ''))}
              placeholder="username"
              className="w-full bg-gray-800 border-0 rounded-lg py-4 pl-10 pr-6 text-lg
                       focus:ring-2 focus:ring-teal-500 focus:outline-none"
              disabled={isLoading}
              autoFocus
            />
          </div>
          <p className="text-xs text-gray-400 mt-2 pl-2">
            Handle must start with @ and contain only letters, numbers, and underscores
          </p>
        </div>

        <button
          onClick={handleHandleSubmit}
          disabled={!handle || handle.length < 2 || isLoading || !handle.match(/^@[a-zA-Z0-9_]{1,29}$/)}
          className="w-full bg-teal-500 text-white rounded-lg py-4 font-medium
                   disabled:opacity-50 disabled:cursor-not-allowed
                   hover:bg-teal-600 transition-colors flex items-center justify-center"
        >
          {isLoading ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              Setting up your account...
            </div>
          ) : (
            <span className="flex items-center">
              Create Handle <ArrowRight size={18} className="ml-2" />
            </span>
          )}
        </button>

        {error && (
          <div className="text-red-500 text-center flex items-center justify-center p-3 bg-red-500 bg-opacity-10 rounded-lg">
            <span>{error}</span>
            <button onClick={() => setError('')} className="ml-2">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );

  // Render handle suggestions - IMPROVED UI
  const renderHandleSuggestions = () => (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header with back button */}
        <div className="flex items-center mb-6">
          <button 
            onClick={() => setFlowState('loginOptions')}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-xl font-medium ml-4">Choose a handle</h1>
        </div>
        
        {/* Circular icon */}
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 rounded-full bg-teal-500 flex items-center justify-center">
            <span className="text-2xl font-bold">@</span>
          </div>
        </div>
        
        {/* Message */}
        <p className="text-center text-gray-400 mb-6">
          The handle you selected is already taken. Here are some available alternatives:
        </p>
        
        {/* Handle suggestions - FIXED: Now moves forward in the flow */}
        <div className="space-y-2 mb-6">
          {suggestedHandles.map((handle, index) => (
            <div 
              key={index}
              onClick={() => {
                setHandle(handle);
                setIsHandleFirst(true);
                setFlowState('phoneEntry'); // Move forward to phone entry
              }}
              className="bg-gray-800 rounded-lg p-4 hover:bg-gray-700 transition-all 
                       transform hover:translate-x-1 cursor-pointer"
            >
              <div className="flex items-center justify-between">
                <span className="font-medium">{handle}</span>
                <ArrowRight size={16} className="text-teal-500" />
              </div>
            </div>
          ))}
        </div>
        
        {/* Custom handle input - FIXED: Now moves forward in the flow */}
        <div className="mt-8">
          <p className="text-sm text-gray-400 mb-2">Or create your own handle:</p>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <span className="text-gray-400">@</span>
            </div>
            <input
              type="text"
              value={customHandle || ''}
              onChange={(e) => setCustomHandle(e.target.value.replace('@', ''))}
              placeholder="username"
              className="w-full bg-gray-800 border border-gray-700 rounded-lg py-3 pl-8 pr-3
                       focus:ring-2 focus:ring-teal-500 focus:border-transparent focus:outline-none"
            />
          </div>
          
          <button
            onClick={() => {
              if (customHandle) {
                const customHandleWithAt = '@' + customHandle;
                setHandle(customHandleWithAt);
                setIsHandleFirst(true);
                setFlowState('phoneEntry'); // Move forward to phone entry
              }
            }}
            disabled={!customHandle}
            className="w-full bg-teal-500 text-white rounded-lg py-3 mt-3 font-medium
                     hover:bg-teal-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            <span className="flex items-center">
              Continue <ArrowRight size={18} className="ml-2" />
            </span>
          </button>
        </div>
      </div>
    </div>
  );

  // Render device registration confirmation with improved UI
  const renderDeviceRegistration = () => {
    const isPhoneFlow = loginMethod === 'phone';
    const buttonText = isPhoneFlow ? "Use Different Number" : "Choose Different Handle";
    
    return (
      <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-md space-y-6">
          <div className="mb-8 flex justify-center">
            <div className="w-16 h-16 rounded-full bg-teal-500 flex items-center justify-center text-xl font-bold">
              {existingUserData?.handle ? existingUserData.handle[0].toUpperCase() : (identifier.startsWith('@') ? identifier[1].toUpperCase() : 'S')}
            </div>
          </div>
          
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-2">
              {isPhoneFlow ? "Phone Number Already Registered" : "This Handle Is Already Registered"}
            </h2>
            <p className="text-gray-400 mb-6">
              {isPhoneFlow 
                ? `This phone number is associated with an existing account. If this is your account, you can sign in. Otherwise, please use a different number.` 
                : `The handle ${existingUserData?.masked_handle || maskHandle(identifier)} is already in use. Are you the owner of this account or would you like to choose a different handle?`}
            </p>
          </div>
          
          <div className="space-y-4">
            <button
              ref={yesButtonRef}
              onClick={handleRegisterDevice}
              disabled={isLoading}
              className="w-full bg-teal-500 text-white rounded-lg py-4 font-medium hover:bg-teal-600 transition-colors disabled:opacity-50 flex items-center justify-center"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Processing...
                </div>
              ) : (
                <span className="flex items-center">
                  {isPhoneFlow ? "Sign In To Existing Account" : "Sign In As Owner"} <ArrowRight size={18} className="ml-2" />
                </span>
              )}
            </button>
            
            <button
              ref={noButtonRef}
              onClick={handleNotMyAccount}
              disabled={isLoading}
              className="w-full bg-gray-800 text-white rounded-lg py-4 font-medium hover:bg-gray-700 transition-colors"
            >
              {buttonText}
            </button>
          </div>
          
          {error && (
            <div className="text-red-500 text-center flex items-center justify-center p-3 bg-red-500 bg-opacity-10 rounded-lg">
              <span>{error}</span>
              <button onClick={() => setError('')} className="ml-2">
                <X className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    );
  };

  // Main render - return the appropriate component based on flow state
  return (
    <>
      {flowState === 'checking' && renderLoadingState()}
      {flowState === 'deviceRegistered' && renderDeviceRegistered()}
      {flowState === 'loginSuccess' && renderLoginSuccess()}
      {flowState === 'deviceNotRegistered' && renderDeviceNotRegistered()}
      {flowState === 'loginOptions' && renderLoginOptions()}
      {flowState === 'handleEntry' && renderHandleEntry()}
      {flowState === 'phoneEntry' && renderPhoneEntry()}
      {flowState === 'deviceRegistration' && renderDeviceRegistration()}
      {flowState === 'verification' && renderVerificationStep()}
      {flowState === 'createHandle' && renderCreateHandle()}
      {flowState === 'handleSuggestions' && renderHandleSuggestions()}
    </>
  );
};

module.exports = UnifiedLogin;
