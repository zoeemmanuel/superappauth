// Global auth error listener for XMLHttpRequests and fetch
(function() {
  console.log('Auth error listener initialized');
  
  // Track if we're already in the process of handling an auth error
  let handlingAuthError = false;
  let lastAuthErrorTime = 0;
  const AUTH_ERROR_COOLDOWN = 2000; // 2 second cooldown between auth errors
  
  // Helper function to determine if a URL should be ignored for auth errors
  function shouldIgnoreAuthError(url) {
    if (!url) return false;
    
    // Ignore auth validation endpoints to prevent loops
    return (
      url.includes('/auth/verify_session') ||
      url.includes('/api/v1/auth/verify_session') ||
      url.includes('/api/v1/auth/session') ||
      url.includes('/auth/session_status')
    );
  }
  
  // Helper function to prevent multiple auth errors in rapid succession
  function canDispatchAuthError() {
    const now = Date.now();
    
    // If we're already handling an auth error or had one recently, skip
    if (handlingAuthError || (now - lastAuthErrorTime < AUTH_ERROR_COOLDOWN)) {
      console.log('Skipping duplicate auth error - already handling or too soon');
      return false;
    }
    
    // Update state to prevent duplicates
    handlingAuthError = true;
    lastAuthErrorTime = now;
    
    // Reset handling flag after a delay
    setTimeout(() => {
      handlingAuthError = false;
    }, AUTH_ERROR_COOLDOWN);
    
    return true;
  }
  
  // Helper function to safely dispatch auth error event
  function dispatchAuthError(source, url) {
    // Check if this is an endpoint we should ignore
    if (shouldIgnoreAuthError(url)) {
      console.log(`Ignoring 401 from ${source} auth check endpoint to prevent loops:`, url);
      return false;
    }
    
    // Check if we should dispatch
    if (!canDispatchAuthError()) {
      return false;
    }
    
    console.warn(`401 unauthorized response detected in ${source}:`, url);
    
    try {
      window.dispatchEvent(new CustomEvent('superapp_auth_error', {
        detail: { source: source, url: url }
      }));
      return true;
    } catch (e) {
      console.error('Error dispatching auth error event:', e);
      return false;
    }
  }
  
  // Monitor XMLHttpRequest for 401 errors
  const originalOpen = XMLHttpRequest.prototype.open;
  XMLHttpRequest.prototype.open = function() {
    this.addEventListener('load', function() {
      if (this.status === 401) {
        dispatchAuthError('xhr', this.responseURL);
      }
    });
    originalOpen.apply(this, arguments);
  };
  
  // Monitor fetch for 401 errors
  const originalFetch = window.fetch;
  window.fetch = function() {
    return originalFetch.apply(this, arguments).then(response => {
      if (response.status === 401) {
        dispatchAuthError('fetch', response.url);
      }
      return response;
    });
  };
})();
