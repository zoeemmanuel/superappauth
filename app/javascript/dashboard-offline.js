/**
 * Dashboard Offline Support Module
 * Provides offline functionality for the SuperApp dashboard
 */

// CRITICAL: Ensure we're in the global namespace immediately
(function() {
  // Create global namespace if it doesn't exist
  window.SuperApp = window.SuperApp || {};
  
  // Create placeholder functions immediately
  window.SuperApp.offlineSupport = window.SuperApp.offlineSupport || {
    initialized: false,
    loading: false,
    error: null
  };
  
  console.log('Dashboard offline script starting...');
  
  // Ensure legacy global functions are available immediately
  window.initOfflineSupport = window.initOfflineSupport || function() {
    console.log('Legacy offline support placeholder called');
    return Promise.resolve(false);
  };
  
  window.overrideHandleUpdate = window.overrideHandleUpdate || function() {
    console.log('Legacy handle update override placeholder called');
    return false;
  };
  
  window.overrideDeviceRename = window.overrideDeviceRename || function() {
    console.log('Legacy device rename override placeholder called');
    return false;
  };
  
  window.overridePinUpdate = window.overridePinUpdate || function() {
    console.log('Legacy PIN update override placeholder called');
    return false;
  };
  
  window.showToast = window.showToast || function(message, type) {
    console.log('Legacy toast placeholder called:', message, type);
  };
  
  window.forceSyncNow = window.forceSyncNow || function() {
    console.log('Legacy force sync placeholder called');
    return Promise.resolve(false);
  };
  
  // Wrap everything in an IIFE to avoid polluting global scope
  (function() {
    // Global state for offline mode
    const offlineState = {
      isOnline: navigator.onLine,
      syncPending: false,
      lastSyncTime: null
    };
    
    // Store state in global namespace
    window.SuperApp.offlineState = offlineState;
    
    // Initialize local state
    let localDbService = null;
    let syncService = null;
    
    /**
     * Initialize offline support for dashboard
     * @returns {Promise<boolean>} Success status
     */
    async function initOfflineSupport() {
      console.log('Initializing offline support for dashboard');
      
      try {
        // Load services if not already loaded
        if (!localDbService || !syncService) {
          await loadServices();
        }
        
        // Initialize local database
        console.log('Initializing local database...');
        await localDbService.init();
        console.log('Local database initialized successfully');
        
        // Initialize sync service
        console.log('Initializing sync service...');
        syncService.init();
        console.log('Sync service initialized successfully');
        
        // Add online/offline status indicator
        console.log('Adding status indicator...');
        addStatusIndicator();
        
        // Override dashboard operations to support offline mode
        console.log('Setting up override functions...');
        overrideHandleUpdate();
        overrideDeviceRename();
        overridePinUpdate();
        console.log('Override functions set up successfully');
        
        // Set up event listeners for online/offline status
        console.log('Setting up network status event listeners...');
        window.addEventListener('online', handleOnlineStatus);
        window.addEventListener('offline', handleOfflineStatus);
        
        // Add custom event listeners
        window.addEventListener('superapp:online', handleOnlineStatus);
        window.addEventListener('superapp:offline', handleOfflineStatus);
        
        // Initial status check
        console.log('Performing initial online status check...');
        updateOnlineStatus(navigator.onLine);
        
        // Add offline banner if offline
        if (!navigator.onLine) {
          console.log('Device is offline, adding offline banner...');
          addOfflineBanner();
        }
        
        // Store authentication data from current session for offline use
        console.log('Retrieving auth data from session...');
        const deviceKey = sessionStorage.getItem('device_key');
        const handle = document.querySelector('[data-handle]')?.textContent;
        const deviceId = document.querySelector('[data-device-id]')?.textContent?.trim();
        
        console.log('Auth data retrieved:', { 
          deviceKeyExists: !!deviceKey, 
          handleExists: !!handle, 
          deviceIdExists: !!deviceId 
        });
        
        if (deviceKey && handle) {
          const authData = {
            device_key: deviceKey,
            handle: handle,
            device_id: deviceId || deviceKey,
            last_verified_at: new Date().toISOString()
          };
          
          await storeAuthDataOffline(authData);
          console.log('Authentication data stored for offline use');
        } else {
          console.warn('Insufficient auth data for offline storage');
        }
        
        // Set initialization flag
        window.SuperApp.offlineSupport.initialized = true;
        console.log('Offline support initialized successfully');
        
        // Dispatch an event to notify that offline support is ready
        window.dispatchEvent(new CustomEvent('offline-support-ready'));
        
        return true;
      } catch (error) {
        console.error('Error initializing offline support:', error);
        // Track error state
        window.SuperApp.offlineSupport.error = error.message || 'Initialization failed';
        // Even if there's an error, set initialized flag to prevent endless retries
        window.SuperApp.offlineSupport.initialized = false;
        
        // Dispatch error event
        window.dispatchEvent(new CustomEvent('offline-support-error', { detail: error }));
        
        return false;
      }
    }
    
    /**
     * Load required services
     * @returns {Promise<void>}
     */
    async function loadServices() {
      try {
        // Check if services are already defined globally
        if (window.SuperApp.localDbService && window.SuperApp.syncService) {
          localDbService = window.SuperApp.localDbService;
          syncService = window.SuperApp.syncService;
          return;
        }
        
        // Attempt to dynamically import services
        try {
          // First try to import via dynamic import
          const dbServiceModule = await import('./services/localDbService.js');
          const syncServiceModule = await import('./services/syncService.js');
          
          localDbService = dbServiceModule.localDbService || dbServiceModule.default;
          syncService = syncServiceModule.syncService || syncServiceModule.default;
        } catch (importError) {
          console.warn('Dynamic import failed, checking for globally defined services:', importError);
          
          // Fall back to globally defined services if import fails
          if (window.localDbService && window.syncService) {
            localDbService = window.localDbService;
            syncService = window.syncService;
          } else {
            throw new Error('Could not load required services');
          }
        }
        
        // Store services in global namespace
        window.SuperApp.localDbService = localDbService;
        window.SuperApp.syncService = syncService;
      } catch (error) {
        console.error('Failed to load services:', error);
        throw error;
      }
    }
    
    /**
     * Add offline banner to page
     */
    function addOfflineBanner() {
      console.log('Adding offline banner...');
      // Remove any existing banner first
      const existingBanner = document.getElementById('offline-banner');
      if (existingBanner) {
        console.log('Removing existing banner');
        existingBanner.remove();
      }
      
      // Create new banner
      const banner = document.createElement('div');
      banner.id = 'offline-banner';
      banner.className = 'fixed top-0 left-0 right-0 bg-red-500 text-white text-center py-2 z-50';
      banner.innerHTML = 'You are currently offline. Changes will be saved locally and synced when you reconnect.';
      
      // Add to beginning of body
      document.body.prepend(banner);
      console.log('Offline banner added successfully');
    }
    
    /**
     * Add online/offline status indicator to dashboard
     */
    function addStatusIndicator() {
      console.log('Creating status indicator...');
      // Create status indicator container
      const statusContainer = document.createElement('div');
      statusContainer.id = 'connection-status';
      statusContainer.className = 'fixed bottom-4 right-4 rounded-lg bg-gray-800 shadow-lg p-3 z-50 flex items-center';
      
      // Create indicator
      statusContainer.innerHTML = `
        <div id="status-indicator" class="w-3 h-3 rounded-full mr-2 bg-green-500"></div>
        <span id="status-text" class="text-sm">Online</span>
        <button id="sync-now-button" class="ml-3 text-xs bg-gray-700 hover:bg-gray-600 px-2 py-1 rounded">
          Sync Now
        </button>
        <span id="sync-time" class="text-xs text-gray-400 ml-2 hidden"></span>
        <span id="sync-status" class="text-xs ml-2 text-green-400">All changes synced</span>
      `;
      
      // Add to body
      document.body.appendChild(statusContainer);
      console.log('Status indicator created and added to DOM');
      
      // Add sync button event listener
      const syncButton = document.getElementById('sync-now-button');
      if (syncButton) {
        console.log('Setting up sync button event listener');
        syncButton.addEventListener('click', async function() {
          console.log('Sync button clicked, online status:', navigator.onLine);
          if (!navigator.onLine) {
            showToast('You are offline. Changes will sync when you go back online.', 'warning');
            return;
          }
          
          await forceSyncNow();
        });
        console.log('Sync button event listener set up');
      } else {
        console.error('Sync button not found in DOM');
      }
    }
    
    /**
     * Update online status indicator
     * @param {boolean} isOnline Whether device is online
     */
    function updateOnlineStatus(isOnline) {
      console.log('Updating online status indicator to:', isOnline ? 'Online' : 'Offline');
      const indicator = document.getElementById('status-indicator');
      const statusText = document.getElementById('status-text');
      const syncButton = document.getElementById('sync-now-button');
      
      if (!indicator) {
        console.warn('Status indicator not yet created');
        return;
      }
      
      if (isOnline) {
        indicator.className = 'w-3 h-3 rounded-full mr-2 bg-green-500';
        statusText.textContent = 'Online';
        syncButton.classList.remove('hidden');
      } else {
        indicator.className = 'w-3 h-3 rounded-full mr-2 bg-red-500';
        statusText.textContent = 'Offline';
        syncButton.classList.add('hidden');
      }
      
      offlineState.isOnline = isOnline;
      console.log('Online status updated successfully');
    }
    
    /**
     * Update sync status indicator
     * @param {string} status - 'syncing', 'synced', or 'pending'
     */
    function updateSyncStatus(status) {
      console.log('Updating sync status to:', status);
      const syncStatus = document.getElementById('sync-status');
      
      if (!syncStatus) {
        console.warn('Sync status element not found');
        return;
      }
      
      if (status === 'syncing') {
        syncStatus.textContent = 'Syncing changes...';
        syncStatus.className = 'text-xs ml-2 text-yellow-400';
      } else if (status === 'synced') {
        syncStatus.textContent = 'All changes synced';
        syncStatus.className = 'text-xs ml-2 text-green-400';
      } else if (status === 'pending') {
        syncStatus.textContent = 'Changes pending';
        syncStatus.className = 'text-xs ml-2 text-blue-400';
      }
      console.log('Sync status updated successfully');
    }
    
    /**
     * Handle online status change
     */
    function handleOnlineStatus() {
      console.log('Online status event triggered, updating to online');
      updateOnlineStatus(true);
      
      // Remove offline banner if present
      const banner = document.getElementById('offline-banner');
      if (banner) {
        console.log('Removing offline banner');
        banner.remove();
      }
      
      showToast('You are back online. Syncing changes...', 'success');
      forceSyncNow();
    }
    
    /**
     * Handle offline status change
     */
    function handleOfflineStatus() {
      console.log('Offline status event triggered, updating to offline');
      updateOnlineStatus(false);
      
      // Add offline banner
      addOfflineBanner();
      
      updateSyncStatus('pending');
      showToast('You are offline. Changes will be saved locally.', 'warning');
    }
    
    /**
     * Force sync now
     * @returns {Promise<Object>} Sync result
     */
    async function forceSyncNow() {
      console.log('Force sync requested, online status:', navigator.onLine);
      
      if (!navigator.onLine) {
        console.log('Cannot sync while offline');
        showToast('Cannot sync while offline', 'error');
        return { status: 'error', message: 'Offline', synced: 0 };
      }
      
      if (offlineState.syncPending) {
        console.log('Sync already in progress');
        showToast('Sync already in progress', 'info');
        return { status: 'error', message: 'Sync in progress', synced: 0 };
      }
      
      offlineState.syncPending = true;
      updateSyncStatus('syncing');
      
      const syncButton = document.getElementById('sync-now-button');
      if (syncButton) {
        const originalText = syncButton.textContent;
        syncButton.textContent = 'Syncing...';
        syncButton.disabled = true;
      }
      
      try {
        console.log('Starting sync process...');
        const result = await syncService.syncChanges();
        console.log('Sync result:', result);
        
        if (result.status === 'success') {
          showToast(`Synced ${result.synced} changes successfully`, 'success');
          offlineState.lastSyncTime = new Date();
          updateLastSyncTime();
          updateSyncStatus('synced');
          
          // Update UI instead of full page refresh
          if (result.synced > 0) {
            console.log('Changes detected, updating UI');
            updateUIAfterChange('sync');
          }
        } else {
          console.warn('Sync failed:', result.message);
          showToast(result.message || 'Sync failed', 'error');
          updateSyncStatus('pending');
        }
        
        return result;
      } catch (error) {
        console.error('Error syncing:', error);
        showToast('Error syncing changes', 'error');
        updateSyncStatus('pending');
        return { status: 'error', message: error.message, synced: 0 };
      } finally {
        offlineState.syncPending = false;
        const syncButton = document.getElementById('sync-now-button');
        if (syncButton) {
          syncButton.textContent = 'Sync Now';
          syncButton.disabled = false;
        }
      }
    }
    
    /**
     * Update UI after a change instead of full page reload
     * @param {string} operation - Type of operation: 'pin', 'handle', 'device', 'sync'
     * @param {string} newValue - New value (for handle updates)
     */
    function updateUIAfterChange(operation, newValue) {
      console.log('Updating UI after change:', { operation, newValue });
      
      // For now, just do a simple reload with a delay to show the user something is happening
      showToast('Updating dashboard...', 'info');
      
      // In the future, you can implement targeted DOM updates instead of a full page reload
      setTimeout(() => {
        console.log('Reloading page after change');
        window.location.reload();
      }, 1500);
    }
    
    /**
     * Update last sync time display
     */
    function updateLastSyncTime() {
      console.log('Updating last sync time display');
      const syncTimeElement = document.getElementById('sync-time');
      if (!syncTimeElement) {
        console.warn('Sync time element not found');
        return;
      }
      
      if (offlineState.lastSyncTime) {
        const timeStr = offlineState.lastSyncTime.toLocaleTimeString();
        syncTimeElement.textContent = `Last synced: ${timeStr}`;
        syncTimeElement.classList.remove('hidden');
        console.log('Last sync time updated:', timeStr);
      }
    }
    
    /**
     * Override handle update function to support offline mode
     */
    function overrideHandleUpdate() {
      console.log('Setting up handle update override...');
      
      // Get the original update button and save button
      const updateButton = document.getElementById('updateHandleButton');
      const saveButton = document.getElementById('saveHandleButton');
      
      console.log('Handle update elements found:', { 
        updateButton: !!updateButton, 
        saveButton: !!saveButton 
      });
      
      if (!saveButton) {
        console.error('saveHandleButton not found, cannot override!');
        return;
      }
      
      // Store original onclick handler if it exists
      const originalSaveHandler = saveButton.onclick;
      console.log('Original save handler found:', !!originalSaveHandler);
      
      // Mark the button as overridden for debugging
      saveButton.setAttribute('data-offline-override', 'true');
      
      // Override the save handler
      saveButton.onclick = async function(event) {
        // Get a direct check of online status right at the moment of click
        const isCurrentlyOnline = navigator.onLine;
        console.log('Handle save clicked, direct online check:', isCurrentlyOnline);
        
        // If we're online, use the original handler
        if (isCurrentlyOnline && originalSaveHandler) {
          console.log('Online mode, using original handler');
          return originalSaveHandler.call(this, event);
        }
        
        // If we're offline, use local database
        console.log('Offline mode, using local database');
        event.preventDefault();
        
        const newHandle = document.getElementById('newHandle').value;
        console.log('New handle value:', newHandle);
        
        // Remove @ if it's there
        const handleValue = newHandle.startsWith('@') ? newHandle.substring(1) : newHandle;
        
        if (!handleValue || !/^[a-zA-Z0-9]+$/.test(handleValue)) {
          console.log('Handle validation failed');
          const errorElement = document.getElementById('handleError');
          errorElement.textContent = 'Handle must contain only letters and numbers';
          errorElement.classList.remove('hidden');
          return;
        }
        
        const formattedHandle = `@${handleValue}`;
        const currentHandle = document.querySelector('[data-handle]').textContent;
        console.log('Current handle:', currentHandle, 'New formatted handle:', formattedHandle);
        
        try {
          // Update in local database
          console.log('Updating handle in local database...');
          const success = await localDbService.updateUserHandle(currentHandle, formattedHandle);
          console.log('Local database update result:', success);
          
          if (success) {
            // Update UI
            console.log('Updating UI with new handle');
            document.querySelector('[data-handle]').textContent = formattedHandle;
            
            // Show success message
            const successElement = document.getElementById('handleSuccess');
            successElement.textContent = 'Handle updated successfully (offline)';
            successElement.classList.remove('hidden');
            
            // Hide error if visible
            document.getElementById('handleError').classList.add('hidden');
            
            // Hide form after a delay
            setTimeout(() => {
              // Use global toggleUpdateHandle function if available
              if (typeof window.toggleUpdateHandle === 'function') {
                window.toggleUpdateHandle();
              } else {
                // Otherwise use a simple hide/show approach
                document.getElementById('updateHandleForm').classList.add('hidden');
                document.getElementById('updateHandleButton').classList.remove('hidden');
              }
            }, 1500);
            
            showToast('Handle updated offline. Changes will sync when online.', 'info');
            updateSyncStatus('pending');
          } else {
            throw new Error('Failed to update handle locally');
          }
        } catch (error) {
          console.error('Offline handle update error:', error);
          
          // Show error message
          const errorElement = document.getElementById('handleError');
          errorElement.textContent = 'Failed to update handle offline';
          errorElement.classList.remove('hidden');
        }
      };
      
      console.log('Handle update override completed successfully');
    }
    
    /**
     * Override device rename function to support offline mode
     */
    function overrideDeviceRename() {
      console.log('Setting up device rename override...');
      
      // Define the original function if it doesn't exist
      if (typeof window.renameDevice !== 'function') {
        console.log('Original renameDevice function not found, creating placeholder');
        window.originalRenameDevice = function(deviceId) {
          // Original implementation would call the server
          console.log('Original renameDevice called for device:', deviceId);
        };
      } else {
        console.log('Storing original renameDevice function');
        window.originalRenameDevice = window.renameDevice;
      }
      
      // Override with offline-aware function
      window.renameDevice = function(deviceId) {
        console.log('Overridden renameDevice called for device:', deviceId);
        
        // Get a direct check of online status right at the moment
        const isCurrentlyOnline = navigator.onLine;
        console.log('Device rename, direct online check:', isCurrentlyOnline);
        
        const deviceElement = event.target.closest('.bg-gray-700');
        if (!deviceElement) {
          console.error('Device element not found');
          return;
        }
        
        const currentName = deviceElement.querySelector('.text-sm').textContent.trim();
        console.log('Current device name:', currentName);
        
        const newName = prompt("Enter a new name for this device:", currentName);
        console.log('New device name:', newName);
        
        if (newName === null) {
          console.log('Device rename cancelled by user');
          return; // User cancelled
        }
        
        if (newName.trim() === "") {
          console.log('Empty device name rejected');
          alert("Device name cannot be empty");
          return;
        }
        
        // If offline, use local database
        if (!isCurrentlyOnline) {
          console.log('Offline mode, using local database for device rename');
          localDbService.updateDeviceName(deviceId, newName.trim())
            .then(success => {
              console.log('Local database update result:', success);
              if (success) {
                // Update UI directly
                console.log('Updating UI with new device name');
                deviceElement.querySelector('.text-sm').textContent = newName.trim();
                showToast('Device renamed offline. Changes will sync when online.', 'info');
                updateSyncStatus('pending');
              } else {
                console.error('Failed to rename device offline');
                alert('Error renaming device offline. Please try again.');
              }
            })
            .catch(error => {
              console.error('Error renaming device offline:', error);
              alert('Error renaming device offline. Please try again.');
            });
          return;
        }
        
        // Otherwise, use original function for online mode
        console.log('Online mode, using original renameDevice function');
        return window.originalRenameDevice.call(this, deviceId);
      };
      
      console.log('Device rename override completed successfully');
    }
    
    /**
     * Override PIN update function to support offline mode
     */
    function overridePinUpdate() {
      console.log('Setting up PIN update override...');
      
      // Find the original confirmPin function
      const originalConfirmPin = window.confirmPin;
      console.log('Original confirmPin function found:', !!originalConfirmPin);
      
      // Only override if it exists
      if (typeof originalConfirmPin !== 'function') {
        console.warn('originalConfirmPin is not defined, cannot override PIN update');
        return;
      }
      
      // Override with offline-aware function
      window.confirmPin = async function() {
        console.log('Overridden confirmPin called');
        
        // Get a direct check of online status right at the moment
        const isCurrentlyOnline = navigator.onLine;
        console.log('PIN confirmation, direct online check:', isCurrentlyOnline);
        
        // Check for PIN variables in global scope
        const createPin = window.createPin;
        const verifyPin = window.verifyPin;
        
        // Make sure PIN variables are defined
        if (typeof createPin === 'undefined' || typeof verifyPin === 'undefined') {
          console.error('PIN variables not defined');
          return;
        }
        
        if (verifyPin.length !== 4) {
          console.log('Verify PIN not complete');
          return;
        }
        
        // Check if PINs match
        if (createPin !== verifyPin) {
          console.log('PINs do not match');
          const errorElement = document.getElementById('confirmPinError');
          if (errorElement) {
            errorElement.textContent = "PINs don't match. Please try again.";
            errorElement.classList.remove('hidden');
            
            // Animate the error message if possible
            errorElement.classList.add('animate-pulse');
            setTimeout(() => {
              errorElement.classList.remove('animate-pulse');
            }, 1000);
          }
          
          // Clear confirmation PIN
          window.verifyPin = '';
          if (typeof window.updateConfirmPinDisplay === 'function') {
            window.updateConfirmPinDisplay();
          }
          
          const confirmButton = document.getElementById('confirmButton');
          if (confirmButton) {
            confirmButton.disabled = true;
          }
          return;
        }
        
        // Show loading state
        const confirmPinStep = document.getElementById('confirmPinStep');
        const pinLoadingStep = document.getElementById('pinLoadingStep');
        
        if (confirmPinStep) confirmPinStep.classList.add('hidden');
        if (pinLoadingStep) pinLoadingStep.classList.remove('hidden');
        
        try {
          // If offline, use local database
          if (!isCurrentlyOnline) {
            console.log('Offline mode, using local database for PIN update');
            const currentHandle = document.querySelector('[data-handle]')?.textContent;
            if (!currentHandle) {
              throw new Error('User handle not found');
            }
            
            console.log('Updating PIN in local database for handle:', currentHandle);
            const success = await localDbService.updateUserPin(currentHandle, createPin);
            console.log('Local database PIN update result:', success);
            
            if (success) {
              // Store PIN status for persistence between page loads
              localStorage.setItem('pin_enabled', 'true');
              console.log('PIN enabled status stored in localStorage');
              
              // Show success state
              if (pinLoadingStep) pinLoadingStep.classList.add('hidden');
              
              const pinSuccessStep = document.getElementById('pinSuccessStep');
              if (pinSuccessStep) pinSuccessStep.classList.remove('hidden');
              
              // Update PIN status in UI without waiting for page refresh
              if (typeof window.updatePinStatusUI === 'function') {
                console.log('Updating PIN status UI');
                window.updatePinStatusUI();
              }
              
              showToast('PIN setup completed offline. Changes will sync when online.', 'info');
              updateSyncStatus('pending');
            } else {
              throw new Error('Failed to update PIN offline');
            }
            return;
          }
          
          // Otherwise, use original function for online mode
          console.log('Online mode, using original confirmPin function');
          return originalConfirmPin.call(this);
        } catch (error) {
          console.error('PIN setup error:', error);
          
          // Show error in confirmation step
          if (pinLoadingStep) pinLoadingStep.classList.add('hidden');
          
          if (confirmPinStep) confirmPinStep.classList.remove('hidden');
          
          const errorElement = document.getElementById('confirmPinError');
          if (errorElement) {
            errorElement.textContent = error.message || 'Failed to set PIN. Please try again.';
            errorElement.classList.remove('hidden');
          }
        }
      };
      
      console.log('PIN update override completed successfully');
    }
    
    /**
     * Store authentication data in local database
     * @param {object} authData Authentication data
     * @returns {Promise<boolean>} Success status
     */
    async function storeAuthDataOffline(authData) {
      console.log('Storing auth data offline:', JSON.stringify(authData).substring(0, 100) + '...');
      try {
        // Store device info
        if (authData.device_key) {
          console.log('Saving device data...');
          await localDbService.saveDeviceData({
            id: authData.device_key,
            user_guid: authData.guid || 'offline-guid',
            user_handle: authData.handle,
            device_name: authData.device_name || 'Current Device',
            last_verified_at: new Date().toISOString()
          });
        }
        
        // Store user data
        if (authData.handle) {
          console.log('Saving user data...');
          await localDbService.saveUserData({
            guid: authData.guid || 'offline-guid',
            handle: authData.handle,
            phone: authData.phone || '',
            has_pin: localStorage.getItem('pin_enabled') === 'true' ? 1 : 0,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          });
        }
        
        console.log('Auth data stored successfully');
        return true;
      } catch (err) {
        console.error('Error storing auth data offline:', err);
        return false;
      }
    }
    
    /**
     * Show toast notification
     * @param {string} message Message to display
     * @param {string} type Type of toast: 'success', 'error', 'warning', 'info'
     * @returns {HTMLElement} The toast element
     */
    function showToast(message, type = 'info') {
      console.log('Showing toast:', { message, type });
      
      // Remove existing toast if present
      const existingToast = document.getElementById('toast-notification');
      if (existingToast) {
        existingToast.remove();
      }
      
      // Create toast container
      const toast = document.createElement('div');
      toast.id = 'toast-notification';
      toast.className = 'fixed bottom-20 right-4 p-4 rounded-lg shadow-lg z-50 transition-opacity duration-300 flex items-center';
      
      // Set color based on type
      switch (type) {
        case 'success':
          toast.classList.add('bg-green-500', 'text-white');
          break;
        case 'error':
          toast.classList.add('bg-red-500', 'text-white');
          break;
        case 'warning':
          toast.classList.add('bg-yellow-500', 'text-white');
          break;
        case 'info':
        default:
          toast.classList.add('bg-blue-500', 'text-white');
          break;
      }
      
      // Add message
      toast.innerHTML = `
        <div class="mr-3">
          ${message}
        </div>
        <button class="text-white hover:text-gray-200">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
          </svg>
        </button>
      `;
      
      // Add to body
      document.body.appendChild(toast);
      
      // Add close button handler
      toast.querySelector('button').addEventListener('click', function() {
        toast.classList.add('opacity-0');
        setTimeout(() => {
          toast.remove();
        }, 300);
      });
      
      // Auto-hide after 5 seconds
      setTimeout(() => {
        if (toast.parentNode) {
          toast.classList.add('opacity-0');
          setTimeout(() => {
            if (toast.parentNode) toast.remove();
          }, 300);
        }
      }, 5000);
      
      return toast;
    }
    
    // Store all functions in global namespace
    window.SuperApp.offlineSupport = {
      initialized: false,
      loading: false,
      error: null,
      initOfflineSupport,
      overrideHandleUpdate,
      overrideDeviceRename,
      overridePinUpdate,
      showToast,
      forceSyncNow,
      storeAuthDataOffline,
      updateSyncStatus
    };
    
    // Legacy function references for backwards compatibility
    window.initOfflineSupport = initOfflineSupport;
    window.overrideHandleUpdate = overrideHandleUpdate;
    window.overrideDeviceRename = overrideDeviceRename;
    window.overridePinUpdate = overridePinUpdate;
    window.showToast = showToast;
    window.forceSyncNow = forceSyncNow;
    window.storeAuthDataOffline = storeAuthDataOffline;
    window.updateSyncStatus = updateSyncStatus;
    
    // Initialize when the script is loaded (if on dashboard page)
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
      // Document already loaded, initialize after a short delay
      console.log('Document already ready, scheduling initialization...');
      setTimeout(initOfflineSupport, 500);
    } else {
      // Wait for DOM ready
      console.log('Waiting for document to be ready before initializing...');
      document.addEventListener('DOMContentLoaded', function() {
        console.log('DOM loaded, scheduling initialization...');
        setTimeout(initOfflineSupport, 1000);
      });
    }
    
    // Export for module usage
    if (typeof module !== 'undefined' && module.exports) {
      module.exports = {
        initOfflineSupport,
        overrideHandleUpdate,
        overrideDeviceRename,
        overridePinUpdate,
        showToast,
        forceSyncNow,
        storeAuthDataOffline,
        updateSyncStatus
      };
    }
  })();
})();
