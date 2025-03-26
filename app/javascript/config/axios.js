import axios from 'axios';
import { getStoredDeviceKey, getDeviceHeader, generateDeviceHeader, getCompleteDeviceHeaderFromStorage, validateAuthVersion } from '../utils/deviceKey';

// Session validation state tracking
let lastSessionCheck = 0;
let sessionCheckPromise = null;
const SESSION_CHECK_INTERVAL = 5000; // 5 seconds minimum between checks
const SESSION_CHECK_CACHE = {};

const instance = axios.create({
  baseURL: `${window.location.protocol}//${window.location.host}/api/v1`,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  }
});

// New function to check session validity with debouncing
async function checkSessionValidity() {
  if (localStorage.getItem('authenticated_user') !== 'true') {
    return true; // Not authenticated, no need to check
  }
  
  const now = Date.now();
  
  // Reuse existing result if recent
  if (now - lastSessionCheck < SESSION_CHECK_INTERVAL) {
    console.log('Skipping redundant session check - checked recently');
    return sessionCheckPromise || true;
  }
  
  // Update timestamp and create new promise
  lastSessionCheck = now;
  sessionCheckPromise = _performSessionCheck();
  return sessionCheckPromise;
}

// Extract the actual check logic to a private function
async function _performSessionCheck() {
  try {
    console.log('Performing actual session validity check');
    
    // Safeguard to prevent multiple calls in the same cycle
    if (SESSION_CHECK_CACHE.inProgress) {
      console.log('Session check already in progress, waiting for result');
      return SESSION_CHECK_CACHE.promise;
    }
    
    // Create a promise that can be shared across concurrent calls
    SESSION_CHECK_CACHE.promise = new Promise(async (resolve) => {
      SESSION_CHECK_CACHE.inProgress = true;
      
      try {
        const response = await fetch('/api/v1/auth/verify_session', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'X-Device-Key': await getStoredDeviceKey()
          },
          credentials: 'same-origin'
        });
        
        if (!response.ok) {
          console.warn('Session validation failed with status:', response.status);
          localStorage.removeItem('authenticated_user');
          SESSION_CHECK_CACHE.inProgress = false;
          resolve(false);
          return false;
        }
        
        const data = await response.json();
        if (!data.authenticated) {
          console.warn('Server reports session no longer authenticated');
          localStorage.removeItem('authenticated_user');
          SESSION_CHECK_CACHE.inProgress = false;
          resolve(false);
          return false;
        }
        
        // Check version
        const localVersion = localStorage.getItem('auth_version');
        if (localVersion && parseInt(localVersion) < parseInt(data.auth_version)) {
          console.warn(`Auth version mismatch: local=${localVersion}, server=${data.auth_version}`);
          localStorage.removeItem('authenticated_user');
          localStorage.setItem('device_reset', 'true');
          SESSION_CHECK_CACHE.inProgress = false;
          resolve(false);
          return false;
        }
        
        SESSION_CHECK_CACHE.inProgress = false;
        resolve(true);
        return true;
      } catch (error) {
        console.error('Session validation error:', error);
        SESSION_CHECK_CACHE.inProgress = false;
        // Don't clear auth on network errors to prevent flicker
        const result = navigator.onLine ? false : true;
        resolve(result);
        return result;
      }
    });
    
    return SESSION_CHECK_CACHE.promise;
  } catch (error) {
    console.error('Session check wrapper error:', error);
    return navigator.onLine ? false : true;
  }
}

instance.interceptors.request.use(async config => {
  try {
    // Get original URL
    let url = config.url || '';
    // Log the original URL for debugging
    console.log('Original URL before normalization:', url);
    // More aggressively remove any existing API path prefixes to normalize
    url = url.replace(/^api\/v1\/auth\/api\/v1\//, '');
    url = url.replace(/^api\/v1\/auth\//, '');
    url = url.replace(/^api\/v1\//, '');
    url = url.replace(/^auth\//, '');
    // Now add the clean correct prefix
    config.url = `auth/${url}`;
    // Check for double slashes in final URL and fix them
    if (config.url.includes('//')) {
      console.log('Found double slash in URL, fixing:', config.url);
      config.url = config.url.replace('//', '/');
    }
    console.log('Normalized URL after processing:', config.url);

    // Add session validity check ONLY for endpoints that require authentication
    // FIXED: More specific condition to avoid triggering checks for auth endpoints
    const requiresAuth = 
      config.url.includes('/dashboard') || 
      config.url.includes('/api/v1/user/') ||
      (
        !config.url.includes('auth/login') && 
        !config.url.includes('auth/verify') && 
        !config.url.includes('auth/check') &&
        !config.url.includes('auth/session') &&
        !config.url.startsWith('auth/verify_session')
      );

    if (requiresAuth && localStorage.getItem('authenticated_user') === 'true') {
      console.log('Checking session validity for authenticated request:', config.url);
      const sessionValid = await checkSessionValidity();
      if (!sessionValid) {
        // Cancel the request
        throw new axios.Cancel('Session invalid');
      }
    }

    // FIXED: First try to get a complete header with all required fields
    const completeHeader = getCompleteDeviceHeaderFromStorage();
    if (completeHeader) {
      console.log('Using complete device header with all required fields for request:', {
        deviceId: completeHeader.deviceId.substring(0, 10) + '...',
        userGuid: completeHeader.userGuid,
        userHandle: completeHeader.userHandle
      });
      config.headers['X-Device-Header'] = JSON.stringify(completeHeader);
    } else {
      console.log('No complete device header available - sending simplified header for fingerprinting only');
      // Get device key for browser identification
      const browserKey = await getStoredDeviceKey();
      // For fingerprinting, create a simplified header without user data
      if (browserKey) {
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
        const simplifiedHeader = {
          deviceId: browserKey,
          deviceCharacteristics: deviceCharacteristics,
          timestamp: Date.now()
        };
        config.headers['X-Device-Header'] = JSON.stringify(simplifiedHeader);
      }
    }
    
    // Always include browser key separately (important for device recognition)
    const browserKey = await getStoredDeviceKey();
    if (browserKey) {
      console.log('Setting request header X-Device-Key:', browserKey.substring(0, 10) + '...');
      config.headers['X-Device-Key'] = browserKey;
    }
    
    // NEW: Add auth version to requests
    const authVersion = localStorage.getItem('auth_version');
    if (authVersion) {
      config.headers['X-Auth-Version'] = authVersion;
    }
    
    // Add CSRF token
    const csrfToken = document.querySelector('meta[name="csrf-token"]')?.content;
    if (csrfToken) {
      config.headers['X-CSRF-Token'] = csrfToken;
    }
    return config;
  } catch (error) {
    if (axios.isCancel(error)) {
      // This means we cancelled the request due to invalid session
      window.location.href = '/?session_invalid=true';
      return new Promise(() => {});
    }
    console.error('Request interceptor error:', error);
    return config;
  }
});

// Helper function to detect browser family for fingerprinting
function detectBrowserFamily(userAgent) {
  if (/Chrome/i.test(userAgent)) return 'Chrome';
  if (/Firefox/i.test(userAgent)) return 'Firefox';
  if (/Safari/i.test(userAgent)) return 'Safari';
  if (/Edge|Edg/i.test(userAgent)) return 'Edge';
  if (/MSIE|Trident/i.test(userAgent)) return 'Internet Explorer';
  if (/Opera|OPR/i.test(userAgent)) return 'Opera';
  return 'Unknown';
}

// Response interceptor to store device session data
instance.interceptors.response.use(
  response => {
    try {
      // Verify auth_version in all successful responses
      if (response.data && response.data.auth_version && localStorage.getItem('auth_version')) {
        const localVersion = parseInt(localStorage.getItem('auth_version'));
        const serverVersion = parseInt(response.data.auth_version);
        
        if (localVersion < serverVersion) {
          console.warn(`Auth version mismatch in response: local=${localVersion}, server=${serverVersion}`);
          localStorage.removeItem('authenticated_user');
          localStorage.setItem('device_reset', 'true');
          window.location.href = '/?auth_reset=true';
          return response;
        }
      }

      if (response.data) {
        // Store device key if present
        if (response.data.device_key) {
          sessionStorage.setItem('device_key', response.data.device_key);
        }
        
        // Handle authentication state
        if (response.data.status === 'authenticated') {
          sessionStorage.setItem('device_session', 'authenticated');
          if (response.data.handle) {
            sessionStorage.setItem('current_handle', response.data.handle);
          }
          
          // NEW: Store auth version in response
          if (response.data.auth_version) {
            localStorage.setItem('auth_version', response.data.auth_version.toString());
          }
          
          // IMPROVED: Process device header data from response with better validation
          if (response.data.device_header_data) {
            console.log('Received device_header_data in response:', response.data.device_header_data);
            // Validate that we have all required fields before generating
            if (response.data.device_header_data.deviceId &&
                response.data.device_header_data.userGuid &&
                response.data.device_header_data.userHandle) {
              // Generate and store the device header for cross-browser recognition
              const headerStored = generateDeviceHeader(
                response.data.device_header_data.deviceId,
                response.data.device_header_data.userGuid,
                response.data.device_header_data.userHandle
              );
              if (headerStored) {
                console.log('Successfully stored complete device header in localStorage for cross-browser auth');
                // Verify the stored header
                const storedHeader = localStorage.getItem('superapp_device_header');
                if (storedHeader) {
                  try {
                    const parsedHeader = JSON.parse(storedHeader);
                    console.log('Verified stored header has required fields:', {
                      hasDeviceId: !!parsedHeader.deviceId,
                      hasUserGuid: !!parsedHeader.userGuid,
                      hasUserHandle: !!parsedHeader.userHandle
                    });
                  } catch (e) {
                    console.error('Error validating stored header:', e);
                  }
                }
              } else {
                console.warn('Failed to store device header data - cross-browser auth may not work');
              }
            } else {
              console.warn('Incomplete device_header_data received, missing required fields:', {
                hasDeviceId: !!response.data.device_header_data.deviceId,
                hasUserGuid: !!response.data.device_header_data.userGuid,
                hasUserHandle: !!response.data.device_header_data.userHandle
              });
            }
          } else if (response.data.device_key && response.data.guid && response.data.handle) {
            // FALLBACK: If device_header_data not provided but we have all fields individually
            console.log('Creating device header from individual response fields');
            const headerStored = generateDeviceHeader(
              response.data.device_key,
              response.data.guid,
              response.data.handle
            );
            if (headerStored) {
              console.log('Successfully stored device header from individual fields');
            } else {
              console.warn('Failed to store device header from individual fields');
              // Last resort: Direct storage into localStorage
              try {
                const headerData = {
                  deviceId: response.data.device_key,
                  userGuid: response.data.guid,
                  userHandle: response.data.handle,
                  timestamp: Date.now()
                };
                localStorage.setItem('superapp_device_header', JSON.stringify(headerData));
                console.log('Directly stored device header as last resort');
              } catch (e) {
                console.error('Failed even with direct localStorage storage:', e);
              }
            }
          } else {
            console.log('No device_header_data or complete field set in authenticated response');
          }
        }
      }
    } catch (error) {
      console.error('Response interceptor error:', error);
    }
    return response;
  },
  error => {
    // Check for auth version mismatch error
    if (error.response && error.response.status === 401 && 
        error.response.data && error.response.data.error === 'AuthVersionMismatch') {
      console.warn('Auth version mismatch detected, clearing authentication');
      localStorage.removeItem('authenticated_user');
      localStorage.setItem('device_reset', 'true');
      
      // Redirect to login
      window.location.href = '/?auth_reset=true';
      
      // Return a resolved promise to prevent further error handling
      return Promise.resolve({ data: { error: 'AuthVersionMismatch', redirecting: true } });
    }
    
    // Continue with normal error handling
    return Promise.reject(error);
  }
);

export default instance;
