const React = require('react');
const { useState, useEffect, useRef, useCallback } = require('react');
const { X, Phone, User, ArrowRight, Check, ArrowLeft, ChevronDown, Lock } = require('lucide-react');
const axios = require('../../config/axios').default;

// Now add our new imports
import { localDbService } from '../../services/localDbService';
import { syncService } from '../../services/syncService';
import { 
  verifyPinOffline, 
  checkOfflineAuthentication,
  initOfflineMode 
} from '../../utils/deviceKey';

const {
  generateDeviceKey,
  getStoredDeviceKey,
  storeDeviceKey,
  storeDeviceSessionData,
  clearDeviceSession,
  // Include the fingerprinting functions
  getDeviceFingerprint,
  generateDeviceHeader,
  getDeviceHeader,
  getCompleteDeviceHeaderFromStorage,
  // WebAuthn functions
  registerWebAuthnCredential,
  verifyWebAuthnCredential,
  isWebAuthnSupported
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
    - pinEntry: user is entering PIN for verification
    - registrationTransition: transition from login to register when handle is available
    - verificationSuccess: showing success message after verification
    - registration: explicit registration flow
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
  const [isDeviceCheckRunning, setIsDeviceCheckRunning] = useState(false);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
const [syncStatus, setSyncStatus] = useState('idle'); // 'idle', 'syncing', 'success', 'error'
const [offlineReady, setOfflineReady] = useState(false); // Track if offline DB is ready

// Network status monitoring
useEffect(() => {
  const handleOnline = () => {
    setIsOffline(false);
    // Attempt to sync changes when coming back online
    if (offlineReady) {
      setSyncStatus('syncing');
      syncService.syncChanges()
        .then(result => {
          setSyncStatus(result.status === 'success' ? 'success' : 'error');
          setTimeout(() => setSyncStatus('idle'), 3000);
        })
        .catch(() => {
          setSyncStatus('error');
          setTimeout(() => setSyncStatus('idle'), 3000);
        });
    }
  };
  
  const handleOffline = () => {
    setIsOffline(true);
  };
  
// Add this near the top with other const functions
const validateAuthVersion = async () => {
  // Simplified version that just checks both auth tokens exist
  const isAuthenticated = localStorage.getItem('authenticated_user') === 'true';
  const hasAuthVersion = localStorage.getItem('auth_version') !== null;
  
  // Both must exist for valid auth state
  return isAuthenticated && hasAuthVersion;
};

  // Add custom event listeners for sync status from syncService
  const handleSyncStart = () => setSyncStatus('syncing');
  const handleSyncSuccess = () => {
    setSyncStatus('success');
    setTimeout(() => setSyncStatus('idle'), 3000);
  };
  const handleSyncError = () => {
    setSyncStatus('error');
    setTimeout(() => setSyncStatus('idle'), 3000);
  };
  
  window.addEventListener('online', handleOnline);
  window.addEventListener('offline', handleOffline);
  window.addEventListener('superapp:sync-start', handleSyncStart);
  window.addEventListener('superapp:sync-success', handleSyncSuccess);
  window.addEventListener('superapp:sync-error', handleSyncError);
  
  // Initial status check
  setIsOffline(!navigator.onLine);
  
  return () => {
    window.removeEventListener('online', handleOnline);
    window.removeEventListener('offline', handleOffline);
    window.removeEventListener('superapp:sync-start', handleSyncStart);
    window.removeEventListener('superapp:sync-success', handleSyncSuccess);
    window.removeEventListener('superapp:sync-error', handleSyncError);
  };
}, [offlineReady]);

// Initialize offline support
useEffect(() => {
  const initOfflineSupport = async () => {
    try {
      const initialized = await initOfflineMode();
      console.log('Offline mode initialized:', initialized);
      setOfflineReady(initialized);
      
      // If we're online at startup, sync any pending changes
      if (navigator.onLine && initialized) {
        syncService.syncChanges();
      }
    } catch (err) {
      console.error('Failed to initialize offline mode:', err);
    }
  };
  
  initOfflineSupport();
}, []);


  // Initialize deviceChannel safely
  const deviceChannelRef = useRef(null);
  
  // PIN-related states
  const [showPinEntry, setShowPinEntry] = useState(false);
  const [pinAvailable, setPinAvailable] = useState(false);
  const [pin, setPin] = useState('');
  const [pinAttempts, setPinAttempts] = useState(0);
  
  // New states for improved user flows
  const [isRegistrationFlow, setIsRegistrationFlow] = useState(false);
  const [isVerificationSuccess, setIsVerificationSuccess] = useState(false);
  
  // WebAuthn toggle - set to false to temporarily disable WebAuthn
  const [webAuthnEnabled, setWebAuthnEnabled] = useState(false);
  
  // Add loading timeout reference for safety cleanup
  const loadingTimeoutRef = useRef(null);
  
  const verificationInputRef = useRef(null); // Added for focusing the verification input
  const yesButtonRef = useRef(null); // Added for the device registration screen
  const noButtonRef = useRef(null); // Added for the device registration screen
  const MAX_REDIRECT_ATTEMPTS = 3;

  // ENHANCED: Get existing complete device header for cross-browser authentication
  const getExistingCompleteHeader = () => {
    try {
      const headerString = localStorage.getItem('superapp_device_header');
      if (!headerString) {
        console.log('No device header found in localStorage');
        return null;
      }
      
      const parsedHeader = JSON.parse(headerString);
      
      // CRITICAL: Validate it has ALL required fields
      if (parsedHeader.deviceId && parsedHeader.userGuid && parsedHeader.userHandle) {
        console.log('Found complete device header for cross-browser auth:', {
          deviceId: parsedHeader.deviceId.substring(0, 10) + '...',
          userGuid: parsedHeader.userGuid,
          userHandle: parsedHeader.userHandle
        });
        return parsedHeader;
      } else {
        console.warn('Found incomplete device header (missing required fields):', {
          hasDeviceId: !!parsedHeader.deviceId,
          hasUserGuid: !!parsedHeader.userGuid,
          hasUserHandle: !!parsedHeader.userHandle
        });
        console.warn('Cannot use incomplete header for cross-browser authentication');
        return null;
      }
    } catch (e) {
      console.error('Error parsing stored device header:', e);
      return null;
    }
  };

  // NEW FUNCTION: Check for existing device header from another browser
  const getExistingDeviceHeader = () => {
    try {
      const headerString = localStorage.getItem('superapp_device_header');
      if (!headerString) {
        console.log('No existing device header found in localStorage');
        return null;
      }
      
      const parsedHeader = JSON.parse(headerString);
      
      // Validate it has all required fields
      if (parsedHeader.deviceId && parsedHeader.userGuid && parsedHeader.userHandle) {
        console.log('Found complete device header from previous browser session:', {
          deviceId: parsedHeader.deviceId.substring(0, 10) + '...',
          userGuid: parsedHeader.userGuid,
          userHandle: parsedHeader.userHandle
        });
        return parsedHeader;
      } else {
        console.warn('Found incomplete device header, ignoring it:', {
          hasDeviceId: !!parsedHeader.deviceId,
          hasUserGuid: !!parsedHeader.userGuid,
          hasUserHandle: !!parsedHeader.userHandle
        });
        return null;
      }
    } catch (e) {
      console.error('Error parsing stored device header:', e);
      return null;
    }
  };

  // Helper function to ensure device header is properly created
  const ensureDeviceHeaderCreated = (authData) => {
    console.log('Ensuring device header is properly created with all fields');
    
    if (!authData || !authData.device_key || !authData.guid || !authData.handle) {
      console.warn('Missing required auth data fields for device header:',
                  {
                    hasDeviceKey: !!authData?.device_key,
                    hasGuid: !!authData?.guid,
                    hasHandle: !!authData?.handle
                  });
      return false;
    }
    
    // Log what's currently in localStorage
    console.log('Current localStorage header:', localStorage.getItem('superapp_device_header'));
    
    // Generate and store the device header
    console.log('Creating explicit device header with data:', {
      deviceId: authData.device_key.substring(0, 10) + '...',
      userGuid: authData.guid,
      userHandle: authData.handle
    });
    
    // Use generateDeviceHeader directly
    const headerStored = generateDeviceHeader(
      authData.device_key,
      authData.guid,
      authData.handle
    );
    
    if (headerStored) {
      console.log('Successfully stored explicit device header');
      console.log('AFTER AUTH SUCCESS - Device header content:', 
        localStorage.getItem('superapp_device_header'));
    } else {
      console.warn('Failed to store explicit device header');
      return false;
    }
  };
  
  // NEW FUNCTION: Store verification success status
  const storeVerificationSuccess = () => {
    localStorage.setItem('device_verified', 'true');
    localStorage.setItem('last_verification', Date.now().toString());
    setFlowState('verificationSuccess');
    
    // Redirect after brief delay
    setTimeout(() => {
      window.location.href = '/dashboard';
    }, 2000);
  };
  
// Replace the existing useEffect that checks for authenticated state
useEffect(() => {
  console.log('Checking authentication status');
const checkAuthStatus = async () => {
const now = Date.now();
const lastCheckTime = parseInt(sessionStorage.getItem('last_auth_check') || '0');
    
// Prevent too-frequent auth checks (3 second minimum gap)
if (now - lastCheckTime < 3000) {
  console.log('Auth check ran too recently, skipping to prevent loops');
  return;
}

// Record this check
sessionStorage.setItem('last_auth_check', now.toString());

  // NEW: Prevent loops by checking pathname and redirect count
  if (window.location.pathname === '/dashboard') {
    console.log('Already on dashboard, skipping auth check');
    return;
  }
  
  // Check for too many redirects (potential loop)
  const redirectCount = parseInt(sessionStorage.getItem('redirect_count') || '0');
  if (redirectCount > 2) {
    console.warn('Too many redirects detected, clearing auth state');
    localStorage.removeItem('authenticated_user');
    localStorage.removeItem('auth_version');
    sessionStorage.removeItem('redirect_count');
    checkDevice(); // Continue with device check
    return;
  }
  
  // Proceed with normal auth check
  if (localStorage.getItem('authenticated_user') === 'true' &&
      !localStorage.getItem('logout_state')) {
    
    // Validate auth version before redirecting
    if (await validateAuthVersion()) {
      console.log('Authentication valid, redirecting to dashboard');
      
      // Track redirect count to detect loops
      sessionStorage.setItem('redirect_count', (redirectCount + 1).toString());
      
      if (window.location.pathname !== '/dashboard') {
        window.location.href = '/dashboard';
        return;
      }
    } else {
      console.warn('Auth version invalid, clearing storage');
      localStorage.removeItem('authenticated_user');
      localStorage.removeItem('auth_version');
      localStorage.setItem('device_reset', 'true');
    }
  }
  checkDevice();
};
// Execute the function
  checkAuthStatus();
}, []); // Empty dependency array

  // Initialize the channel safely in a useEffect
  useEffect(() => {
    try {
      deviceChannelRef.current = new BroadcastChannel('superapp_device_channel');
      console.log('BroadcastChannel initialized');
    } catch (e) {
      console.warn('BroadcastChannel not supported in this browser');
      // Create a dummy channel that does nothing
      deviceChannelRef.current = {
        postMessage: () => {},
        close: () => {}
      };
    }
    
    return () => {
      try {
        if (deviceChannelRef.current && deviceChannelRef.current.close) {
          deviceChannelRef.current.close();
        }
      } catch (e) {
        console.error('Error closing channel:', e);
      }
    };
  }, []);

  // Define handleRegisterDevice and handleNotMyAccount as useCallback functions
  // so they maintain consistent references for the useEffect
  const handleRegisterDevice = useCallback(async () => {
    console.log("handleRegisterDevice called");
    
    // Prevent duplicate calls
    if (isLoading) {
      console.log("Already loading, ignoring duplicate call");
      return;
    }
    
    // IMPORTANT: Reset PIN entry state to prevent both screens showing
    setShowPinEntry(false);
    
    // Immediately transition to verification for better UX
    setFlowState('verification');
    setWelcomeMessage(`Verify it's you, ${existingUserData?.handle || ''}`);
    setIsLoading(true);
    setError('');
    
    // Set a safety timeout to reset loading state
    const safetyTimeout = setTimeout(() => {
      setIsLoading(false);
      setError("Request timed out. Please try again.");
    }, 15000);
    
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
        clearTimeout(safetyTimeout);
        setIsLoading(false);
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
      
      // MODIFIED: Check for existing COMPLETE device header
      const completeHeader = getExistingCompleteHeader();
      
      // MODIFIED: Create headers prioritizing complete header for cross-browser auth
      const requestHeaders = {
        'X-CSRF-Token': csrfToken
      };
      
      if (completeHeader) {
        console.log('Using complete device header for device registration:', {
          deviceId: completeHeader.deviceId.substring(0, 10) + '...',
          userGuid: completeHeader.userGuid,
          userHandle: completeHeader.userHandle
        });
        requestHeaders['X-Device-Header'] = JSON.stringify(completeHeader);
      } else {
        // Create a basic device header if no complete one exists
        // NOTE: This won't be used for cross-browser auth, just fingerprinting
        console.log('No complete header found - using basic header for fingerprinting only');
        const deviceCharacteristics = {
          platform: navigator.platform || 'unknown',
          screenWidth: window.screen.width,
          screenHeight: window.screen.height,
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          language: navigator.language || 'unknown'
        };
        
        const basicHeader = {
          deviceId: deviceKey,
          deviceCharacteristics: deviceCharacteristics,
          timestamp: Date.now()
        };
        requestHeaders['X-Device-Header'] = JSON.stringify(basicHeader);
      }
      
      if (deviceKey) {
        requestHeaders['X-Device-Key'] = deviceKey;
      }
      
      // Use the configured axios instance for API calls
      console.log("Sending verify_login request with device_registration=true");
      const response = await axios.post('verify_login', {
        identifier: userIdentifier,
        device_registration: true,
        auth: {
          identifier: userIdentifier,
          device_registration: true
        }
      }, {
        headers: requestHeaders,
        timeout: 15000 // Add timeout to prevent hanging requests
      });
      
      console.log('Device registration response:', response.data);
      
      if (response.data.status === 'verification_needed') {
        // Store the pending device path - THIS IS THE CRITICAL MISSING PIECE
        if (response.data.pending_device_path) {
          sessionStorage.setItem('pending_device_path', response.data.pending_device_path);
        }
        
        setPhone(response.data.masked_phone || phone);
        setHandle(response.data.handle || handle);
        setWelcomeMessage(`Verify it's you, ${response.data.handle || ''}`);
        
        // Store in sessionStorage for persistence
        sessionStorage.setItem('current_handle', response.data.handle);
        sessionStorage.setItem('verification_in_progress', 'true');
        sessionStorage.setItem('device_registration_flow', 'true'); // Important flag
        sessionStorage.setItem('pending_verification', 'true'); // Add this flag
      } else if (response.data.status === 'error') {
        setError(response.data.message || 'Registration failed. Please try again.');
      } else {
        console.warn('Unexpected response status:', response.data.status);
        setError('Unable to process request. Please try again.');
      }
    } catch (err) {
      console.error('Device registration error:', err);
      console.error('Error details:', {
        message: err.message,
        stack: err.stack,
        response: err.response?.data,
        status: err.response?.status
      });
      
      setError('Failed to register device. Please try again.');
    } 
    clearTimeout(safetyTimeout);
    setIsLoading(false);
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
// Safe version with fallback
if (response.data && response.data.auth_version) {
  localStorage.setItem('auth_version', response.data.auth_version.toString());
} else if (response.auth_version) {
  // Fallback for direct access pattern
  localStorage.setItem('auth_version', response.auth_version.toString());
}
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
          masked_phone: data.masked_phone,
          pin_available: data.pin_available || false
        });
        
        // Set PIN availability
        setPinAvailable(data.pin_available || false);
        
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
  }, []);

  // Add storage event listener useEffect
useEffect(() => {
  // Handle storage events for cross-tab communication
  const handleStorageChange = (e) => {
    // Authentication completed in another tab
    if (e.key === 'authenticated_user' && e.newValue === 'true') {
      console.log('Authentication detected in another tab');
      
      // Only redirect if we're not already on dashboard and not in the middle of our own auth flow
      if (window.location.pathname !== '/dashboard' && 
          flowState !== 'verification' && 
          flowState !== 'pinEntry' && 
          !isLoading) {
        window.location.href = '/dashboard';
      }
    }
    
    // Logout happened in another tab
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
}, [flowState, isLoading]);

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

  // Auto-submit PIN when complete
  useEffect(() => {
    if (pin.length === 4 && flowState === 'pinEntry' && !isLoading) {
      handlePinVerification();
    }
  }, [pin, flowState, isLoading]);

  // Safety cleanup for any lingering loading states
  useEffect(() => {
    const safetyTimeout = setTimeout(() => {
      if (isLoading) {
        console.log('Safety timeout triggered - resetting loading state');
        setIsLoading(false);
      }
    }, 20000); // 20 second safety timeout
    
    return () => clearTimeout(safetyTimeout);
  }, [isLoading]);

// Main device check function - determines initial flow state
const checkDevice = async () => {
  console.log('Starting device check...');
  
  // Skip if already authenticated
  if (localStorage.getItem('authenticated_user') === 'true' && 
      !localStorage.getItem('logout_state')) {
    console.log('Already authenticated, skipping device check');
    if (window.location.pathname !== '/dashboard') {
      window.location.href = '/dashboard';
    }
    return;
  }

  // Simple tab-aware loop detection
  const redirectCount = parseInt(sessionStorage.getItem('redirect_count') || '0');
  if (redirectCount > 3) {
    console.log('Detected potential redirect loop, stopping authentication check');
    localStorage.setItem('loop_detected', 'true');
    setFlowState('loginOptions');
    return;
  }

  // Track this attempt
  sessionStorage.setItem('redirect_count', (redirectCount + 1).toString());

  // After 5 seconds, clear the counter to allow future attempts
  setTimeout(() => {
    const currentCount = parseInt(sessionStorage.getItem('redirect_count') || '0');
    if (currentCount <= redirectCount + 1) {
      sessionStorage.removeItem('redirect_count');
    }
  }, 5000);
  
  // Skip if another tab is already checking
  if (isDeviceCheckRunning) {
    console.log('Device check already running in another tab');
    return;
  }
  
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

  // Announce we're starting a check
  if (deviceChannelRef.current) {
    try {
      deviceChannelRef.current.postMessage({type: 'device_check_started'});
    } catch (e) {
      console.warn('Error posting message:', e);
    }
  }
  setIsDeviceCheckRunning(true);

  // Set a safety timeout
  const safetyTimeout = setTimeout(() => {
    console.log('Device check safety timeout triggered');
    setIsLoading(false);
    setFlowState('loginOptions');
    setDeviceNotRegistered(true);
    setError('Connection timeout. Please try again.');
    
    // Announce completion even on timeout
    if (deviceChannelRef.current) {
      try {
        deviceChannelRef.current.postMessage({
          type: 'device_check_completed',
          authenticated: false,
          error: 'timeout'
        });
      } catch (e) {
        console.warn('Error posting message:', e);
      }
    }
    setIsDeviceCheckRunning(false);
  }, 15000);

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
      clearTimeout(safetyTimeout);
      
      // Announce completion
      if (deviceChannelRef.current) {
        try {
          deviceChannelRef.current.postMessage({
            type: 'device_check_completed',
            authenticated: false,
            verification_in_progress: true
          });
        } catch (e) {
          console.warn('Error posting message:', e);
        }
      }
      setIsDeviceCheckRunning(false);
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

    // MODIFIED: Check for existing COMPLETE device header for cross-browser auth
    const completeHeader = getExistingCompleteHeader();
    
    console.log('Sending device check request with key:', deviceKey?.substring(0, 10) + '...');
    
    // MODIFIED: Create headers prioritizing complete header for cross-browser auth
    const requestHeaders = {};
    
    if (completeHeader) {
      console.log('Using complete device header with all required fields for cross-browser authentication');
      requestHeaders['X-Device-Header'] = JSON.stringify(completeHeader);
      
      // If we have a complete header but no device key, prioritize the header's deviceId
      if (!deviceKey && completeHeader.deviceId) {
        deviceKey = completeHeader.deviceId;
        storeDeviceKey(deviceKey);
        console.log('Using deviceId from existing header:', deviceKey.substring(0, 10) + '...');
      }
    } else {
      // Get fingerprint for device recognition if no complete header
      console.log('No complete header found - using device fingerprint for recognition only');
      const deviceFingerprint = await getDeviceFingerprint();
      if (deviceFingerprint) {
        console.log('Using basic device fingerprint');
        try {
          const fingerprint = JSON.parse(deviceFingerprint);
          const basicHeader = {
            deviceId: deviceKey,
            deviceCharacteristics: fingerprint,
            timestamp: Date.now()
          };
          requestHeaders['X-Device-Header'] = JSON.stringify(basicHeader);
        } catch (e) {
          console.error('Error parsing device fingerprint:', e);
        }
      }
    }
    
    if (deviceKey) {
      requestHeaders['X-Device-Key'] = deviceKey;
    }
    
    const response = await axios.post('check_device', {}, {
      timeout: 10000, // Add timeout to prevent hanging requests
      headers: requestHeaders
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
      clearTimeout(safetyTimeout);
      setIsLoading(false);
      
      // Announce completion
      if (deviceChannelRef.current) {
        try {
          deviceChannelRef.current.postMessage({
            type: 'device_check_completed',
            authenticated: false,
            logged_out: true
          });
        } catch (e) {
          console.warn('Error posting message:', e);
        }
      }
      setIsDeviceCheckRunning(false);
      return;
    }

    // Follow flowchart states based on response
    if (response.data.status === 'authenticated') {
      // Device is registered and recently verified - go to dashboard
      console.log('Device authenticated, redirecting to dashboard');
      storeDeviceSessionData(response.data);
      
      // ENHANCED: Ensure device header exists for cross-browser auth
      ensureDeviceHeaderCreated(response.data);
    
      console.log('AFTER AUTH SUCCESS - Device header content:', localStorage.getItem('superapp_device_header'));

      // FIX: Set localStorage flag to prevent tab loops
      localStorage.setItem('authenticated_user', 'true');
// Safe version with fallback
if (response.data && response.data.auth_version) {
  localStorage.setItem('auth_version', response.data.auth_version.toString());
} else if (response.auth_version) {
  // Fallback for direct access pattern
  localStorage.setItem('auth_version', response.auth_version.toString());
}
      // Clear any redirect counters to prevent loop detection triggering
      sessionStorage.removeItem('redirect_count');
      
      setFlowState('loginSuccess');
      
      // VERIFY DEVICE HEADER STORAGE
      console.log('Authentication success - verifying device header storage');
      const headerExists = !!localStorage.getItem('superapp_device_header');
      console.log('Device header in localStorage:', headerExists ? 'YES' : 'NO');

      if (!headerExists && response.data.device_key && response.data.guid && response.data.handle) {
        console.log('FALLBACK: Device header missing - forcing creation');
        // Force creation of device header as fallback
        const headerData = {
          deviceId: response.data.device_key,
          userGuid: response.data.guid,
          userHandle: response.data.handle
        };
        localStorage.setItem('superapp_device_header', JSON.stringify(headerData));
        console.log('Forced device header creation:', !!localStorage.getItem('superapp_device_header'));
      }

      // Announce completion with authenticated status
      if (deviceChannelRef.current) {
        try {
          deviceChannelRef.current.postMessage({
            type: 'device_check_completed',
            authenticated: true,
            redirect_to: response.data.redirect_to || '/dashboard'
          });
        } catch (e) {
          console.warn('Error posting message:', e);
        }
      }

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
      
      // Check if user has PIN set up
      if (response.data.pin_available) {
        setPinAvailable(true);
      }
      
      setIsLoading(false);  // Ensure loading is reset
      
      // Announce completion - needs verification
      if (deviceChannelRef.current) {
        try {
          deviceChannelRef.current.postMessage({
            type: 'device_check_completed',
            authenticated: false,
            needs_verification: true,
            handle: response.data.handle
          });
        } catch (e) {
          console.warn('Error posting message:', e);
        }
      }
    } else if (response.data.status === 'show_options') {
      // New device, no registration found
      console.log('New device or no registration found, showing login options');
      setFlowState('loginOptions');
      
      // Set device not registered flag if present
      if (response.data.device_not_registered) {
        setDeviceNotRegistered(true);
      }
      
      // Announce completion - login options
      if (deviceChannelRef.current) {
        try {
          deviceChannelRef.current.postMessage({
            type: 'device_check_completed',
            authenticated: false,
            show_options: true
          });
        } catch (e) {
          console.warn('Error posting message:', e);
        }
      }
    } else {
      // Default to login options for any other status
      console.log('Unknown status, defaulting to login options');
      if (response.data.guid) {
        sessionStorage.setItem('device_guid', response.data.guid);
      }
      setFlowState('loginOptions');
      setDeviceNotRegistered(true); // Default to showing device not registered
      
      // Announce completion - unknown status
      if (deviceChannelRef.current) {
        try {
          deviceChannelRef.current.postMessage({
            type: 'device_check_completed',
            authenticated: false,
            unknown_status: true
          });
        } catch (e) {
          console.warn('Error posting message:', e);
        }
      }
    }
  } catch (err) {
    console.error('Device check error:', err);
    console.error('Error details:', {
      message: err.message,
      response: err.response?.data,
      status: err.response?.status
    });
    
    setError('Connection error. Please try again.');
    setFlowState('loginOptions');
    setDeviceNotRegistered(true); // Show device not registered on error
    
    // Announce completion with error
    if (deviceChannelRef.current) {
      try {
        deviceChannelRef.current.postMessage({
          type: 'device_check_completed',
          authenticated: false,
          error: err.message
        });
      } catch (e) {
        console.warn('Error posting message:', e);
      }
    }
  }

  // Add cleanup code directly after the if block
  clearTimeout(safetyTimeout);
  setIsLoading(false);
  setIsDeviceCheckRunning(false);
};

//  Check if PIN is available for a user
  const checkPinAvailability = async (handleOrPhone) => {
    try {
      console.log('Checking PIN availability for:', handleOrPhone);
      
      const response = await axios.get(`check_pin_availability`, {
        params: { identifier: handleOrPhone }
      });
      
      if (response.data && response.data.pin_available) {
        console.log('PIN is available for this user');
        setPinAvailable(true);
        return true;
      } else {
        console.log('PIN is not available for this user');
        setPinAvailable(false);
        return false;
      }
    } catch (err) {
      console.error('Error checking PIN availability:', err);
      setPinAvailable(false);
      return false;
    }
  };

  // Handle PIN verification
// Handle PIN verification
const handlePinVerification = async () => {
  if (pin.length !== 4 || isLoading) return;
  
  setIsLoading(true);
  setError('');
  
  // Safety timeout
  const safetyTimeout = setTimeout(() => {
    setIsLoading(false);
    setError('Request timed out. Please try again.');
  }, 15000);
  
  try {
    // Determine the identifier (handle or phone)
    const identifier = existingUserData?.handle || handle || (loginMethod === 'handle' ? identifier : phone);
    
    if (!navigator.onLine) {
      // OFFLINE MODE - Try to verify locally
      console.log('Verifying PIN in offline mode for:', identifier);
      
      const verified = await verifyPinOffline(identifier, pin);
      
      if (verified) {
        // Get device key and check offline authentication
        const deviceKey = await getStoredDeviceKey();
        const authData = await checkOfflineAuthentication(deviceKey);
        
        if (authData) {
          // Store authentication data
          storeDeviceSessionData(authData);
          localStorage.setItem('authenticated_user', 'true');
          localStorage.setItem('offline_authenticated', 'true');
          
          // Show success and redirect
          setIsVerificationSuccess(true);
          setFlowState('verificationSuccess');
          
          setTimeout(() => {
            window.location.href = '/dashboard';
          }, 1500);
          
          clearTimeout(safetyTimeout);
          setIsLoading(false);
          return;
        }
      }
      
      // If we got here, verification failed
      setError('PIN verification failed in offline mode');
      setPin('');
      setPinAttempts(prev => prev + 1);
      clearTimeout(safetyTimeout);
      setIsLoading(false);
      return;
    }
    
    // ONLINE MODE - Existing code
    const userIdentifier = existingUserData?.handle || handle || (loginMethod === 'handle' ? identifier : phone);
    
    console.log('Verifying PIN for:', userIdentifier);
    
    // FIXED: Initialize completeHeader before using it
    const completeHeader = getCompleteDeviceHeaderFromStorage();
    
    // Get device key and prepare headers
    const deviceKey = await getStoredDeviceKey();
    const requestHeaders = {
      'X-CSRF-Token': window.csrfToken
    };

    if (completeHeader) {
      console.log('Using complete device header for PIN verification');
      requestHeaders['X-Device-Header'] = JSON.stringify(completeHeader);
    } else {
      console.log('No complete header found - creating basic header for PIN verification');
      const deviceFingerprint = await getDeviceFingerprint();
      const basicHeader = {
        deviceId: deviceKey,
        timestamp: Date.now(),
        deviceCharacteristics: deviceFingerprint
      };
      requestHeaders['X-Device-Header'] = JSON.stringify(basicHeader);
    }
    
    if (deviceKey) {
      requestHeaders['X-Device-Key'] = deviceKey;
    }
    
    const response = await axios.post('api/v1/auth/verify_pin', {
      identifier: userIdentifier,
      pin: pin
    }, {
      headers: requestHeaders
    });
    
    console.log('PIN verification response:', response.data);
    
    if (response.data.status === 'authenticated') {
      // Store all session data
      storeDeviceSessionData(response.data);
      
      // ENHANCED: Ensure device header exists for cross-browser auth
      ensureDeviceHeaderCreated(response.data);
      
      // Clear any stale data first
      sessionStorage.removeItem('redirect_count');
      sessionStorage.removeItem('device_registration');
      sessionStorage.removeItem('verification_in_progress');
      
      // Set authenticated flag
      localStorage.setItem('authenticated_user', 'true');
      
      // Set auth version if available
      if (response.data && response.data.auth_version) {
        localStorage.setItem('auth_version', response.data.auth_version.toString());
      } else if (response.auth_version) {
        // Fallback for direct access pattern
        localStorage.setItem('auth_version', response.auth_version.toString());
      }
      
      // Also store auth data in local database for offline use
      if (offlineReady) {
        storeAuthDataOffline(response.data);
      }
      
      // Show verification success message before redirecting
      setIsVerificationSuccess(true);
      setFlowState('verificationSuccess');
      
      // Redirect to dashboard after short delay
      setTimeout(() => {
        window.location.href = response.data.redirect_to || '/dashboard';
      }, 1500);
    } else {
      throw new Error(response.data.error || 'PIN verification failed');
    }
  } catch (err) {
    console.error('PIN verification error:', err);
    
    // FIXED: Clear authentication state on error to prevent blank dashboard
    localStorage.removeItem('authenticated_user');
    sessionStorage.removeItem('device_session');
    
    setError(err.response?.data?.error || err.message || 'Invalid PIN');
    setPin('');
    
    // Track failed attempts
    const newAttempts = pinAttempts + 1;
    setPinAttempts(newAttempts);
    
    // After 3 failed attempts, fall back to SMS
    if (newAttempts >= 3) {
      setError('Too many failed attempts. Please verify with SMS.');
      setTimeout(() => {
        // Set flow state to verification first, then clear PIN entry state
        setFlowState('verification');
        setShowPinEntry(false);
        handleRegisterDevice(); // Fall back to SMS verification
      }, 2000);
    }
  } finally {
    clearTimeout(safetyTimeout);
    setIsLoading(false);
  }
};

  // PIN input handlers
  const appendToPin = (digit) => {
    if (pin.length < 4) {
      setPin(prev => prev + digit);
    }
  };

  const removeLastPinDigit = () => {
    setPin(prev => prev.slice(0, -1));
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
    if (countryCode === '+44' && phoneNumber.length < 10) return false;
    if (countryCode === '+65' && phoneNumber.length < 8) return false;
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

  // Handle initial login/registration submission with enhanced device recognition
  const handleInitialSubmit = async () => {
    console.log("Button clicked - starting login flow");
    setError('');
    setIsLoading(true);
    
    // Clear any existing timeout
    if (loadingTimeoutRef.current) {
      clearTimeout(loadingTimeoutRef.current);
    }
    
    // Set a new timeout to prevent infinite loading
    loadingTimeoutRef.current = setTimeout(() => {
      console.log("Loading timeout triggered - resetting loading state");
      setIsLoading(false);
      setError("Request timed out. Please try again.");
      loadingTimeoutRef.current = null;
    }, 15000); // 15 seconds timeout
    
    // Verify CSRF token
    if (!window.csrfToken) {
      console.error('CSRF token missing');
      setError('Security verification failed. Please refresh the page.');
      setIsLoading(false);
      clearTimeout(loadingTimeoutRef.current);
      loadingTimeoutRef.current = null;
      return;
    }
    
    try {
      // Get device key
      const deviceKey = await getStoredDeviceKey();
      
      // MODIFIED: Check for existing COMPLETE device header
      const completeHeader = getCompleteDeviceHeaderFromStorage();
      
      // MODIFIED: Create headers prioritizing complete header for cross-browser auth
      const requestHeaders = {
        'X-CSRF-Token': window.csrfToken
      };
      
      if (completeHeader) {
        console.log('Using complete device header for authentication:', {
          deviceId: completeHeader.deviceId.substring(0, 10) + '...',
          userGuid: completeHeader.userGuid,
          userHandle: completeHeader.userHandle
        });
        requestHeaders['X-Device-Header'] = JSON.stringify(completeHeader);
      } else {
        // Get device characteristics for fingerprinting when no complete header
        console.log('No complete header found - using device fingerprint for recognition only');
        const deviceCharacteristics = {
          platform: navigator.platform || 'unknown',
          screenWidth: window.screen.width,
          screenHeight: window.screen.height,
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          language: navigator.language || 'unknown',
          devicePixelRatio: window.devicePixelRatio || 1,
          browserFamily: detectBrowserFamily(navigator.userAgent),
          colorDepth: window.screen.colorDepth,
        };
        
        const basicHeader = {
          deviceId: deviceKey,
          timestamp: Date.now(),
          deviceCharacteristics: deviceCharacteristics
        };
        
        requestHeaders['X-Device-Header'] = JSON.stringify(basicHeader);
      }
      
      if (deviceKey) {
        requestHeaders['X-Device-Key'] = deviceKey;
      }
      
      // HANDLE FLOW BASED ON TAB TYPE
      if (loginMethod === 'handle') {
        // Handle flow
        console.log("Handle flow for:", identifier);
        if (!validateHandle()) {
          setError('Please enter a valid handle starting with @');
          setIsLoading(false);
          clearTimeout(loadingTimeoutRef.current);
          loadingTimeoutRef.current = null;
          return;
        }
        
        try {
          // First check if handle exists using our new endpoint
          console.log('Checking handle:', identifier);
          const checkResponse = await axios.get(`check_handle?handle=${encodeURIComponent(identifier)}`, {
            headers: requestHeaders,
            timeout: 10000
          });
              
          console.log('Handle check response:', checkResponse.data);
              
          // Check if handle exists
          if (checkResponse.data.exists) {
            // DIFFERENT BEHAVIOR BASED ON USER INTENT
            if (isRegistrationFlow) {
              // REGISTRATION INTENT - handle already exists
              console.log("Registration intent, but handle exists");
              setError(`This handle is already registered. Choose another handle or login.`);
              setIsLoading(false);
              clearTimeout(loadingTimeoutRef.current);
              loadingTimeoutRef.current = null;
              return;
            } else {
              // LOGIN INTENT - handle exists (good!)
              // Check confidence level for device recognition
              const isRecognizedDevice = checkResponse.data.is_your_device;
              const deviceConfidence = checkResponse.data.device_confidence || 'low';
              const confidenceScore = checkResponse.data.confidence_score || 0;
              const pinAvailable = checkResponse.data.pin_available || false;
              
              console.log('Device recognition result:', { 
                isRecognizedDevice, 
                deviceConfidence,
                confidenceScore,
                pinAvailable
              });
              
              // Handle high-confidence device match
              if (isRecognizedDevice && deviceConfidence === 'high') {
                console.log('High confidence device match - attempting fast login');
                
                // Try to authenticate with the recognized device
                const fastLoginResponse = await axios.post('fast_authenticate', {
                  identifier: identifier
                }, {
                  headers: requestHeaders,
                  timeout: 10000
                });
                
                if (fastLoginResponse.data.status === 'authenticated') {
                  // Store session data and redirect
                  storeDeviceSessionData(fastLoginResponse.data);
                  
                  // ENHANCED: Ensure device header exists for cross-browser auth
                  ensureDeviceHeaderCreated(fastLoginResponse.data);
                  
                  // Show verification success screen then redirect
                  setIsVerificationSuccess(true);
                  setFlowState('verificationSuccess');
                  
                  setTimeout(() => {
                    window.location.href = fastLoginResponse.data.redirect_to || '/dashboard';
                  }, 1500);
                  
                  clearTimeout(loadingTimeoutRef.current);
                  loadingTimeoutRef.current = null;
                  return;
                }
              }
              
              // For medium confidence with PIN available
              if (isRecognizedDevice && deviceConfidence === 'medium' && pinAvailable) {
                console.log('Medium confidence with PIN available - offering PIN verification');
                
                // Store handle and user info
                setHandle(identifier);
                setWelcomeMessage(`Welcome back, ${identifier}!`);
                // Change flow state to pinEntry first, then set showPinEntry flag
                setFlowState('pinEntry');
                setShowPinEntry(true);
                setPinAvailable(true);
                setExistingUserData({
                  handle: identifier,
                  masked_phone: checkResponse.data.masked_phone,
                  pin_available: true
                });
                
                setIsLoading(false);
                clearTimeout(loadingTimeoutRef.current);
                loadingTimeoutRef.current = null;
                return;
              }
              
              // Show existing account alert with new welcome back messaging
              console.log('Showing welcome back screen for handle:', identifier);
              
              // Store in sessionStorage for persistence across refreshes
              sessionStorage.setItem('account_already_exists', JSON.stringify({
                type: 'handle',
                handle: identifier,
                masked_handle: checkResponse.data.masked_handle || maskHandle(identifier),
                masked_phone: checkResponse.data.masked_phone,
                pin_available: checkResponse.data.pin_available || false
              }));
              
              setShowExistingAccountAlert(true);
              setAccountType('handle');
              setExistingHandle(checkResponse.data.masked_handle || maskHandle(identifier));
              setExistingUserData({
                handle: identifier,
                masked_phone: checkResponse.data.masked_phone,
                pin_available: checkResponse.data.pin_available || false
              });
              setPinAvailable(checkResponse.data.pin_available || false);
              
              setIsLoading(false);
              clearTimeout(loadingTimeoutRef.current);
              loadingTimeoutRef.current = null;
              return;
            }
          } else {
            // Handle does NOT exist
            if (isRegistrationFlow) {
              // REGISTRATION INTENT - handle is available (good!)
              console.log('Handle is available for registration');
              setHandle(identifier);
              setIsHandleFirst(true); // Set handle-first flow flag
              setFlowState('phoneEntry');
              
              setIsLoading(false);
              clearTimeout(loadingTimeoutRef.current);
              loadingTimeoutRef.current = null;
              return;
            } else {
              // LOGIN INTENT - but handle doesn't exist
              // Show registration transition screen
              console.log('Handle not found, offering registration transition');
              setFlowState('registrationTransition');
              
              setIsLoading(false);
              clearTimeout(loadingTimeoutRef.current);
              loadingTimeoutRef.current = null;
              return;
            }
          }
        } catch (err) {
          console.error('Handle check error:', err);
          setError(err.response?.data?.error || 'Verification failed');
          
          setIsLoading(false);
          clearTimeout(loadingTimeoutRef.current);
          loadingTimeoutRef.current = null;
          return;
        }
      } else {
        // PHONE FLOW
        console.log("Phone flow for:", identifier);
        if (!validatePhoneNumber()) {
          setError(`Please enter a valid ${countryCode === '+44' ? 'UK' : 'Singapore'} phone number`);
          setIsLoading(false);
          clearTimeout(loadingTimeoutRef.current);
          loadingTimeoutRef.current = null;
          return;
        }
        
        try {
          // First check if phone exists
          console.log('Checking phone:', identifier);
          
          const checkResponse = await axios.get(`check_phone?phone=${encodeURIComponent(identifier)}`, {
            headers: requestHeaders,
            timeout: 10000
          });
          
          console.log('Phone check response:', checkResponse.data);
          
          // IMPORTANT: Store phone in sessionStorage for cross-request persistence
          sessionStorage.setItem('registration_phone', identifier);
          console.log('Stored phone in sessionStorage for persistence:', identifier);
          
          // Check if phone exists
          if (checkResponse.data.exists) {
            // DIFFERENT BEHAVIOR BASED ON USER INTENT
            if (isRegistrationFlow) {
              // REGISTRATION INTENT - phone already exists
              console.log("Registration intent, but phone exists");
              setError(`This phone number is already registered. Use a different number or login.`);
              setIsLoading(false);
              clearTimeout(loadingTimeoutRef.current);
              loadingTimeoutRef.current = null;
              return;
            } else {
              // LOGIN INTENT - phone exists (good!)
              // Check device recognition
              const isRecognizedDevice = checkResponse.data.is_your_device;
              const deviceConfidence = checkResponse.data.device_confidence || 'low';
              const confidenceScore = checkResponse.data.confidence_score || 0;
              const pinAvailable = checkResponse.data.pin_available || false;
              
              console.log('Device recognition result:', { 
                isRecognizedDevice, 
                deviceConfidence,
                confidenceScore,
                pinAvailable
              });
              
              // Handle high-confidence device match
              if (isRecognizedDevice && deviceConfidence === 'high') {
                console.log('High confidence device match - attempting fast login');
                
                // Try to authenticate with the recognized device
                const fastLoginResponse = await axios.post('fast_authenticate', {
                  identifier: identifier
                }, {
                  headers: requestHeaders,
                  timeout: 10000
                });
                
                if (fastLoginResponse.data.status === 'authenticated') {
                  // Store session data and redirect
                  storeDeviceSessionData(fastLoginResponse.data);
                  
                  // ENHANCED: Ensure device header exists for cross-browser auth
                  ensureDeviceHeaderCreated(fastLoginResponse.data);
                  
                  // Show verification success screen then redirect
                  setIsVerificationSuccess(true);
                  setFlowState('verificationSuccess');
                  
                  setTimeout(() => {
                    window.location.href = fastLoginResponse.data.redirect_to || '/dashboard';
                  }, 1500);
                  
                  clearTimeout(loadingTimeoutRef.current);
                  loadingTimeoutRef.current = null;
                  return;
                }
              }
              
              // For medium confidence with PIN available
              if (isRecognizedDevice && deviceConfidence === 'medium' && pinAvailable) {
                console.log('Medium confidence with PIN available - offering PIN verification');
                
                // Store handle and user info
                setHandle(checkResponse.data.handle);
                setWelcomeMessage(`Welcome back, ${checkResponse.data.handle}!`);
                // Change flow state to pinEntry first, then set showPinEntry flag
                setFlowState('pinEntry');
                setShowPinEntry(true);
                setPinAvailable(true);
                setExistingUserData({
                  handle: checkResponse.data.handle,
                  masked_phone: checkResponse.data.masked_phone,
                  pin_available: true
                });
                
                setIsLoading(false);
                clearTimeout(loadingTimeoutRef.current);
                loadingTimeoutRef.current = null;
                return;
              }
              
              // Show welcome back screen with new messaging
              console.log('Showing welcome back screen for phone:', identifier);
              
              // Store in sessionStorage for persistence across refreshes
              sessionStorage.setItem('account_already_exists', JSON.stringify({
                type: 'phone',
                phone: identifier,
                handle: checkResponse.data.handle,
                masked_handle: checkResponse.data.masked_handle,
                masked_phone: checkResponse.data.masked_phone || maskPhone(identifier),
                pin_available: checkResponse.data.pin_available || false
              }));
              
              setShowExistingAccountAlert(true);
              setAccountType('phone');
              setExistingUserData({
                phone: identifier,
                handle: checkResponse.data.handle,
                masked_phone: checkResponse.data.masked_phone || maskPhone(identifier),
                pin_available: checkResponse.data.pin_available || false
              });
              setPinAvailable(checkResponse.data.pin_available || false);
              
              setIsLoading(false);
              clearTimeout(loadingTimeoutRef.current);
              loadingTimeoutRef.current = null;
              return;
            }
          } else {
            // Phone does NOT exist
            if (isRegistrationFlow) {
              // REGISTRATION INTENT - phone is available (good!)
              console.log('Phone is available for registration');
              
              // CRITICAL FIX: Set phone and store in state and storage
              setPhone(identifier);
              sessionStorage.setItem('registration_phone', identifier);
              
              setIsHandleFirst(false); // Not handle-first flow
              setFlowState('handleEntry');
              
              setIsLoading(false);
              clearTimeout(loadingTimeoutRef.current);
              loadingTimeoutRef.current = null;
              return;
            } else {
              // LOGIN INTENT - but phone doesn't exist
              // Show registration transition screen
              console.log('Phone not found, offering registration transition');
              setFlowState('registrationTransition');
              
              setIsLoading(false);
              clearTimeout(loadingTimeoutRef.current);
              loadingTimeoutRef.current = null;
              return;
            }
          }
        } catch (err) {
          console.error('Phone check error:', err);
          setError(err.response?.data?.error || 'Verification failed');
          
          setIsLoading(false);
          clearTimeout(loadingTimeoutRef.current);
          loadingTimeoutRef.current = null;
          return;
        }
      }
    } catch (globalError) {
      console.error('Global error in handleInitialSubmit:', globalError);
      console.error('Global error details:', {
        message: globalError.message,
        stack: globalError.stack,
        response: globalError.response?.data,
        status: globalError.response?.status
      });
      setError('An unexpected error occurred. Please try again.');
    } 
    // Always ensure loading state is cleared
    // Cleanup moved from finally block  
    setIsLoading(false);
    if (loadingTimeoutRef.current) {
      clearTimeout(loadingTimeoutRef.current);
      loadingTimeoutRef.current = null;
    }
  };

  // Add these functions to your UnifiedLogin component
  const showOverlay = (message) => {
    // Create overlay if it doesn't exist
    let overlay = document.getElementById('webauthn-overlay');
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.id = 'webauthn-overlay';
      overlay.style.position = 'fixed';
      overlay.style.top = '0';
      overlay.style.left = '0';
      overlay.style.width = '100%';
      overlay.style.height = '100%';
      overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
      overlay.style.display = 'flex';
      overlay.style.justifyContent = 'center';
      overlay.style.alignItems = 'center';
      overlay.style.zIndex = '9999';
      
      document.body.appendChild(overlay);
    }
    
    // Create or update content
    overlay.innerHTML = `
      <div style="background-color: #1F2937; padding: 2rem; border-radius: 0.5rem; text-align: center; max-width: 80%;">
        <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-teal-500 mx-auto mb-4"></div>
        <p style="color: white; font-size: 1.25rem;">${message}</p>
      </div>
    `;
    
    overlay.style.display = 'flex';
  };

  const hideOverlay = () => {
    const overlay = document.getElementById('webauthn-overlay');
    if (overlay) {
      overlay.style.display = 'none';
    }
  };

  // Helper function to detect browser family
  const detectBrowserFamily = (userAgent) => {
    if (/Chrome/i.test(userAgent)) return 'Chrome';
    if (/Firefox/i.test(userAgent)) return 'Firefox';
    if (/Safari/i.test(userAgent)) return 'Safari';
    if (/Edge|Edg/i.test(userAgent)) return 'Edge';
    if (/MSIE|Trident/i.test(userAgent)) return 'Internet Explorer';
    if (/Opera|OPR/i.test(userAgent)) return 'Opera';
    return 'Unknown';
  };

  // Submit phone number after handle (for new registrations)
  const handlePhoneSubmit = async () => {
    console.log('handlePhoneSubmit called with phone:', identifier, 'handle:', handle);
    
    setError('');
    setIsLoading(true);
    
    // Set a safety timeout
    const safetyTimeout = setTimeout(() => {
      console.log('Phone submit safety timeout triggered');
      setIsLoading(false);
      setError('Request timed out. Please try again.');
    }, 15000);
    
    // Verify CSRF token
    if (!window.csrfToken) {
      console.error('CSRF token missing');
      setError('Security verification failed. Please refresh the page.');
      setIsLoading(false);
      clearTimeout(safetyTimeout);
      return;
    }
    
    // Basic validation - allow any reasonable phone number length for flexibility
    const phoneLength = phoneNumber.length;
    if ((countryCode === '+44' && phoneLength < 10) || 
        (countryCode === '+65' && phoneLength < 8)) {
      const country = countryCode === '+44' ? 'UK' : 'Singapore';
      setError(`Please enter a valid ${country} phone number`);
      setIsLoading(false);
      clearTimeout(safetyTimeout);
      return;
    }
    
    try {
      console.log('Registering with handle and phone:', handle, identifier);
      console.log('Handle-first flow:', isHandleFirst);
      const deviceKey = await getStoredDeviceKey();
      
      // Store handle-first flag in sessionStorage for cross-request persistence
      sessionStorage.setItem('handle_first', isHandleFirst.toString());
      
      // Create headers for API request
      const requestHeaders = {
        'X-CSRF-Token': window.csrfToken
      };
      
      // Check for existing device header
      const completeHeader = getExistingCompleteHeader();
      
      if (completeHeader) {
        console.log('Using complete device header for phone verification');
        requestHeaders['X-Device-Header'] = JSON.stringify(completeHeader);
      } else {
        // Create basic device header for fingerprinting
        console.log('Using basic device header for fingerprinting');
        const deviceCharacteristics = {
          platform: navigator.platform || 'unknown',
          screenWidth: window.screen.width,
          screenHeight: window.screen.height,
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          language: navigator.language || 'unknown'
        };
        
        const basicHeader = {
          deviceId: deviceKey,
          deviceCharacteristics: deviceCharacteristics,
          timestamp: Date.now()
        };
        requestHeaders['X-Device-Header'] = JSON.stringify(basicHeader);
      }
      
      if (deviceKey) {
        requestHeaders['X-Device-Key'] = deviceKey;
      }
      
      // NEW: Check if this phone belongs to an existing account first
      try {
        console.log('Checking if phone exists:', identifier);
        const checkResponse = await axios.get(`check_phone?phone=${encodeURIComponent(identifier)}`, {
          headers: requestHeaders,
          timeout: 10000
        });
        
        if (checkResponse.data.exists) {
          // Phone exists - show Account Already Exists alert
          console.log('Phone exists, showing Account Already Exists screen');
          
          // Store in sessionStorage for persistence
          sessionStorage.setItem('account_already_exists', JSON.stringify({
            type: 'phone',
            phone: identifier,
            handle: checkResponse.data.handle,
            masked_handle: checkResponse.data.masked_handle || maskHandle(checkResponse.data.handle || ''),
            masked_phone: checkResponse.data.masked_phone || maskPhone(identifier),
            pin_available: checkResponse.data.pin_available || false
          }));
          
          setShowExistingAccountAlert(true);
          setAccountType('phone');
          setExistingUserData({
            phone: identifier,
            handle: checkResponse.data.handle,
            masked_phone: checkResponse.data.masked_phone || maskPhone(identifier),
            pin_available: checkResponse.data.pin_available || false
          });
          setPinAvailable(checkResponse.data.pin_available || false);
          setFlowState('loginOptions');
          setIsLoading(false);
          clearTimeout(safetyTimeout);
          return;
        }
      } catch (checkErr) {
        console.error('Error checking phone existence:', checkErr);
        // Continue with normal flow if check fails
      }
      
      // Send verification code to this phone
      console.log('Sending verify_login request for phone:', identifier);
      const response = await axios.post('verify_login', {
        identifier: identifier,
        auth: {
          identifier: identifier,
          handle: handle, // Also send the handle for context
          handle_first: isHandleFirst // Indicate handle-first flow - critical!
        }
      }, {
        headers: requestHeaders,
        timeout: 15000
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
        url: err.config?.url
      });
      
      // Check for specific error responses
      if (err.response?.data?.status === 'phone_exists') {
        // Show Account Already Exists screen
        console.log('Phone exists (from error), showing Account Already Exists screen');
        
        // Store in sessionStorage for persistence
        sessionStorage.setItem('account_already_exists', JSON.stringify({
          type: 'phone',
          phone: identifier,
          handle: err.response?.data?.handle,
          masked_handle: err.response?.data?.masked_handle || maskHandle(err.response?.data?.handle || ''),
          masked_phone: err.response?.data?.masked_phone || maskPhone(identifier),
          pin_available: err.response?.data?.pin_available || false
        }));
        
        setShowExistingAccountAlert(true);
        setAccountType('phone');
        setExistingUserData({
          phone: identifier,
          handle: err.response?.data?.handle,
          masked_phone: err.response?.data?.masked_phone || maskPhone(identifier),
          pin_available: err.response?.data?.pin_available || false
        });
        setPinAvailable(err.response?.data?.pin_available || false);
        setFlowState('loginOptions');
      } else {
        setError(err.response?.data?.error || 'Failed to send verification code');
      }
    } 
    // Cleanup moved from finally block
    clearTimeout(safetyTimeout);
    setIsLoading(false);
  };

  const handleHandleSubmit = async () => {
    console.log('Submitting handle:', handle);
    
    setError('');
    setIsLoading(true);
    
    // Safety timeout
    const safetyTimeout = setTimeout(() => {
      console.log('Handle submit safety timeout triggered');
      setIsLoading(false);
      setError('Request timed out. Please try again.');
    }, 15000);
    
    try {
      // Validation
      if (!handle || !handle.match(/^@[a-zA-Z0-9_]{1,29}$/)) {
        setError('Please enter a valid handle starting with @ and containing only letters, numbers, and underscores');
        setIsLoading(false);
        clearTimeout(safetyTimeout);
        return;
      }
      
      // Ensure CSRF token is available
      if (!window.csrfToken) {
        console.error('CSRF token missing');
        setError('Security verification failed. Please refresh the page.');
        setIsLoading(false);
        clearTimeout(safetyTimeout);
        return;
      }
      
      console.log('Creating handle:', handle);
      
      // IMPORTANT: Get the phone from saved state or sessionStorage
      const phoneNumber = phone || sessionStorage.getItem('registration_phone');
      console.log('Using phone for registration:', phoneNumber ? phoneNumber.substring(0, 4) + '****' : 'None');
      
      // If no phone available, show error
      if (!phoneNumber) {
        console.error('No phone number available for registration');
        setError('Phone number required for registration. Please try again.');
        setIsLoading(false);
        clearTimeout(safetyTimeout);
        return;
      }
      
      const requestHeaders = {
        'X-CSRF-Token': window.csrfToken
      };
      
      // Get device key if available
      const deviceKey = await getStoredDeviceKey();
      if (deviceKey) {
        requestHeaders['X-Device-Key'] = deviceKey;
      }
      
      // Get device header if available
      const deviceHeader = getDeviceHeader();
      if (deviceHeader) {
        requestHeaders['X-Device-Header'] = JSON.stringify(deviceHeader);
      }
      
      // Call the create_handle API
      const response = await axios.post('create_handle', {
        handle: handle,
        phone: phoneNumber, // Include the phone from sessionStorage or state
        require_verification: true // Always require verification
      }, {
        headers: requestHeaders,
        timeout: 15000
      });

      console.log('Handle creation response:', response.data);
      
      // CRITICAL FIX: Explicitly transition to verification screen
      // regardless of response for consistency
      if (response.data.status === 'verification_needed' || 
          response.data.phone || response.data.masked_phone) {
        
        console.log('Transitioning to verification screen');
        
        // Store verification data
        setPhone(phoneNumber);
        sessionStorage.setItem('verification_phone', phoneNumber);
        sessionStorage.setItem('pending_handle', handle);
        
        // Transition UI to verification
        setFlowState('verification');
        setVerificationCode('');
        setWelcomeMessage(response.data.message || 'Verify your phone number');
        
      } else if (response.data.status === 'authenticated') {
        // Fallback - should not happen with require_verification flag
        storeDeviceSessionData(response.data);
        ensureDeviceHeaderCreated(response.data);
        localStorage.setItem('authenticated_user', 'true');
// Safe version with fallback
if (response.data && response.data.auth_version) {
  localStorage.setItem('auth_version', response.data.auth_version.toString());
} else if (response.auth_version) {
  // Fallback for direct access pattern
  localStorage.setItem('auth_version', response.auth_version.toString());
}
  setIsVerificationSuccess(true);
        setFlowState('verificationSuccess');
        
        setTimeout(() => {
          window.location.href = response.data.redirect_to || '/dashboard';
        }, 1500);
      } else if (response.data.status === 'error') {
        setError(response.data.message || 'Failed to create handle');
      } else {
        // Force verification screen as fallback
        console.log('Forcing transition to verification as fallback');
        setPhone(phoneNumber);
        sessionStorage.setItem('verification_phone', phoneNumber);
        sessionStorage.setItem('pending_handle', handle);
        setFlowState('verification');
        setVerificationCode('');
        setWelcomeMessage('Verify your phone number');
      }
    } catch (err) {
      console.error('Handle creation error:', err);
      console.error('Error details:', {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status
      });
      
      // Special handling for common errors
      if (err.response?.data?.status === 'handle_exists') {
        setError('This handle is already taken. Please choose another one.');
      } else if (err.response?.data?.error === 'No phone found in session') {
        const phoneNumber = phone || sessionStorage.getItem('registration_phone');
        setError(phoneNumber ? 
          'Session error. Please try again.' : 
          'Phone number required. Please restart registration.');
      } else {
        setError(err.response?.data?.error || 'Failed to create handle');
      }
    }
    // Cleanup moved from finally block
    clearTimeout(safetyTimeout);
    setIsLoading(false);
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

  // Set safety timeout
  const safetyTimeout = setTimeout(() => {
    console.log('Verification safety timeout triggered');
    setIsLoading(false);
    setError('Request timed out. Please try again.');
    setAutoSubmit(true); // Re-enable auto-submit
  }, 15000);

  try {
    console.log('Submitting verification code:', verificationCode);
    const deviceKey = await getStoredDeviceKey();
    
    // MODIFIED: Check for existing COMPLETE device header
    const completeHeader = getCompleteDeviceHeaderFromStorage();
    
    // MODIFIED: Create headers prioritizing complete header for cross-browser auth
    const requestHeaders = {
      'X-CSRF-Token': window.csrfToken
    };
    
    if (completeHeader) {
      console.log('Using complete device header for verification submission:', {
        deviceId: completeHeader.deviceId.substring(0, 10) + '...',
        userGuid: completeHeader.userGuid,
        userHandle: completeHeader.userHandle
      });
      requestHeaders['X-Device-Header'] = JSON.stringify(completeHeader);
    } else {
      console.log('No complete header found for cross-browser auth during verification');
    }
    
    if (deviceKey) {
      requestHeaders['X-Device-Key'] = deviceKey;
    }
    
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
      headers: requestHeaders
    });

    console.log('Verification response:', response.data);

    // Clear device registration flags after successful verification
    sessionStorage.removeItem('device_registration');
    sessionStorage.removeItem('device_registration_flow');
    sessionStorage.removeItem('handle_first');

    if (response.data.status === 'authenticated') {
      // Store all relevant session data
      storeDeviceSessionData(response.data);
  
      // ENHANCED: Ensure cross-tab authentication
      localStorage.setItem('authenticated_user', 'true');
// Safe version with fallback
if (response.data && response.data.auth_version) {
  localStorage.setItem('auth_version', response.data.auth_version.toString());
} else if (response.auth_version) {
  // Fallback for direct access pattern
  localStorage.setItem('auth_version', response.auth_version.toString());
}
  
      // Clear any redirect counters to prevent loop detection triggering
      sessionStorage.removeItem('redirect_count');
      
      // ENHANCED: Ensure device header exists for cross-browser auth
      ensureDeviceHeaderCreated(response.data);

      console.log('AFTER AUTH SUCCESS - Device header content:', 
        localStorage.getItem('superapp_device_header'));
      
      // NEW: Register WebAuthn credential after successful SMS verification
      if (webAuthnEnabled && isWebAuthnSupported()) {
        try {
          console.log('Starting WebAuthn registration after successful SMS verification');
          showOverlay("Setting up secure login for your device...");
          await registerWebAuthnCredential();
          // Continue regardless of WebAuthn result
          hideOverlay();
          console.log('WebAuthn registration process completed');
        } catch (webAuthnError) {
          console.error('WebAuthn registration error:', webAuthnError);
          hideOverlay();
          // Continue anyway - WebAuthn is optional
        }
      } else {
        console.log('WebAuthn not supported or disabled, skipping registration');
      }
      
      // NEW: Show verification success screen before redirecting
      setIsVerificationSuccess(true);
      setFlowState('verificationSuccess');
      
      // Clear verification state and redirect after a short delay
      sessionStorage.removeItem('verification_in_progress');
      
      setTimeout(() => {
        window.location.href = response.data.redirect_to || '/dashboard';
      }, 1500);
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
    clearTimeout(safetyTimeout);
    setIsLoading(false);
  }
};

  // Handle "Sign in with PIN" button click - FIX for PIN UI issues
  const handlePinButtonClick = () => {
    console.log("PIN button clicked");
    // First update the flow state to make sure only PIN entry shows
    setFlowState('pinEntry');
    // Then set showPinEntry flag
    setShowPinEntry(true);
    setPin(''); // Clear any previous PIN
    setPinAttempts(0); // Reset attempts
    setError(''); // Clear errors
    console.log("PIN flow state set");
  };

  // Skip device check in certain conditions
  const shouldSkipDeviceCheck = () => {
    return window.location.pathname === '/dashboard' ||
           sessionStorage.getItem('logging_out') === 'true' ||
           localStorage.getItem('authenticated_user') === 'true' || // FIX: Check localStorage
           (sessionStorage.getItem('device_session') === 'authenticated' &&
            sessionStorage.getItem('current_handle'));
  };

  // Handle transition to registration flow
  const handleContinueRegistration = () => {
    setIsRegistrationFlow(true);
    
    if (loginMethod === 'handle') {
      // Continue to phone entry for handle-first flow
      setHandle(identifier);
      setFlowState('phoneEntry');
      setIsHandleFirst(true);
    } else {
      // Continue to handle entry for phone-first flow
      setPhone(identifier);
      setFlowState('handleEntry');
      setIsHandleFirst(false);
    }
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

  // NEW: Render verification success screen
  const renderVerificationSuccess = () => (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6 text-center">
        <div className="mb-6 flex justify-center">
          <div className="w-16 h-16 rounded-full bg-teal-500 flex items-center justify-center">
            <Check className="w-8 h-8 text-white" />
          </div>
        </div>
        <h1 className="text-2xl font-bold">Device Verified Successfully!</h1>
        <p className="text-gray-400">
          You're now signed in, and this device will remember
          you for future visits to SuperApp.
        </p>
        <div className="animate-pulse flex justify-center mt-4">
          <div className="w-8 h-8 rounded-full border-t-2 border-teal-500 animate-spin"></div>
        </div>
      </div>
    </div>
  );

  // NEW: Render registration transition screen
  const renderRegistrationTransition = () => (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">
            This {loginMethod} is available!
          </h1>
          <p className="text-gray-400">
            Would you like to create a new account with {identifier}?
          </p>
        </div>
        
        <div className="space-y-4">
          <button
            onClick={handleContinueRegistration}
            className="w-full bg-teal-500 text-white rounded-lg py-4 font-medium"
          >
            Continue with Registration
          </button>
          
          <button
            onClick={() => setFlowState('loginOptions')}
            className="w-full bg-gray-800 text-white rounded-lg py-4 font-medium"
          >
            Go Back
          </button>
        </div>
      </div>
    </div>
  );

  // Render PIN entry component - FIXED to use flowState instead of just showPinEntry
  const renderPinEntry = () => {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="mb-8 flex justify-center">
            <div className="w-16 h-16 rounded-full bg-teal-500 flex items-center justify-center text-xl font-bold">
              {existingUserData?.handle ? existingUserData.handle[0].toUpperCase() : '@'}
            </div>
          </div>

          <div className="text-center">
            <h1 className="text-2xl font-bold mb-2">Enter your PIN</h1>
            <p className="text-gray-400">
              Enter your 4-digit PIN to verify it's you
            </p>
          </div>

          {/* PIN Display */}
          <div className="flex justify-center gap-3 my-8">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className={`w-12 h-14 flex items-center justify-center text-xl
                  border-2 rounded-lg transition-colors
                  ${pin[i] ? 'border-teal-500 bg-gray-800' : 'border-gray-600'}`}
              >
                {pin[i] ? '•' : ''}
              </div>
            ))}
          </div>

          {/* PIN Numpad */}
          <div className="grid grid-cols-3 gap-6 mb-8">
            {[1,2,3,4,5,6,7,8,9,'',0,'⌫'].map((num, i) => (
              <button
                key={i}
                onClick={() => {
                  if (num === '⌫') {
                    removeLastPinDigit();
                  } else if (num !== '') {
                    appendToPin(num);
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

          <div className="flex flex-col space-y-3">
            <button
              onClick={() => {
                setFlowState('verification');
                setShowPinEntry(false);
                handleRegisterDevice();
              }}
              className="w-full text-gray-400 py-2 hover:text-white transition-colors"
              disabled={isLoading}
            >
              Use SMS verification instead
            </button>
            
            <button
              onClick={() => {
                setFlowState('loginOptions');
                setShowPinEntry(false);
              }}
              className="w-full text-gray-400 py-2 hover:text-white transition-colors"
              disabled={isLoading}
            >
              This isn't my account
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Render verification step with updated messaging
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
            <div className="inline-block animate-spin rounded-full h-5 w-5 border-t-2 border-teal-500 mr-2"></div>
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
        
        {/* Show PIN option if available */}
        {pinAvailable && (
          <button
            onClick={() => {
              setFlowState('pinEntry');
              setShowPinEntry(true);
              setVerificationCode('');
            }}
            className="text-sm text-teal-400 w-full text-center mt-4 hover:text-teal-300 transition-colors"
            disabled={isLoading}
          >
            Use your PIN instead
          </button>
        )}
      </div>
    </div>
  );

const renderConnectionStatus = () => {
  if (!isOffline && syncStatus === 'idle') return null;
  
  let bgColor = 'bg-gray-700';
  let message = '';
  
  if (isOffline) {
    bgColor = 'bg-yellow-600';
    message = 'Offline Mode';
  } else if (syncStatus === 'syncing') {
    bgColor = 'bg-blue-600';
    message = 'Syncing...';
  } else if (syncStatus === 'success') {
    bgColor = 'bg-green-600';
    message = 'Synced Successfully';
  } else if (syncStatus === 'error') {
    bgColor = 'bg-red-600';
    message = 'Sync Failed';
  }
  
  return (
    <div className={`fixed top-4 right-4 ${bgColor} text-white py-2 px-4 rounded-lg shadow-lg z-50 flex items-center`}>
      <div className={`w-2 h-2 rounded-full mr-2 ${isOffline ? 'bg-yellow-400' : 'bg-white'}`}></div>
      <span>{message}</span>
    </div>
  );
};

  // Render login/register options with updated UI and messaging
  const renderLoginOptions = () => (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">
            {isRegistrationFlow 
              ? "Create Your SuperApp Account" 
              : "Welcome to SuperApp"}
          </h1>
          <p className="text-gray-400">
            {isRegistrationFlow
              ? "Choose how you'd like to register"
              : "Login with an existing account or create a new one."}
          </p>
        </div>

        {/* Existing Account Alert - Updated with Welcome Back Messaging */}
        {showExistingAccountAlert && (
          <div className="flex flex-col items-center text-center space-y-6 py-4">
            <div className="w-16 h-16 rounded-full bg-teal-500 flex items-center justify-center">
              {accountType === 'handle' ? <span className="text-white text-2xl">@</span> : <User className="w-8 h-8 text-white" />}
            </div>
            
            <div className="space-y-2">
              <h2 className="text-2xl font-bold">
                Welcome Back, {existingHandle || existingUserData?.handle || ''}!
              </h2>
              <p className="text-gray-400">
                Your device is registered with SuperApp.
                For your security, a quick verification is needed.
                After this, you'll be automatically signed in on future visits.
              </p>
            </div>
            
            <div className="space-y-3 w-full" id="account-exists-buttons">
              <button
                id="yes-account-btn"
                onClick={handleRegisterDevice}
                className="w-full bg-teal-500 rounded-lg py-3 text-white font-medium hover:bg-teal-600 transition-colors"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Verifying...
                  </div>
                ) : (
                  accountType === 'handle' ? "Verify with SMS" : "Verify with SMS"
                )}
              </button>
              
              {/* Show PIN option if available */}
              {(pinAvailable || (existingUserData && existingUserData.pin_available)) && (
                <button
                  id="pin-signin-btn"
                  onClick={handlePinButtonClick}
                  className="w-full bg-gray-800 hover:bg-gray-700 rounded-lg py-3 text-white font-medium transition-colors"
                >
                  Verify with PIN
                </button>
              )}
              
              <button
                id="no-account-btn"
                onClick={handleNotMyAccount}
                className="w-full bg-gray-800 hover:bg-gray-700 rounded-lg py-3 text-white font-medium transition-colors"
              >
                {accountType === 'handle' ? 'Not you? Use different handle' : 'Not you? Use different number'}
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
                    className="flex-1 bg-gray-800 border-0 rounded-r-lg py-4 px-6 text-lg focus:ring-2 focus:ring-teal-500 focus:outline-none"
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
                    className="w-full bg-gray-800 border-0 rounded-lg py-4 pl-10 pr-6 text-lg focus:ring-2 focus:ring-teal-500 focus:outline-none"
                    disabled={isLoading}
                    autoFocus
                  />
                </div>
              )}
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
              onClick={handleInitialSubmit}
              disabled={
                isLoading ||
                !identifier ||
                (loginMethod === 'handle' ? !validateHandle() : !validatePhoneNumber())
              }
              className="w-full bg-teal-500 text-white rounded-lg py-4 font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-teal-600 transition-colors flex items-center justify-center"
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
            
            {/* Toggle between login and registration */}
            <button
              onClick={() => setIsRegistrationFlow(!isRegistrationFlow)}
              className="w-full text-gray-400 py-2 mt-4 hover:text-white transition-colors"
            >
              {isRegistrationFlow
                ? "Already have an account? Sign in" 
                : "Don't have an account? Create account"}
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
value={(handle || '@').replace('@', '')}
            onChange={(e) => setHandle('@' + e.target.value.replace('@', ''))}
            placeholder="username"
            className="w-full bg-gray-800 border-0 rounded-lg py-4 pl-10 pr-6 text-lg focus:ring-2 focus:ring-teal-500 focus:outline-none"
            disabled={isLoading}
            autoFocus
          />
        </div>

        <button
          onClick={() => {
            // CRITICAL FIX: Always use handleHandleSubmit regardless of flow direction
            // This ensures proper transition to verification
            handleHandleSubmit();
          }}
          disabled={isLoading || !handle || !handle.match(/^@[a-zA-Z0-9_]{1,29}$/)}
          className="w-full bg-teal-500 text-white rounded-lg py-4 font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-teal-600 transition-colors flex items-center justify-center"
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
            className="flex-1 bg-gray-800 border-0 rounded-r-lg py-4 px-6 text-lg focus:ring-2 focus:ring-teal-500 focus:outline-none"
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
          className="w-full bg-teal-500 text-white rounded-lg py-4 font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-teal-600 transition-colors flex items-center justify-center"
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
          className="w-full bg-gray-800 text-white rounded-lg py-4 font-medium hover:bg-gray-700 transition-colors mt-4"
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
value={(handle || '@').replace('@', '')}
              onChange={(e) => setHandle('@' + e.target.value.replace('@', ''))}
              placeholder="username"
              className="w-full bg-gray-800 border-0 rounded-lg py-4 pl-10 pr-6 text-lg focus:ring-2 focus:ring-teal-500 focus:outline-none"
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
          className="w-full bg-teal-500 text-white rounded-lg py-4 font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-teal-600 transition-colors flex items-center justify-center"
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
              className="bg-gray-800 rounded-lg p-4 hover:bg-gray-700 transition-all transform hover:translate-x-1 cursor-pointer"
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
              className="w-full bg-gray-800 border border-gray-700 rounded-lg py-3 pl-8 pr-3 focus:ring-2 focus:ring-teal-500 focus:border-transparent focus:outline-none"
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
            className="w-full bg-teal-500 text-white rounded-lg py-3 mt-3 font-medium hover:bg-teal-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            <span className="flex items-center">
              Continue <ArrowRight size={18} className="ml-2" />
            </span>
          </button>
        </div>
      </div>
    </div>
  );

  // UPDATED: Render device registration (now "Welcome Back") with device-focused messaging
  const renderDeviceRegistration = () => {
    // If in PIN entry mode, render PIN component
    if (showPinEntry) {
      return renderPinEntry();
    }
    
    const isPhoneFlow = loginMethod === 'phone';
    const userHandle = existingUserData?.handle || maskHandle(identifier);
    
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
              Welcome Back, {userHandle}!
            </h2>
            <p className="text-gray-400 mb-6">
              Your device is registered with SuperApp.
              For your security, a quick verification is needed.
              After this, you'll be automatically signed in on future visits.
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
                  Verify with SMS <ArrowRight size={18} className="ml-2" />
                </span>
              )}
            </button>
            
            {/* PIN option button - show only if PIN is available */}
            {(pinAvailable || (existingUserData && existingUserData.pin_available)) && (
              <button
                onClick={handlePinButtonClick}
                disabled={isLoading}
                className="w-full bg-gray-800 text-white rounded-lg py-4 font-medium hover:bg-gray-700 transition-colors disabled:opacity-50 flex items-center justify-center"
              >
                <span className="flex items-center">
                  Verify with PIN <ArrowRight size={18} className="ml-2" />
                </span>
              </button>
            )}
            
            <button
              ref={noButtonRef}
              onClick={handleNotMyAccount}
              disabled={isLoading}
              className="w-full bg-gray-700 text-white rounded-lg py-4 font-medium hover:bg-gray-600 transition-colors"
            >
              Not {userHandle}? {isPhoneFlow ? "Use Different Phone" : "Use Different Handle"}
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

  // Main render - FIXED: prioritize PIN entry state and prevent double-rendering issues
  return (
    <>
    {renderConnectionStatus()}  
    {/* PIN entry takes precedence over other states */}
      {flowState === 'pinEntry' && renderPinEntry()}
      
      {/* Only render these states if we're not in PIN entry */}
      {flowState !== 'pinEntry' && (
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
          {flowState === 'verificationSuccess' && renderVerificationSuccess()}
          {flowState === 'registrationTransition' && renderRegistrationTransition()}
        </>
      )}
    </>
  );
};

module.exports = UnifiedLogin;



