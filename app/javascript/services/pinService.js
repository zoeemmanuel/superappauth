/**
 * PIN Service - Handles PIN operations with offline support
 */
import { localDbService } from './localDbService';
import axios from '../config/axios';

// Simple hash function for PIN (not secure for production)
const hashPin = async (pin) => {
  // In production, use a proper password hashing library
  // This is just a placeholder that mimics a hash
  return `pin_hash_${pin}_${Date.now()}`;
};

/**
 * Set up a PIN both online and offline
 * @param {string} pin PIN to set
 * @param {string} handle User handle
 * @returns {Promise<object>} Result of the operation
 */
export const setupPin = async (pin, handle) => {
  // Validate PIN
  if (!pin || pin.length !== 4 || !/^\d+$/.test(pin)) {
    return { success: false, error: 'Invalid PIN' };
  }
  
  // If online, try server first
  if (navigator.onLine) {
    try {
      const response = await axios.post('/api/v1/auth/setup_pin', {
        pin: pin
      }, {
        headers: getHeaders()
      });
      
      if (response.data.success) {
        // Also store in local database for offline use
        const pinHash = await hashPin(pin);
        await localDbService.updateUserPin(handle, pinHash);
        
        // Store PIN enabled status for UI
        localStorage.setItem('pin_enabled', 'true');
        
        return { success: true };
      } else {
        return { success: false, error: response.data.error || 'Failed to set PIN' };
      }
    } catch (error) {
      console.error('Error setting PIN:', error);
      
      // If server request fails, try offline
      const offlineResult = await setupPinOffline(pin, handle);
      if (offlineResult.success) {
        return { 
          success: true, 
          offline: true, 
          message: 'PIN set offline. Will sync when online.' 
        };
      } else {
        return { success: false, error: 'Failed to set PIN' };
      }
    }
  } else {
    // If offline, use local database
    return setupPinOffline(pin, handle);
  }
};

/**
 * Set up PIN in offline mode
 * @param {string} pin PIN to set
 * @param {string} handle User handle
 * @returns {Promise<object>} Result of the operation
 */
const setupPinOffline = async (pin, handle) => {
  try {
    // Hash PIN (simplified for demo)
    const pinHash = await hashPin(pin);
    
    // Update in local database
    const success = await localDbService.updateUserPin(handle, pinHash);
    
    if (success) {
      // Store PIN enabled status for UI
      localStorage.setItem('pin_enabled', 'true');
      
      return { 
        success: true, 
        offline: true,
        message: 'PIN set offline. Will sync when online.'
      };
    } else {
      return { success: false, error: 'Failed to set PIN offline' };
    }
  } catch (error) {
    console.error('Error setting PIN offline:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Verify PIN
 * @param {string} pin PIN to verify
 * @param {string} handle User handle
 * @returns {Promise<object>} Verification result
 */
export const verifyPin = async (pin, handle) => {
  // Validate PIN
  if (!pin || pin.length !== 4 || !/^\d+$/.test(pin)) {
    return { success: false, error: 'Invalid PIN' };
  }
  
  // If online, try server first
  if (navigator.onLine) {
    try {
      const response = await axios.post('/api/v1/auth/verify_pin', {
        pin: pin,
        handle: handle
      }, {
        headers: getHeaders()
      });
      
      return { success: response.data.success };
    } catch (error) {
      console.error('Error verifying PIN:', error);
      
      // If server request fails, try offline
      const offlineResult = await verifyPinOffline(pin, handle);
      return { 
        success: offlineResult, 
        offline: true,
        message: offlineResult ? 'PIN verified offline' : 'PIN verification failed'
      };
    }
  } else {
    // If offline, use local database
    const result = await verifyPinOffline(pin, handle);
    return { 
      success: result, 
      offline: true,
      message: result ? 'PIN verified offline' : 'PIN verification failed'
    };
  }
};

/**
 * Verify PIN in offline mode
 * @param {string} pin PIN to verify
 * @param {string} handle User handle
 * @returns {Promise<boolean>} Verification result
 */
const verifyPinOffline = async (pin, handle) => {
  try {
    return await localDbService.verifyPin(handle, pin);
  } catch (error) {
    console.error('Error verifying PIN offline:', error);
    return false;
  }
};

/**
 * Get headers for API requests
 * @returns {object} Request headers
 */
const getHeaders = () => {
  const deviceKey = sessionStorage.getItem('device_key');
  const csrfToken = document.querySelector('meta[name="csrf-token"]')?.content;
  
  const headers = {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  };
  
  if (deviceKey) {
    headers['X-Device-Key'] = deviceKey;
  }
  
  if (csrfToken) {
    headers['X-CSRF-Token'] = csrfToken;
  }
  
  return headers;
};

export default { setupPin, verifyPin };
