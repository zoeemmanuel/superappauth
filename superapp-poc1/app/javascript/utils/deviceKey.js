const generateDeviceKey = async () => {
    try {
        const array = new Uint8Array(32);
        crypto.getRandomValues(array);
        const key = Array.from(array)
            .map(b => b.toString(16).padStart(2, '0'))
            .join('');
        console.log('Generated new device key:', key.substring(0, 10) + '...');
        return key;
    } catch (err) {
        console.error('Failed to generate device key:', err);
        return null;
    }
};

const getStoredDeviceKey = async () => {
    try {
        console.log('Checking for existing device key');
        
        // Check session storage first
        const sessionKey = sessionStorage.getItem('device_key');
        
        // If we have a key in session storage, use it
        if (sessionKey) {
            console.log('Found existing device key in session storage:', sessionKey.substring(0, 10) + '...');
            return sessionKey;
        }
        
        // No key in session storage, generate a new one
        console.log('No device key found, generating new one');
        const newKey = await generateDeviceKey();
        
        if (newKey) {
            // Store the new key in session storage
            sessionStorage.setItem('device_key', newKey);
            console.log('Stored new device key in session storage');
        }
        
        return newKey;
    } catch (err) {
        console.error('Error in getStoredDeviceKey:', err);
        
        // Fallback: try to use existing key or generate a new one
        const existingKey = sessionStorage.getItem('device_key');
        if (existingKey) {
            return existingKey;
        }
        
        return generateDeviceKey();
    }
};

const storeDeviceKey = (key) => {
    if (key) {
        sessionStorage.setItem('device_key', key);
        console.log('Stored device key:', key.substring(0, 10) + '...');
    } else {
        console.warn('Attempted to store null or undefined device key');
    }
};

// Store device session data from API response
const storeDeviceSessionData = (data) => {
    if (!data) return;
    
    console.log('Storing device session data:', data);
    
    // Store device key if provided
    if (data.device_key) {
        storeDeviceKey(data.device_key);
    }
    
    // Store authentication state
    if (data.status === 'authenticated') {
        sessionStorage.setItem('device_session', 'authenticated');
    }
    
    // Store user data
    if (data.handle) {
        sessionStorage.setItem('current_handle', data.handle);
    }
    
    if (data.phone) {
        sessionStorage.setItem('current_phone', data.phone);
    }
    
    if (data.guid) {
        sessionStorage.setItem('device_guid', data.guid);
    }
    
    if (data.masked_phone) {
        sessionStorage.setItem('masked_phone', data.masked_phone);
    }
    
    // Set timestamp for cache control
    sessionStorage.setItem('last_device_check', Date.now().toString());
};

// Clear device session data but preserve the key for future recognition
const clearDeviceSession = () => {
    // Save the handle and device key before clearing
    const deviceKey = sessionStorage.getItem('device_key');
    const currentHandle = sessionStorage.getItem('current_handle');
    
    // Store the handle before logout for future cross-device recognition
    if (currentHandle) {
        localStorage.setItem('previous_handle', currentHandle);
    }
    
    // Flag logout state in localStorage (persists across page reloads)
    localStorage.setItem('logout_state', 'true');
    
    // Clear session data
    sessionStorage.clear();
    
    // Restore just the device key for future device recognition
    if (deviceKey) {
        sessionStorage.setItem('device_key', deviceKey);
    }
    
    // Mark logging out in session
    sessionStorage.setItem('logging_out', 'true');
    
    console.log('Cleared device session data, preserved device key for recognition');
};

module.exports = {
    generateDeviceKey,
    getStoredDeviceKey,
    storeDeviceKey,
    storeDeviceSessionData,
    clearDeviceSession
};
