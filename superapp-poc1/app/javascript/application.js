// Entry point for the build script in your package.json
import "@hotwired/turbo-rails"
import { Application } from "@hotwired/stimulus"
import React from 'react'
import { createRoot } from 'react-dom/client'
import UnifiedLogin from './components/auth/UnifiedLogin'
import "./application.tailwind.css"
import './components/DeviceRegistrationButtonFix'

console.log('Application.js loaded');

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
