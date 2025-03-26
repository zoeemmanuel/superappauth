// Entry point for the build script in your package.json
import "@hotwired/turbo-rails"
import { Application } from "@hotwired/stimulus"
import React from 'react'
import { createRoot } from 'react-dom/client'
import UnifiedLogin from './components/auth/UnifiedLogin'
import "./application.tailwind.css"
import './components/DeviceRegistrationButtonFix'
import './utils/resetHandler'
import './utils/authErrorListener';

console.log('Application.js loaded');

// CRITICAL: Create global namespace for our app functionality
window.SuperApp = window.SuperApp || {};

// Initialize placeholder functions immediately 
window.SuperApp.offlineSupport = {
  initialized: false,
  loading: false,
  error: null,
  initOfflineSupport: function() { 
    console.log('Placeholder offline support function called');
    return Promise.resolve(false);
  },
  overrideHandleUpdate: function() {
    console.log('Placeholder handle update function called');
    return false;
  },
  overrideDeviceRename: function() {
    console.log('Placeholder device rename function called');
    return false;
  },
  overridePinUpdate: function() {
    console.log('Placeholder PIN update function called');
    return false;
  },
  showToast: function(message, type) {
    console.log('Placeholder toast:', message, type);
  },
  forceSyncNow: function() {
    console.log('Placeholder force sync called');
    return Promise.resolve(false);
  }
};

// Cross-browser reset check system
(function() {
  console.log('Initializing cross-browser reset check system');
  
  // Function to check auth validity on application startup
  async function validateAuthOnStartup() {
    console.log('Validating authentication on startup');
    // Only perform validation if we have authenticated flag
    if (localStorage.getItem('authenticated_user') !== 'true') {
      console.log('No authenticated flag found, skipping validation');
      return;
    }
    
    // Check if auth is expired
    const expiration = parseInt(localStorage.getItem('auth_expiration') || '0');
    if (expiration > 0 && Date.now() > expiration) {
      console.warn('Auth data expired, clearing');
      localStorage.removeItem('authenticated_user');
      localStorage.setItem('device_reset', 'true');
      return;
    }
    
    try {
      // Make validation request
      const response = await fetch('/api/v1/auth/verify_session', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });
      
      if (!response.ok) {
        console.warn('Auth validation request failed');
        return;
      }
      
      const data = await response.json();
      
      // If not authenticated according to server, clear local auth
      if (!data.authenticated) {
        console.warn('Server reports not authenticated, clearing auth flag');
        localStorage.removeItem('authenticated_user');
        return;
      }
      
      // Check auth version
      const localVersion = localStorage.getItem('auth_version');
      if (localVersion && parseInt(localVersion) < parseInt(data.auth_version)) {
        console.warn(`Auth version mismatch: local=${localVersion}, server=${data.auth_version}`);
        // Clear auth and trigger reset handler
        localStorage.removeItem('authenticated_user');
        localStorage.setItem('device_reset', 'true');
      }
    } catch (error) {
      console.error('Error validating auth on startup:', error);
      // Don't clear auth on network errors to prevent flicker
    }
  }
  
  // Run validation on startup
  validateAuthOnStartup();
  
  // Add navigation guard to validate auth before accessing protected pages
  document.addEventListener('click', async function(event) {
    // Only check links
    if (event.target.tagName !== 'A' && !event.target.closest('a')) return;
    
    const link = event.target.tagName === 'A' ? event.target : event.target.closest('a');
    const href = link.getAttribute('href');
    
    // Only intercept dashboard/protected page navigation
    if (!href || !href.includes('/dashboard')) return;
    
    // If authenticated, validate before navigation
    if (localStorage.getItem('authenticated_user') === 'true') {
      event.preventDefault();
      
      try {
        const response = await fetch('/api/v1/auth/verify_session', {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' }
        });
        
        if (!response.ok) {
          throw new Error('Session validation failed');
        }
        
        const data = await response.json();
        if (!data.authenticated) {
          console.warn('Session invalid, clearing auth and redirecting to login');
          localStorage.removeItem('authenticated_user');
          window.location.href = '/?session_expired=true';
          return;
        }
        
        // Check version
        const localVersion = localStorage.getItem('auth_version');
        if (localVersion && parseInt(localVersion) < parseInt(data.auth_version)) {
          console.warn(`Auth version mismatch: local=${localVersion}, server=${data.auth_version}`);
          localStorage.removeItem('authenticated_user');
          localStorage.setItem('device_reset', 'true');
          window.location.href = '/?auth_reset=true';
          return;
        }
        
        // If all checks pass, continue with navigation
        window.location.href = href;
      } catch (error) {
        console.error('Error validating session before navigation:', error);
        // Let the navigation proceed on network errors
        window.location.href = href;
      }
    }
  });
})();

// Mirror functions to global window for legacy code
window.initOfflineSupport = function() {
  return window.SuperApp.offlineSupport.initOfflineSupport();
};
window.overrideHandleUpdate = function() {
  return window.SuperApp.offlineSupport.overrideHandleUpdate();
};
window.overrideDeviceRename = function() {
  return window.SuperApp.offlineSupport.overrideDeviceRename();
};
window.overridePinUpdate = function() {
  return window.SuperApp.offlineSupport.overridePinUpdate();
};
window.showToast = function(message, type) {
  return window.SuperApp.offlineSupport.showToast(message, type);
};
window.forceSyncNow = function() {
  return window.SuperApp.offlineSupport.forceSyncNow();
};

// Mount React component
document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM loaded in application.js');
  const container = document.getElementById('unified-login');
  console.log('Container found:', !!container);
  
  if (container) {
    console.log('Creating React root');
    try {
      const root = createRoot(container);
      console.log('Root created');
      console.log('Rendering UnifiedLogin component');
      root.render(<UnifiedLogin />);
      console.log('Render complete');
    } catch (error) {
      console.error('Error mounting React:', error);
    }
  }
});

// Initialize Stimulus
const application = Application.start()
application.debug = false
window.Stimulus = application

// Set up axios CSRF token
if (window.csrfToken) {
  console.log('CSRF token found');
} else {
  console.warn('No CSRF token found');
}

console.log('Application.js initialization complete');

// Function to load offline support
window.loadOfflineSupport = function() {
  if (window.SuperApp.offlineSupport.loading) {
    console.log('Offline support already loading...');
    return Promise.resolve(false);
  }
  
  console.log('Loading offline support module...');
  window.SuperApp.offlineSupport.loading = true;
  
  // First try loading as a direct script if we're on dashboard
  if (window.location.pathname.includes('/dashboard')) {
    // Create a script tag and add it to the page
    const script = document.createElement('script');
    script.src = '/assets/dashboard-offline.js'; // Adjust path as needed
    script.id = 'offline-support-script';
    script.async = true;
    
    // Create a promise to track loading
    return new Promise((resolve, reject) => {
      script.onload = function() {
        console.log('Offline support script loaded successfully');
        window.SuperApp.offlineSupport.loading = false;
        
        // Try to initialize if loaded successfully
        if (typeof window.SuperApp.offlineSupport.initOfflineSupport === 'function') {
          setTimeout(() => {
            try {
              window.SuperApp.offlineSupport.initOfflineSupport()
                .then(() => resolve(true))
                .catch(err => {
                  console.error('Error initializing offline support:', err);
                  reject(err);
                });
            } catch (error) {
              console.error('Error calling initOfflineSupport:', error);
              reject(error);
            }
          }, 100);
        } else {
          resolve(true);
        }
      };
      
      script.onerror = function(err) {
        console.error('Error loading offline support script:', err);
        window.SuperApp.offlineSupport.loading = false;
        window.SuperApp.offlineSupport.error = 'Failed to load script';
        
        // Fall back to dynamic import
        loadOfflineSupportFallback()
          .then(resolve)
          .catch(reject);
      };
      
      document.head.appendChild(script);
    });
  } else {
    // Not on dashboard, use dynamic import fallback
    return loadOfflineSupportFallback();
  }
};

// Fallback method using dynamic import
function loadOfflineSupportFallback() {
  console.log('Using fallback dynamic import for offline support...');
  
  return import('./dashboard-offline.js')
    .then(module => {
      console.log('Offline support module imported successfully');
      
      // Preserve original functions (legacy way)
      if (typeof module.initOfflineSupport === 'function') {
        window.initOfflineSupport = module.initOfflineSupport;
      }
      if (typeof module.overrideHandleUpdate === 'function') {
        window.overrideHandleUpdate = module.overrideHandleUpdate;
      }
      if (typeof module.overrideDeviceRename === 'function') {
        window.overrideDeviceRename = module.overrideDeviceRename;
      }
      if (typeof module.overridePinUpdate === 'function') {
        window.overridePinUpdate = module.overridePinUpdate;
      }
      if (typeof module.showToast === 'function') {
        window.showToast = module.showToast;
      }
      if (typeof module.forceSyncNow === 'function') {
        window.forceSyncNow = module.forceSyncNow;
      }
      
      // Store in our namespace
      window.SuperApp.offlineSupport = {
        ...window.SuperApp.offlineSupport,
        initialized: false,
        loading: false,
        error: null,
        ...module
      };
      
      // Signal that module is loaded
      window.dispatchEvent(new CustomEvent('offline-support-loaded'));
      
      // Try to initialize immediately if we're on dashboard
      if (window.location.pathname.includes('/dashboard')) {
        try {
          return window.SuperApp.offlineSupport.initOfflineSupport();
        } catch (err) {
          console.error('Error initializing offline support:', err);
          return Promise.reject(err);
        }
      }
      
      return Promise.resolve(true);
    })
    .catch(err => {
      console.error('Error importing offline support module:', err);
      window.SuperApp.offlineSupport.loading = false;
      window.SuperApp.offlineSupport.error = err.message || 'Import failed';
      window.dispatchEvent(new CustomEvent('offline-support-error', { detail: err }));
      return Promise.reject(err);
    });
}

// Initialize offline support automatically if on dashboard
if (window.location.pathname.includes('/dashboard')) {
  // Wait for DOM to be fully loaded
  document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, scheduling offline support initialization...');
    setTimeout(() => {
      window.loadOfflineSupport()
        .then(result => {
          console.log('Offline support loading completed:', result);
        })
        .catch(err => {
          console.error('Failed to load offline support:', err);
        });
    }, 500);
  });
}
