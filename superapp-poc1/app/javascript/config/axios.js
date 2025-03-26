const axios = require('axios');
const { 
  generateDeviceKey, 
  getStoredDeviceKey, 
  storeDeviceKey,
  storeDeviceSessionData,
  clearDeviceSession
} = require('../utils/deviceKey');

// Create axios instance with dynamic baseURL
const instance = axios.create({
  baseURL: `${window.location.protocol}//${window.location.host}/api/v1/auth`,  
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  }
});

instance.interceptors.request.use(async config => {
  try {
    console.log('========== REQUEST INTERCEPTOR START ==========');
    const url = config.url;
    const currentPath = window.location.pathname;
    console.log('Request URL:', url);
    console.log('Current path:', currentPath);
    
    // If on dashboard and authenticated, skip device checks
    if (currentPath === '/dashboard' && 
        sessionStorage.getItem('device_session') === 'authenticated') {
      const deviceKey = sessionStorage.getItem('device_key');
      if (deviceKey) {
        config.headers['X-Device-Key'] = deviceKey;
      }
      
      // Always add CSRF token if available
      if (window.csrfToken) {
        config.headers['X-CSRF-Token'] = window.csrfToken;
      }
      
      return config;
    }
    
    // Skip ALL requests during logout except the logout request itself
    if (sessionStorage.getItem('logging_out') === 'true') {
      console.log('Logout in progress - blocking non-logout requests');
      if (!url.includes('logout')) {
        console.log('Non-logout request blocked during logout');
        return new Promise(() => {}); // Block request
      }
      // For logout request, only include CSRF
      if (window.csrfToken) {
        config.headers['X-CSRF-Token'] = window.csrfToken;
      }
      return config;
    }
    
    // Handle logout confirmation page separately
    if (currentPath.includes('logout_confirmation')) {
      console.log('On logout confirmation page - skipping device checks');
      if (window.csrfToken) {
        config.headers['X-CSRF-Token'] = window.csrfToken;
      }
      return config;
    }
    
    // Always add CSRF token if available
    if (window.csrfToken) {
      config.headers['X-CSRF-Token'] = window.csrfToken;
      console.log('Added CSRF token to headers');
    }

    // Normal device key handling for other cases
    let deviceKey = sessionStorage.getItem('device_key');
    if (!deviceKey && !url.endsWith('/check_device')) {
      deviceKey = await getStoredDeviceKey();
      if (deviceKey) {
        sessionStorage.setItem('device_key', deviceKey);
      }
    }
    
    if (deviceKey) {
      config.headers['X-Device-Key'] = deviceKey;
      config.headers['X-Forwarded-Proto'] = window.location.protocol.replace(':', '');
      console.log('Added device key and protocol to headers');
    }
    
    console.log('Final request headers:', config.headers);
    console.log('========== REQUEST INTERCEPTOR END ==========');
    return config;
  } catch (error) {
    console.error('Request interceptor error:', error);
    console.error('Error stack:', error.stack);
    return config;
  }
});

instance.interceptors.response.use(
  response => {
    console.log('========== RESPONSE INTERCEPTOR START ==========');
    console.log('Response status:', response.status);
    console.log('Response data:', response.data);
    
    // Handle logged_out status
    if (response.data?.status === 'logged_out' || sessionStorage.getItem('logging_out') === 'true') {
      console.log('Logged out state detected - skipping device key storage');
      return response;
    }
    
    // Use the new method to store ALL session data, not just device key
    if (response.data) {
      storeDeviceSessionData(response.data);
      console.log('Stored device session data from response');
    }
    
    console.log('========== RESPONSE INTERCEPTOR END ==========');
    return response;
  },
  error => {
    console.error('Response error:', {
      status: error.response?.status,
      data: error.response?.data,
      headers: error.config?.headers,
      url: error.config?.url,
      method: error.config?.method
    });
    console.error('Error stack:', error.stack);
    return Promise.reject(error);
  }
);

module.exports = instance;
