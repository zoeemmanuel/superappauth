// Updated deviceKey.js with consistent ES module exports and enhanced logging
import { localDbService } from '../services/localDbService';
import { syncService } from '../services/syncService';

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

// Enhanced method to validate auth version before completing auto-login
const validateAuthVersion = async () => {
  try {
    console.log('Validating auth version with server');
    const localAuthVersion = localStorage.getItem('auth_version');
    
    // Get stored device key from both localStorage and sessionStorage
    const deviceKey = await getStoredDeviceKey();
    
    // Get complete header if available
    const completeHeader = getCompleteDeviceHeaderFromStorage();
    
    // ADDED: Log header details for debugging
    if (completeHeader) {
      console.log('Found complete device header with deviceId: ' + 
                 completeHeader.deviceId.substring(0, 10) + '...');
      console.log('Header includes user info for: ' + completeHeader.userHandle);
      
      // Check if characteristics are included
      if (completeHeader.deviceCharacteristics) {
        console.log('Device header contains characteristics with keys:', 
                   Object.keys(completeHeader.deviceCharacteristics).join(', '));
      } else {
        console.warn('Device header missing deviceCharacteristics section');
      }
    } else {
      console.log('No complete device header found in storage');
    }
    
    // Prepare headers for verification request
    const headers = {
      'Content-Type': 'application/json'
    };
    
    if (deviceKey) {
      headers['X-Device-Key'] = deviceKey;
    }
    
    if (completeHeader) {
      headers['X-Device-Header'] = JSON.stringify(completeHeader);
    }
    
    // Make API call to verify the version with credentials included
    const response = await fetch('/api/v1/auth/verify_session', {
      method: 'GET',
      headers: headers,
      credentials: 'same-origin' // Important: include cookies
    });

    if (!response.ok) {
      console.warn('Error response from server during auth validation:', response.status);
      return false;
    }

    const data = await response.json();
    if (!data.authenticated) {
      console.warn('Session not authenticated on server');
      return false;
    }

    // Check local auth version if available
    if (localAuthVersion) {
      // Compare versions
      if (parseInt(localAuthVersion) < parseInt(data.auth_version)) {
        console.warn(`Auth version mismatch: local=${localAuthVersion}, server=${data.auth_version}`);
        return false;
      }
    } else if (data.auth_version) {
      // If we don't have a local version but server has one, store it
      localStorage.setItem('auth_version', data.auth_version.toString());
      console.log(`Setting auth version from server: ${data.auth_version}`);
    }

    // Check session valid time
    if (data.sessions_valid_after && data.login_time) {
      try {
        const sessionsValidAfter = new Date(data.sessions_valid_after * 1000);
        const loginTime = new Date(data.login_time);
        
        if (loginTime < sessionsValidAfter) {
          console.warn('Session login time is before sessions_valid_after timestamp');
          return false;
        }
      } catch (e) {
        console.error('Error comparing timestamps:', e);
        // Continue even if timestamp comparison fails
      }
    }

    console.log('Auth version valid');
    return true;
  } catch (err) {
    console.error('Error validating auth version:', err);
    return false;
  }
};

// Enhanced getCompleteDeviceHeaderFromStorage with expiration check and detailed logging
const getCompleteDeviceHeaderFromStorage = () => {
  try {
    const headerString = localStorage.getItem('superapp_device_header');
    if (!headerString) {
      console.log('No device header found in localStorage');
      return null;
    }
    
    // ADDED: Log header string details
    console.log('Found device header string of length:', headerString.length);
    
    // NEW: Check expiration
    const expiration = parseInt(localStorage.getItem('superapp_device_header_expiration') || '0');
    if (expiration > 0 && Date.now() > expiration) {
      console.log('Device header expired, removing. Current time:', Date.now(), 'Expiration:', expiration);
      localStorage.removeItem('superapp_device_header');
      localStorage.removeItem('superapp_device_header_expiration');
      return null;
    }
    
    const parsedHeader = JSON.parse(headerString);
    
    // ENHANCED: More explicit validation of required fields with better logging
    const hasDeviceId = !!parsedHeader.deviceId;
    const hasUserGuid = !!parsedHeader.userGuid;
    const hasUserHandle = !!parsedHeader.userHandle;
    const hasCharacteristics = !!parsedHeader.deviceCharacteristics;
    
    console.log('Header validation results:', {
      hasDeviceId,
      hasUserGuid,
      hasUserHandle,
      hasCharacteristics
    });
    
    if (hasDeviceId && hasUserGuid && hasUserHandle) {
      console.log('Found complete device header in localStorage with all required fields:', {
        deviceId: parsedHeader.deviceId.substring(0, 10) + '...',
        userGuid: parsedHeader.userGuid,
        userHandle: parsedHeader.userHandle,
        characteristicsAvailable: hasCharacteristics
      });
      
      if (hasCharacteristics) {
        // Log characteristics keys for debugging
        const charKeys = Object.keys(parsedHeader.deviceCharacteristics);
        console.log('Device characteristics includes:', charKeys.join(', '));
      } else {
        console.warn('Header missing deviceCharacteristics section');
      }
      
      return parsedHeader;
    } else {
      console.warn('Found incomplete device header in localStorage (missing required fields):', {
        hasDeviceId: hasDeviceId,
        hasUserGuid: hasUserGuid,
        hasUserHandle: hasUserHandle
      });
      // ADDED: Remove incomplete header to prevent future issues
      if (!hasDeviceId || !hasUserGuid || !hasUserHandle) {
        console.warn('Removing incomplete device header from localStorage');
        localStorage.removeItem('superapp_device_header');
        localStorage.removeItem('superapp_device_header_expiration');
      }
      return null;
    }
  } catch (e) {
    console.error('Error parsing device header from localStorage:', e);
    // Remove invalid JSON
    localStorage.removeItem('superapp_device_header');
    localStorage.removeItem('superapp_device_header_expiration');
    return null;
  }
};

// UPDATED: Modified to check for complete header first with improved logging
const getStoredDeviceKey = async () => {
    try {
        console.log('Checking for existing device key');
        
        // NEW: Check if we have a complete device header first
        const completeHeader = getCompleteDeviceHeaderFromStorage();
        if (completeHeader && completeHeader.deviceId) {
            console.log('Using deviceId from complete device header:', completeHeader.deviceId.substring(0, 10) + '...');
            
            // Store this in sessionStorage for this session
            sessionStorage.setItem('device_key', completeHeader.deviceId);
            return completeHeader.deviceId;
        }
        
        // Check session storage next
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

// Enhanced getDeviceFingerprint with detailed logging and browser-specific optimizations
const getDeviceFingerprint = async () => {
  try {
    console.log('Generating enhanced device fingerprint with hardware identification');
    
    // Detect browser family for browser-specific optimizations
    const userAgent = navigator.userAgent;
    const browserFamily = detectBrowserFamily(userAgent);
    console.log('Detected browser family:', browserFamily);
    
    // Base characteristics (existing code)
    const characteristics = {
      platform: navigator.platform || 'unknown',
      screenWidth: window.screen.width,
      screenHeight: window.screen.height,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      language: navigator.language || 'unknown',
      devicePixelRatio: window.devicePixelRatio || 1,
      browserFamily: browserFamily,
      colorDepth: window.screen.colorDepth,
      cpuCores: navigator.hardwareConcurrency || 0,
      touchSupport: 'ontouchstart' in window || navigator.maxTouchPoints > 0,
      cookiesEnabled: navigator.cookieEnabled
    };
    
    // Log base characteristics
    console.log('Base device characteristics:', {
      platform: characteristics.platform,
      screen: `${characteristics.screenWidth}x${characteristics.screenHeight}`,
      pixelRatio: characteristics.devicePixelRatio,
      timezone: characteristics.timezone,
      cores: characteristics.cpuCores
    });
    
    // Device type detection (existing code)
    let deviceType = "Desktop";
    let deviceModel = "";
    const userAgentLower = userAgent.toLowerCase();
    
    // iOS devices
    if (/iphone|ipad|ipod/.test(userAgentLower)) {
      if (/ipad/.test(userAgentLower)) {
        deviceType = "iPad";
      } else if (/ipod/.test(userAgentLower)) {
        deviceType = "iPod";
      } else {
        deviceType = "iPhone";
      }
      // Try to get iOS version
      const iosMatch = userAgentLower.match(/os (\d+)_(\d+)/);
      if (iosMatch) {
        deviceModel = `iOS ${iosMatch[1]}.${iosMatch[2]}`;
      }
    } 
    // Android devices
    else if (/android/.test(userAgentLower)) {
      deviceType = /mobile/.test(userAgentLower) ? "Android Phone" : "Android Tablet";
    } 
    // Mac devices
    else if (/macintosh|mac os x/.test(userAgentLower)) {
      deviceType = "MacBook";
      // Check if it might be an iMac/Mac Pro
      if (window.screen.width > 1800 && window.screen.height > 1000) {
        deviceType = "iMac/Mac Pro";
      }
    } 
    // Windows devices
    else if (/windows/.test(userAgentLower)) {
      deviceType = "Windows PC";
    } 
    // Linux devices
    else if (/linux/.test(userAgentLower)) {
      deviceType = "Linux PC";
    }
    
    characteristics.deviceType = deviceType;
    characteristics.deviceModel = deviceModel;
    
    console.log('Detected device type:', deviceType, deviceModel ? `(${deviceModel})` : '');
    
    // ------- HARDWARE IDENTIFICATION (NEW) -------
    
    // 1. GPU Information via WebGL
    try {
      const webglInfo = getWebGLInfo();
      if (webglInfo) {
        characteristics.webglRenderer = webglInfo.renderer;
        characteristics.webglVendor = webglInfo.vendor;
        console.log('WebGL renderer:', webglInfo.renderer);
        console.log('WebGL vendor:', webglInfo.vendor);
      }
    } catch (e) {
      console.warn('Error getting WebGL info:', e);
      characteristics.webglRenderer = 'unavailable';
      characteristics.webglVendor = 'unavailable';
    }
    
    // 2. Memory Size
    try {
      // Check if deviceMemory API is available
      if (navigator.deviceMemory) {
        characteristics.memorySize = navigator.deviceMemory;
        console.log('Device memory from API:', navigator.deviceMemory + 'GB');
      } else {
        // Fallback: Estimate based on other factors
        characteristics.memorySize = estimateMemorySize();
        console.log('Estimated device memory:', characteristics.memorySize + 'GB');
      }
    } catch (e) {
      console.warn('Error getting memory size:', e);
      characteristics.memorySize = 0;
    }
    
    // 3. CPU Model (where available) with browser-specific detection
    try {
      characteristics.cpuModel = detectCPUModel(browserFamily, userAgentLower);
      console.log('Detected CPU model:', characteristics.cpuModel);
    } catch (e) {
      console.warn('Error detecting CPU model:', e);
      characteristics.cpuModel = 'unavailable';
    }
    
    // 4. Canvas Fingerprinting
    try {
      characteristics.canvasFingerprint = generateCanvasFingerprint(browserFamily);
      console.log('Generated canvas fingerprint:', 
                 characteristics.canvasFingerprint.substring(0, 10) + '...');
    } catch (e) {
      console.warn('Error generating canvas fingerprint:', e);
      characteristics.canvasFingerprint = 'unavailable';
    }
    
    // 5. WebGL Fingerprinting
    try {
      characteristics.webglFingerprint = generateWebGLFingerprint(browserFamily);
      console.log('Generated WebGL fingerprint:', 
                 characteristics.webglFingerprint.substring(0, 10) + '...');
    } catch (e) {
      console.warn('Error generating WebGL fingerprint:', e);
      characteristics.webglFingerprint = 'unavailable';
    }
    
    // 6. Hardware Fingerprint (composite of other hardware identifiers)
    try {
      characteristics.hardwareFingerprint = generateHardwareFingerprint(characteristics);
      console.log('Generated hardware fingerprint:', 
                 characteristics.hardwareFingerprint.substring(0, 10) + '...');
    } catch (e) {
      console.warn('Error generating hardware fingerprint:', e);
      characteristics.hardwareFingerprint = 'unavailable';
    }
    
    // Log summary of hardware identifiers
    console.log('Generated enhanced device fingerprint with hardware identification');
    console.log('Collected identifiers:', {
      cpuModel: !!characteristics.cpuModel,
      webglRenderer: !!characteristics.webglRenderer,
      canvasFingerprint: !!characteristics.canvasFingerprint,
      webglFingerprint: !!characteristics.webglFingerprint,
      hardwareFingerprint: !!characteristics.hardwareFingerprint,
      memorySize: characteristics.memorySize
    });
    
    return characteristics;
  } catch (err) {
    console.error('Error generating device fingerprint:', err);
    // Return basic characteristics to prevent complete failure
    return {
      platform: navigator.platform || 'unknown',
      screenWidth: window.screen.width,
      screenHeight: window.screen.height,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      language: navigator.language || 'unknown',
      devicePixelRatio: window.devicePixelRatio || 1,
      browserFamily: detectBrowserFamily(navigator.userAgent),
      colorDepth: window.screen.colorDepth
    };
  }
};

// Helper function to get WebGL renderer and vendor information with improved error handling
const getWebGLInfo = () => {
  // Try WebGL2 first, fall back to WebGL1
  let gl = null;
  let canvas = document.createElement('canvas');
  
  try {
    // ADDED: Log WebGL context creation attempt
    console.log('Attempting to get WebGL context');
    
    gl = canvas.getContext('webgl2') || 
         canvas.getContext('webgl') || 
         canvas.getContext('experimental-webgl');
    
    if (!gl) {
      console.warn('WebGL context not available');
      return null;
    }
    
    const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
    
    if (!debugInfo) {
      // Fallback if extension not available
      console.warn('WEBGL_debug_renderer_info extension not available, using basic renderer info');
      return {
        renderer: gl.getParameter(gl.RENDERER) || 'unknown',
        vendor: gl.getParameter(gl.VENDOR) || 'unknown'
      };
    }
    
    const renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) || 'unknown';
    const vendor = gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL) || 'unknown';
    
    console.log('WebGL info retrieved successfully:', {
      renderer: renderer,
      vendor: vendor
    });
    
    return {
      renderer: renderer,
      vendor: vendor
    };
  } catch (e) {
    console.warn('WebGL info extraction error:', e);
    return null;
  } finally {
    // Clean up
    if (gl) {
      const loseContext = gl.getExtension('WEBGL_lose_context');
      if (loseContext) {
        loseContext.loseContext();
        console.log('WebGL context released');
      }
    }
    canvas = null;
  }
};

// Helper function to estimate memory size (when deviceMemory API not available)
const estimateMemorySize = () => {
  // Calculate based on available features
  const cores = navigator.hardwareConcurrency || 2;
  const isHighEnd = window.screen.width >= 1920 || window.screen.height >= 1080;
  
  // Simple estimation logic
  if (cores >= 8 && isHighEnd) return 16;
  if (cores >= 6) return 8;
  if (cores >= 4) return 4;
  return 2;
};

// Helper function to detect CPU model with browser-specific optimizations
const detectCPUModel = (browserFamily, userAgent) => {
  // CPU model is not directly accessible from JavaScript for security reasons
  // We can infer basic information from user agent and performance
  
  let cpuInfo = 'unknown';
  
  // Browser-specific CPU detection
  switch (browserFamily) {
    case 'Chrome':
    case 'Edge':
      // Chrome/Edge might include CPU model in user agent for Windows
      if (userAgent.includes('Intel')) {
        const match = userAgent.match(/Intel\s([^;)]+)/i);
        if (match && match[1]) {
          cpuInfo = `Intel ${match[1].trim()}`;
        } else {
          cpuInfo = 'Intel';
        }
      } else if (userAgent.includes('AMD')) {
        const match = userAgent.match(/AMD\s([^;)]+)/i);
        if (match && match[1]) {
          cpuInfo = `AMD ${match[1].trim()}`;
        } else {
          cpuInfo = 'AMD';
        }
      }
      break;
      
    case 'Firefox':
      // Firefox may include different CPU info
      if (userAgent.includes('Intel')) {
        cpuInfo = 'Intel';
      } else if (userAgent.includes('AMD')) {
        cpuInfo = 'AMD';
      }
      // Firefox often includes less CPU detail, but might show cores
      break;
      
    case 'Safari':
      // Safari on macOS typically doesn't expose CPU model details
      // But we can detect Apple Silicon vs Intel
      if (userAgent.includes('Macintosh')) {
        // Modern Macs with Apple Silicon use ARM architecture
        if (navigator.userAgentData?.platform === 'macOS' && navigator.userAgentData?.brands) {
          cpuInfo = 'Apple Silicon';
        } else {
          cpuInfo = 'Intel Mac';
        }
      }
      break;
      
    default:
      // Generic detection for other browsers
      if (userAgent.includes('Intel')) {
        cpuInfo = 'Intel';
      } else if (userAgent.includes('AMD')) {
        cpuInfo = 'AMD';
      } else if (userAgent.includes('Apple') && navigator.hardwareConcurrency >= 8) {
        cpuInfo = 'Apple Silicon';
      }
  }
  
  // For Apple Silicon devices, try to detect M1/M2
  if (cpuInfo === 'Apple Silicon' && navigator.hardwareConcurrency) {
    // M1 Pro/Max typically has 8-10 cores, M2 similar but newer
    // This is a rough approximation
    const cores = navigator.hardwareConcurrency;
    if (cores <= 8) {
      cpuInfo = 'Apple M1/M2';
    } else if (cores <= 10) {
      cpuInfo = 'Apple M1 Pro/M2 Pro';
    } else {
      cpuInfo = 'Apple M1 Max/M2 Max';
    }
  }
  
  // Add core count if available
  const cores = navigator.hardwareConcurrency;
  if (cores) {
    cpuInfo += ` (${cores} cores)`;
  }
  
  return cpuInfo;
};

// Helper function to generate a canvas fingerprint with browser-specific adjustments
const generateCanvasFingerprint = (browserFamily) => {
  try {
    console.log('Generating canvas fingerprint for browser:', browserFamily);
    
    const canvas = document.createElement('canvas');
    canvas.width = 200;
    canvas.height = 50;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      console.warn('Canvas 2D context not supported');
      return 'canvas-unsupported';
    }
    
    // Apply different rendering for different browsers to normalize output
    switch (browserFamily) {
      case 'Safari':
        // Safari handles gradients and shadows differently
        ctx.fillStyle = "#f8f8f8";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Use simpler text rendering for Safari
        ctx.fillStyle = "rgba(100, 50, 200, 0.8)";
        ctx.font = '16px Arial';
        ctx.fillText('SuperAppDevice', 10, 25);
        break;
        
      case 'Firefox':
        // Firefox has different text rendering
        ctx.fillStyle = "#e8f4fc";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Use a gradient that renders more consistently in Firefox
        const gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
        gradient.addColorStop(0, "rgba(120, 30, 255, 0.8)");
        gradient.addColorStop(1, "rgba(255, 30, 120, 0.8)");
        ctx.fillStyle = gradient;
        ctx.font = '20px Arial';
        ctx.fillText('SuperApp', 10, 30);
        break;
        
      default:
        // Chrome/Edge/Opera have similar rendering engines (Blink)
        // Fill with a light blue
        ctx.fillStyle = "#e8f4fc";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Draw text with different styles
        ctx.fillStyle = "rgba(120, 30, 255, 0.8)";
        ctx.font = '20px Arial';
        ctx.fillText('SuperApp', 10, 30);
        
        // Draw some shapes
        ctx.beginPath();
        ctx.arc(160, 25, 20, 0, Math.PI * 2);
        ctx.closePath();
        ctx.fillStyle = "rgba(255, 70, 70, 0.6)";
        ctx.fill();
        
        ctx.beginPath();
        ctx.arc(140, 25, 15, 0, Math.PI);
        ctx.closePath();
        ctx.fillStyle = "rgba(30, 200, 70, 0.4)";
        ctx.fill();
    }
    
    // Add common elements for all browsers
    // Draw a browser-agnostic rectangle
    ctx.fillStyle = "rgba(30, 30, 30, 0.5)";
    ctx.fillRect(50, 35, 100, 10);
    
    // Get the data URL and hash it
    const dataURL = canvas.toDataURL();
    return hashString(dataURL);
  } catch (e) {
    console.warn('Canvas fingerprinting error:', e);
    return 'canvas-error';
  }
};

// Helper function to generate a WebGL fingerprint with browser-specific adjustments
const generateWebGLFingerprint = (browserFamily) => {
  try {
    console.log('Generating WebGL fingerprint for browser:', browserFamily);
    
    const canvas = document.createElement('canvas');
    canvas.width = 200;
    canvas.height = 50;
    
    // Try to get WebGL context
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    if (!gl) {
      console.warn('WebGL not supported for fingerprinting');
      return 'webgl-unsupported';
    }
    
    // Collect supported extensions
    const extensions = gl.getSupportedExtensions() || [];
    
    // Browser-specific parameter selections
    let parameters = [];
    
    // Common parameters for all browsers
    const commonParams = [
      'MAX_TEXTURE_SIZE',
      'MAX_VIEWPORT_DIMS',
      'MAX_RENDERBUFFER_SIZE'
    ];
    
    // Browser-specific parameters that are reliable cross-browser
    switch (browserFamily) {
      case 'Safari':
        // Safari reports some params differently
        parameters = [
          ...commonParams,
          'MAX_TEXTURE_IMAGE_UNITS',
          'MAX_VERTEX_TEXTURE_IMAGE_UNITS'
        ];
        break;
        
      case 'Firefox':
        // Firefox has good consistency with these
        parameters = [
          ...commonParams,
          'MAX_VERTEX_ATTRIBS',
          'MAX_VERTEX_UNIFORM_VECTORS',
          'MAX_VARYING_VECTORS'
        ];
        break;
        
      default:
        // Chrome/Edge/Opera (Blink-based browsers)
        parameters = [
          ...commonParams,
          'MAX_VERTEX_UNIFORM_VECTORS',
          'MAX_FRAGMENT_UNIFORM_VECTORS',
          'MAX_CUBE_MAP_TEXTURE_SIZE',
          'ALIASED_LINE_WIDTH_RANGE',
          'ALIASED_POINT_SIZE_RANGE'
        ];
    }
    
    let paramValues = {};
    parameters.forEach(param => {
      try {
        paramValues[param] = gl.getParameter(gl[param]);
      } catch (e) {
        console.warn(`Error getting WebGL parameter ${param}:`, e);
        paramValues[param] = null;
      }
    });
    
    // Create a simple fingerprint combining some extensions and parameters
    const fingerprint = JSON.stringify({
      ext: extensions.slice(0, 10), // First 10 extensions
      params: paramValues,
      renderer: getWebGLInfo()?.renderer || 'unknown',
      vendor: getWebGLInfo()?.vendor || 'unknown'
    });
    
    return hashString(fingerprint);
  } catch (e) {
    console.warn('WebGL fingerprinting error:', e);
    return 'webgl-error';
  }
};

// Helper function to generate a hardware fingerprint from other components
const generateHardwareFingerprint = (characteristics) => {
  try {
    // Combine hardware-specific properties
    // Select properties that are most consistent across browsers
    const hardwareComponents = [
      characteristics.platform || '',
      characteristics.webglRenderer || '',
      characteristics.webglVendor || '',
      characteristics.cpuModel || '',
      characteristics.memorySize?.toString() || '',
      characteristics.cpuCores?.toString() || '',
      characteristics.screenWidth + 'x' + characteristics.screenHeight || ''
    ];
    
    // Create a string and hash it
    const hardwareString = hardwareComponents.join('::');
    return hashString(hardwareString);
  } catch (e) {
    console.warn('Hardware fingerprinting error:', e);
    return 'hardware-error';
  }
};

// Improved hash function for fingerprinting
const hashString = (str) => {
  try {
    let hash = 0;
    if (str.length === 0) return 'empty';
    
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    
    // Convert to positive hex string
    return (hash >>> 0).toString(16);
  } catch (e) {
    console.warn('Hashing error:', e);
    return 'hash-error';
  }
};

// Enhanced browser family detection
const detectBrowserFamily = (userAgent) => {
    // Order is important - Edge contains Chrome and Safari strings
    if (/Edg|Edge/i.test(userAgent)) return 'Edge';
    if (/OPR|Opera/i.test(userAgent)) return 'Opera';
    if (/Chrome/i.test(userAgent)) return 'Chrome';
    if (/Firefox/i.test(userAgent)) return 'Firefox';
    if (/Safari/i.test(userAgent)) return 'Safari';
    if (/MSIE|Trident/i.test(userAgent)) return 'Internet Explorer';
    return 'Unknown';
};

// IMPROVED: Generate and store a secure device header for cross-browser recognition with better validation
const generateDeviceHeader = async (deviceId, userGuid, userHandle) => {
    // ENHANCED: Validate all three required fields with detailed logging
    if (!deviceId) {
        console.warn('Missing deviceId for device header generation');
        return null;
    }
    
    if (!userGuid) {
        console.warn('Missing userGuid for device header generation');
        return null;
    }
    
    if (!userHandle) {
        console.warn('Missing userHandle for device header generation');
        return null;
    }
    
    console.log('Generating device header with all required fields:', {
        deviceId: deviceId.substring(0, 10) + '...',
        userGuid: userGuid,
        userHandle: userHandle
    });
    
    try {
        // Get device characteristics for fingerprinting
        console.log('Getting device characteristics for header');
        const deviceCharacteristics = await getDeviceFingerprint();
        
        // Log collected characteristics
        console.log('Collected device characteristics for header with keys:', 
                   Object.keys(deviceCharacteristics).join(', '));
        
        // Verify localStorage is accessible
        try {
            const testKey = 'superapp_local_storage_test';
            localStorage.setItem(testKey, 'test');
            localStorage.removeItem(testKey);
        } catch (storageError) {
            console.error('LocalStorage not accessible:', storageError);
            return null;
        }
        
        // Create the header data
        const headerData = {
            deviceId: deviceId,
            userGuid: userGuid,
            userHandle: userHandle,
            timestamp: Date.now(),
            deviceCharacteristics: deviceCharacteristics
        };
        
        // Add a simple signature to prevent tampering
        headerData.signature = generateSimpleSignature(headerData);
        
        // Serialize to JSON
        const headerString = JSON.stringify(headerData);
        
        // Log serialized header size
        console.log('Device header JSON size:', Math.round(headerString.length / 1024) + 'KB');
        
        // Store in localStorage for cross-browser access
        localStorage.setItem('superapp_device_header', headerString);
        
        // Add expiration (30 days)
        const expiration = Date.now() + (30 * 24 * 60 * 60 * 1000);
        localStorage.setItem('superapp_device_header_expiration', expiration.toString());
        console.log('Set device header expiration to:', new Date(expiration).toISOString());
        
        // Verify it was stored correctly
        const storedValue = localStorage.getItem('superapp_device_header');
        const success = !!storedValue;
        
        if (success) {
            console.log('Device header successfully stored in localStorage with all required fields');
            
            // Double-check we can parse it back
            try {
                const parsedHeader = JSON.parse(storedValue);
                console.log('Verified header can be parsed back with fields:', {
                    hasDeviceId: !!parsedHeader.deviceId,
                    hasUserGuid: !!parsedHeader.userGuid,
                    hasUserHandle: !!parsedHeader.userHandle,
                    hasCharacteristics: !!parsedHeader.deviceCharacteristics
                });
            } catch (e) {
                console.error('Error parsing stored header during verification:', e);
            }
        } else {
            console.error('Failed to store device header in localStorage');
        }
        
        return success ? headerString : null;
    } catch (err) {
        console.error('Error generating device header:', err);
        return null;
    }
};

// Generate a simple signature to prevent tampering with the device header
const generateSimpleSignature = (data) => {
    try {
        // Create a string from the essential data
        const deviceId = data.deviceId || '';
        const userGuid = data.userGuid || '';
        const timestamp = data.timestamp || Date.now();
        
        // Simple signature algorithm (not cryptographically secure, but better than nothing)
        let signatureBase = `${deviceId}|${userGuid}|${timestamp}`;
        
        // Add simple hash (for demonstration - in production, use a proper HMAC)
        let hash = 0;
        for (let i = 0; i < signatureBase.length; i++) {
            hash = ((hash << 5) - hash) + signatureBase.charCodeAt(i);
            hash |= 0; // Convert to 32bit integer
        }
        
        return hash.toString(16);
    } catch (err) {
        console.error('Error generating signature:', err);
        return 'invalid';
    }
};

// IMPROVED: Get the stored device header from localStorage with better validation
const getDeviceHeader = () => {
    try {
        const headerString = localStorage.getItem('superapp_device_header');
        if (!headerString) {
            console.log('No device header found in localStorage');
            return null;
        }
        
        // Parse to verify it's valid JSON
        const parsed = JSON.parse(headerString);
        
        // ENHANCED: Validate all three required fields
        if (!parsed.deviceId || !parsed.userGuid || !parsed.userHandle) {
            console.warn('Invalid device header data in localStorage, removing it:', {
                hasDeviceId: !!parsed.deviceId,
                hasUserGuid: !!parsed.userGuid,
                hasUserHandle: !!parsed.userHandle
            });
            localStorage.removeItem('superapp_device_header');
            return null;
        }
        
        // Verify signature to prevent tampering
        const expectedSignature = generateSimpleSignature(parsed);
        if (parsed.signature !== expectedSignature) {
            console.warn('Device header signature mismatch, possible tampering');
            localStorage.removeItem('superapp_device_header');
            return null;
        }
        
        // Check timestamp - expire after 30 days
        if (parsed.timestamp && (Date.now() - parsed.timestamp > 30 * 24 * 60 * 60 * 1000)) {
            console.log('Device header expired (older than 30 days), removing');
            localStorage.removeItem('superapp_device_header');
            return null;
        }
        
        console.log('Found valid device header in localStorage for cross-browser recognition');
        return headerString;
    } catch (err) {
        console.error('Error retrieving device header:', err);
        
        // If the header is invalid, clear it
        localStorage.removeItem('superapp_device_header');
        return null;
    }
};

// Enhanced storeDeviceSessionData with expiration and improved logging
const storeDeviceSessionData = (data) => {
  if (!data) {
    console.warn('No data provided to storeDeviceSessionData');
    return;
  }
  
  console.log('Storing device session data:', JSON.stringify(data).substring(0, 100) + '...');
  
  // Set expiration timestamp
  const expiration = Date.now() + (30 * 24 * 60 * 60 * 1000); // 30 days
  console.log('Setting session data expiration to:', new Date(expiration).toISOString());
  
  // Store device key if provided
  if (data.device_key) {
    storeDeviceKey(data.device_key, expiration);
  }
  
// Add to storeDeviceSessionData function after checking for device_header_data
else if (data.device_key && data.guid) {
  // First check if handle is in data
  const handle = data.handle || sessionStorage.getItem('current_handle');
  
  if (handle) {
    console.log('Creating device header from available fields');
    generateDeviceHeader(data.device_key, data.guid, handle)
      .then(headerStored => {
        console.log('Device header storage result:', headerStored ? 'SUCCESS' : 'FAILED');
        // Add device header expiration
        if (headerStored) {
          localStorage.setItem('superapp_device_header_expiration', expiration.toString());
        }
      });
  } else {
    console.warn('Still missing handle for header generation - will need to create one');
  }
}

  // Store authentication state with expiration
  if (data.status === 'authenticated') {
    sessionStorage.setItem('device_session', 'authenticated');
    localStorage.setItem('authenticated_user', 'true');
    localStorage.setItem('auth_expiration', expiration.toString());
    console.log('Stored authenticated state with expiration');
  }
  
  // Store auth version if provided
  if (data.auth_version) {
    localStorage.setItem('auth_version', data.auth_version.toString());
    console.log('Stored auth version:', data.auth_version);
  }
  
  // Store user data
  if (data.handle) {
    sessionStorage.setItem('current_handle', data.handle);
    console.log('Stored user handle:', data.handle);
  }
  if (data.phone) {
    sessionStorage.setItem('current_phone', data.phone);
    console.log('Stored phone number (last 4):', data.phone.slice(-4));
  }
  if (data.guid) {
    sessionStorage.setItem('current_guid', data.guid);
    console.log('Stored user GUID');
  }
  if (data.masked_phone) {
    sessionStorage.setItem('masked_phone', data.masked_phone);
  }
  
  // Set timestamp for cache control
  sessionStorage.setItem('last_device_check', Date.now().toString());
  sessionStorage.setItem('login_time', Date.now().toString());
  
  // CRITICAL FIX: Process device header data if available, or create from individual fields
  if (data.device_header_data) {
    console.log('Processing device_header_data from authentication response');
    // ENHANCED: Verify we have all required fields
    if (data.device_header_data.deviceId &&
        data.device_header_data.userGuid &&
        data.device_header_data.userHandle) {
      // Generate and store in localStorage for cross-browser access
      generateDeviceHeader(
        data.device_header_data.deviceId,
        data.device_header_data.userGuid,
        data.device_header_data.userHandle
      ).then(headerStored => {
        console.log('Device header storage result:', headerStored ? 'SUCCESS' : 'FAILED');
        // Add device header expiration
        if (headerStored) {
          localStorage.setItem('superapp_device_header_expiration', expiration.toString());
        }
      });
    } else {
      console.warn('Incomplete device_header_data - missing required fields:', {
        hasDeviceId: !!data.device_header_data.deviceId,
        hasUserGuid: !!data.device_header_data.userGuid,
        hasUserHandle: !!data.device_header_data.userHandle
      });
    }
  } else if (data.device_key && data.guid && data.handle) {
    // CRITICAL FIX: Create header from individual fields if we have enough info
    console.log('Creating device header from individual fields');
    generateDeviceHeader(data.device_key, data.guid, data.handle)
      .then(headerStored => {
        console.log('Device header storage result:', headerStored ? 'SUCCESS' : 'FAILED');
        // Add device header expiration
        if (headerStored) {
          localStorage.setItem('superapp_device_header_expiration', expiration.toString());
        }
      });
  } else {
    console.warn('Missing data for device header generation:', {
      hasDeviceKey: !!data.device_key,
      hasGuid: !!data.guid,
      hasHandle: !!data.handle
    });
  }
};

// Enhanced storeDeviceKey with expiration and improved logging
const storeDeviceKey = (key, expiration = null) => {
  if (key) {
    sessionStorage.setItem('device_key', key);
    if (expiration) {
      sessionStorage.setItem('device_key_expiration', expiration.toString());
      console.log('Stored device key with expiration:', new Date(expiration).toISOString());
    } else {
      console.log('Stored device key without expiration');
    }
    console.log('Stored device key:', key.substring(0, 10) + '...');
  } else {
    console.warn('Attempted to store null or undefined device key');
  }
};

const completelyResetDeviceStorage = () => {
  console.log('Completely resetting all device storage');
  
  // Clear localStorage items
  const localStorageKeys = [
    'authenticated_user',
    'superapp_device_header',
    'superapp_device_header_expiration',
    'device_verified',
    'last_verification',
    'device_check_lock',
    'current_tab_lock',
    'superapp_tab_id',
    'previous_handle',
    'loop_detected',
    'auth_version',
    'auth_expiration'
  ];
  
  localStorageKeys.forEach(key => {
    try {
      if (localStorage.getItem(key) !== null) {
        localStorage.removeItem(key);
        console.log(`Removed localStorage item: ${key}`);
      }
    } catch (e) {
      console.error(`Error removing localStorage item ${key}:`, e);
    }
  });
  
  // Clear sessionStorage items
  const sessionStorageKeys = [
    'device_session',
    'current_handle',
    'current_phone',
    'device_path',
    'device_key',
    'device_key_expiration',
    'current_guid',
    'device_guid',
    'pending_device_path',
    'verification_in_progress',
    'redirect_count',
    'device_registration',
    'device_registration_flow',
    'handle_first',
    'last_device_check',
    'login_time',
    'masked_phone'
  ];
  
  sessionStorageKeys.forEach(key => {
    try {
      if (sessionStorage.getItem(key) !== null) {
        sessionStorage.removeItem(key);
        console.log(`Removed sessionStorage item: ${key}`);
      }
    } catch (e) {
      console.error(`Error removing sessionStorage item ${key}:`, e);
    }
  });
  
  console.log('Device storage reset complete');
};

// Clear device session data but preserve the key for future recognition
const clearDeviceSession = () => {
    // Save the handle and device key before clearing
    const deviceKey = sessionStorage.getItem('device_key');
    const currentHandle = sessionStorage.getItem('current_handle');
    
    console.log('Clearing device session but preserving device key');
    
    // Store the handle before logout for future cross-device recognition
    if (currentHandle) {
        localStorage.setItem('previous_handle', currentHandle);
        console.log('Stored previous handle for cross-device recognition:', currentHandle);
    }
    
    // Flag logout state in localStorage (persists across page reloads)
    localStorage.setItem('logout_state', 'true');
    
    // Clear session data
    const sessionKeys = [];
    for (let i = 0; i < sessionStorage.length; i++) {
      sessionKeys.push(sessionStorage.key(i));
    }
    
    sessionKeys.forEach(key => {
      if (key !== 'device_key') {
        sessionStorage.removeItem(key);
      }
    });
    
    // Clear device header for security
    localStorage.removeItem('superapp_device_header');
    localStorage.removeItem('superapp_device_header_expiration');
    console.log('Removed device header for security');
    
    // Restore just the device key for future device recognition
    if (deviceKey) {
        sessionStorage.setItem('device_key', deviceKey);
        console.log('Preserved device key:', deviceKey.substring(0, 10) + '...');
    }
    
    // Mark logging out in session
    sessionStorage.setItem('logging_out', 'true');
    
    console.log('Cleared device session data, preserved device key for recognition');
};

/**
 * Check for offline mode and initialize if needed
 * @returns {Promise<boolean>} Whether offline mode is active
 */
export const initOfflineMode = async () => {
  try {
    // Initialize local database
    await localDbService.init();
    
    // Initialize sync service
    syncService.init();
    
    console.log('Offline capabilities initialized');
    return true;
  } catch (err) {
    console.error('Error initializing offline mode:', err);
    return false;
  }
};

/**
 * Perform offline PIN verification
 * @param {string} handle User handle
 * @param {string} pin PIN to verify
 * @returns {Promise<boolean>} Verification result
 */
export const verifyPinOffline = async (handle, pin) => {
  if (!handle || !pin) return false;
  
  try {
    return await localDbService.verifyPin(handle, pin);
  } catch (err) {
    console.error('Offline PIN verification error:', err);
    return false;
  }
};

/**
 * Update device name in offline mode
 * @param {string} deviceId Device ID
 * @param {string} newName New device name
 * @returns {Promise<boolean>} Success status
 */
export const updateDeviceNameOffline = async (deviceId, newName) => {
  try {
    return await localDbService.updateDeviceName(deviceId, newName);
  } catch (err) {
    console.error('Error updating device name offline:', err);
    return false;
  }
};

/**
 * Update user handle in offline mode
 * @param {string} oldHandle Current handle
 * @param {string} newHandle New handle
 * @returns {Promise<boolean>} Success status
 */
export const updateUserHandleOffline = async (oldHandle, newHandle) => {
  try {
    return await localDbService.updateUserHandle(oldHandle, newHandle);
  } catch (err) {
    console.error('Error updating user handle offline:', err);
    return false;
  }
};

/**
 * Update PIN in offline mode
 * @param {string} handle User handle
 * @param {string} pin New PIN
 * @returns {Promise<boolean>} Success status
 */
export const updatePinOffline = async (handle, pin) => {
  try {
    return await localDbService.updateUserPin(handle, pin);
  } catch (err) {
    console.error('Error updating PIN offline:', err);
    return false;
  }
};

/**
 * Store authentication data in local database
 * @param {object} authData Authentication data
 * @returns {Promise<boolean>} Success status
 */
export const storeAuthDataOffline = async (authData) => {
  try {
    // Store device info
    if (authData.device_key) {
      await localDbService.storeDeviceInfo({
        device_id: authData.device_key,
        handle: authData.handle,
        guid: authData.guid,
        phone: authData.phone,
        last_verified_at: new Date().toISOString()
      });
    }
    
    // Store user data
    if (authData.handle) {
      await localDbService.addUser({
        handle: authData.handle,
        phone: authData.phone,
        guid: authData.guid,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });
    }
    
    return true;
  } catch (err) {
    console.error('Error storing auth data offline:', err);
    return false;
  }
};

/**
 * Check if user is authenticated in offline mode
 * @param {string} deviceKey Device key
 * @returns {Promise<object|null>} Authentication data or null
 */
export const checkOfflineAuthentication = async (deviceKey) => {
  if (!deviceKey) return null;
  
  try {
    const deviceInfo = await localDbService.getDeviceInfo(deviceKey);
    if (!deviceInfo || !deviceInfo.handle) return null;
    
    return {
      status: 'authenticated',
      handle: deviceInfo.handle,
      guid: deviceInfo.guid,
      device_key: deviceInfo.device_id,
      device_name: deviceInfo.device_name,
      offline_mode: true
    };
  } catch (err) {
    console.error('Error checking offline authentication:', err);
    return null;
  }
};

// Export everything using ES modules syntax
export {
  generateDeviceKey,
  getStoredDeviceKey,
  storeDeviceKey,
  storeDeviceSessionData,
  clearDeviceSession,
  generateDeviceHeader,
  getDeviceHeader,
  getDeviceFingerprint,
  getCompleteDeviceHeaderFromStorage,
  validateAuthVersion,
  completelyResetDeviceStorage
};
