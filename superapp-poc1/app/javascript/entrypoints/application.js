import "@hotwired/turbo-rails"
import { Application } from "@hotwired/stimulus"
import React from 'react'
import { createRoot } from 'react-dom/client'
import UnifiedLogin from '../components/auth/UnifiedLogin'

// Initialize Stimulus
const application = Application.start()
application.debug = false
window.Stimulus = application

// Mount React component when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('unified-login')
  if (container) {
    try {
      const root = createRoot(container)
      root.render(React.createElement(UnifiedLogin))
    } catch (error) {
      console.error('Error mounting React component:', error)
    }
  }
})
