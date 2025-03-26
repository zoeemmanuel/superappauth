// Enhanced Reset detection across tabs and page loads
console.log('Reset handler initializing');
document.addEventListener('DOMContentLoaded', function() {
  console.log('Reset handler active');

  // Create a global namespace for reset handling
  window.SuperApp = window.SuperApp || {};
  window.SuperApp.resetHandling = {
    redirectCount: parseInt(sessionStorage.getItem('redirect_count') || '0'),
    lastTimestamp: parseInt(sessionStorage.getItem('last_redirect_time') || '0'),
    initialUrl: window.location.href,
    loopDetected: false
  };

  // Check for URL parameters that indicate auth issues
  const checkUrlForResetFlags = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const resetFlags = [
      'session_invalid', 'session_invalidated', 'auth_reset', 
      'reset', 'device_reset', 'complete_reset'
    ];
    
    for (const flag of resetFlags) {
      if (urlParams.has(flag)) {
        console.log(`Reset flag detected in URL: ${flag}`);
        performFullReset();
        return true;
      }
    }
    return false;
  };

  // Function to perform full reset of client-side state
  const performFullReset = () => {
    console.log('Performing full reset of client-side state');
    
    // First remove auth flags
    localStorage.removeItem('authenticated_user');
    localStorage.removeItem('auth_version');
    
    // Remove device-specific items
    localStorage.removeItem('superapp_device_header');
    localStorage.removeItem('superapp_tab_id');
    localStorage.removeItem('loop_detected');
    localStorage.removeItem('device_key');
    localStorage.removeItem('device_header');
    localStorage.removeItem('device_id');
    localStorage.removeItem('device_guid');
    
    // Clear all general storage
    try {
      sessionStorage.clear();
      
      // Force removal of each localStorage key
      Object.keys(localStorage).forEach(key => {
        console.log(`Removing localStorage key: ${key}`);
        localStorage.removeItem(key);
      });
      
      // Reset redirect count tracking
      window.SuperApp.resetHandling.redirectCount = 0;
      window.SuperApp.resetHandling.loopDetected = false;
      sessionStorage.removeItem('redirect_count');
      sessionStorage.removeItem('last_redirect_time');
      
      console.log('Client-side state reset complete');
    } catch (e) {
      console.error('Error during reset cleanup:', e);
    }
  };

  // Add a global listener for auth errors
  window.addEventListener('superapp_auth_error', function(e) {
    console.log('Auth error event received:', e.detail);
    performFullReset();
    
    // Redirect to login if needed
    if (window.location.pathname !== '/' && !window.location.pathname.includes('/login')) {
      window.location.href = '/?auth_error=true';
    }
  });

  // Check for reset flags in URL first
  if (checkUrlForResetFlags()) {
    console.log('Reset flags found in URL, already handled');
    return;
  }

  // Check for loop detection
  if (localStorage.getItem('loop_detected') === 'true') {
    console.log('Loop previously detected, bypassing authentication checks');
    performFullReset();
    
    // Only clear redirect count if we're on the login page to prevent further loops
    if (window.location.pathname === '/' || window.location.pathname.includes('/login')) {
      sessionStorage.removeItem('redirect_count');
      sessionStorage.removeItem('last_redirect_time');
      window.SuperApp.resetHandling.redirectCount = 0;
    }
    
    // If we're not already on login page, redirect there
    if (window.location.pathname !== '/' && !window.location.pathname.includes('/login')) {
      window.location.href = '/?loop_detected=true';
      return;
    }
  }
  
  // Enhanced redirect tracking to detect loops with timestamps
  const now = Date.now();
  if (window.SuperApp.resetHandling.lastTimestamp > 0 && 
     (now - window.SuperApp.resetHandling.lastTimestamp) < 5000) { // 5 second window
    window.SuperApp.resetHandling.redirectCount += 1;
    console.log('Redirect counter incremented:', window.SuperApp.resetHandling.redirectCount);
  } else {
    // Reset counter if last redirect was over 5 seconds ago
    window.SuperApp.resetHandling.redirectCount = 1;
  }
  
  window.SuperApp.resetHandling.lastTimestamp = now;
  sessionStorage.setItem('redirect_count', window.SuperApp.resetHandling.redirectCount.toString());
  sessionStorage.setItem('last_redirect_time', now.toString());
  
// If too many redirects in a short time, detect loop
if (window.SuperApp.resetHandling.redirectCount > 3) {
  console.error('Redirect loop detected! Stopping authentication cycle');
  localStorage.setItem('loop_detected', 'true');
  window.SuperApp.resetHandling.loopDetected = true;
  performFullReset();
  
  // More aggressive approach to breaking loops
  document.cookie = 'session_id=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT;';
  
  // Create visible notification for debugging
  if (!document.getElementById('loop-detection-notice')) {
    const notice = document.createElement('div');
    notice.id = 'loop-detection-notice';
    notice.style.position = 'fixed';
    notice.style.top = '10px';
    notice.style.left = '10px';
    notice.style.padding = '10px';
    notice.style.background = 'red';
    notice.style.color = 'white';
    notice.style.zIndex = '9999';
    notice.innerHTML = 'Authentication loop detected and stopped. <a href="/?force_reset=true" style="color:white;text-decoration:underline;">Click here</a> to reset.';
    document.body.appendChild(notice);
  }
  
  // Force stop by redirecting to login with special parameter
  if (window.location.pathname !== '/' && !window.location.pathname.includes('/login')) {
    window.location.href = '/?loop_broken=true';
    return;
  }
}

  // Check for authentication state
  if (localStorage.getItem('authenticated_user') === 'true' && 
      !localStorage.getItem('logout_state')) {
    
    console.log('Found authenticated_user flag - verifying with server');
    
    // Don't check if we're already on dashboard or processing logout
    if (window.location.pathname === '/dashboard' || 
        window.location.pathname.includes('logout') ||
        sessionStorage.getItem('logging_out') === 'true') {
      console.log('On dashboard or processing logout, skipping auth check');
      return;
    }
    
    // Verify authentication with server
    fetch('/api/v1/auth/verify_session', {
      method: 'GET',
      headers: { 
        'Content-Type': 'application/json',
        'X-Device-Key': localStorage.getItem('device_key') || sessionStorage.getItem('device_key')
      },
      credentials: 'same-origin'
    })
    .then(response => {
      if (!response.ok) {
        console.warn('Server reports authentication invalid, performing reset');
        performFullReset();
        if (window.location.pathname !== '/') {
          window.location.href = '/?session_invalid=true';
        }
        return null;
      }
      return response.json();
    })
    .then(data => {
      if (data && data.authenticated) {
        console.log('Server confirms valid authentication');
        
        // Check auth version
        const localVersion = localStorage.getItem('auth_version');
        if (localVersion && data.auth_version && 
            parseInt(localVersion) < parseInt(data.auth_version)) {
          console.warn('Auth version mismatch detected');
          performFullReset();
          window.location.href = '/?auth_version_mismatch=true';
          return;
        }
        
        // If we're not on dashboard and authentication is valid, redirect
        if (window.location.pathname !== '/dashboard') {
          console.log('Authentication valid, redirecting to dashboard');
          window.location.href = '/dashboard';
        }
      } else if (data === null) {
        // This case is handled in the fetch error
        return;
      } else {
        console.warn('Server reports NOT authenticated, clearing invalid flag');
        performFullReset();
        if (window.location.pathname !== '/') {
          window.location.href = '/?auth_invalid=true';
        }
      }
    })
    .catch(() => {
      console.log('Error checking auth status, keeping auth flag for now');
      // On network errors, don't clear the flag to prevent flickering login
    });
  }

  // Listen for reset broadcasts
  window.addEventListener('storage', function(e) {
    if (e.key === 'device_reset_broadcast' || e.key === 'device_reset') {
      console.log('Device reset broadcast received from another tab');
      performFullReset();
      
      // Redirect
      if (window.location.pathname !== '/') {
        window.location.href = '/?reset_broadcast=true';
      }
    }
  });
  
  // Debug current localStorage status
  try {
    const storageKeys = Object.keys(localStorage);
    if (storageKeys.length > 0) {
      console.log('Current localStorage keys:', storageKeys);
      if (localStorage.getItem('authenticated_user')) {
        console.log('authenticated_user found:', localStorage.getItem('authenticated_user'));
      }
      if (localStorage.getItem('device_key')) {
        console.log('device_key found:', localStorage.getItem('device_key').substring(0, 10) + '...');
      }
      if (localStorage.getItem('superapp_device_header')) {
        console.log('device_header found (length):', localStorage.getItem('superapp_device_header').length);
      }
    } else {
      console.log('localStorage is empty');
    }
  } catch(e) {
    console.error('Error inspecting localStorage:', e);
  }
});
