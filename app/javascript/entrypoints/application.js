import "@hotwired/turbo-rails"
import { Application } from "@hotwired/stimulus"
import React from 'react'
import { createRoot } from 'react-dom/client'
import UnifiedLogin from '../components/auth'
import { APP_VERSION } from '../utils/app_version';

// Initialize Stimulus
const application = Application.start()
application.debug = false
window.Stimulus = application

// Mount React component when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  // First check app version
  const storedAppVersion = localStorage.getItem('superapp_app_version');
  
  if (storedAppVersion !== APP_VERSION) {
    console.log(`App version changed from ${storedAppVersion || 'none'} to ${APP_VERSION}`);
    
    // Preserve authentication-related storage items
    const deviceKey = sessionStorage.getItem('device_key');
    const deviceHeader = localStorage.getItem('superapp_device_header');
    const authVersion = localStorage.getItem('auth_version');
    
    // Clear localStorage but not sessionStorage
    localStorage.clear();
    
    // Restore critical auth data
    localStorage.setItem('superapp_app_version', APP_VERSION);
    if (deviceHeader) localStorage.setItem('superapp_device_header', deviceHeader);
    if (authVersion) localStorage.setItem('auth_version', authVersion);
    
    // Force reload to get fresh assets
    window.location.reload(true);
    return;
  }
  
  // If we get here, no version change, so mount the React component
  const container = document.getElementById('unified-login');
  if (container) {
    try {
      const root = createRoot(container);
      root.render(React.createElement(UnifiedLogin));
    } catch (error) {
      console.error('Error mounting React component:', error);
    }
  }
});
