/**
 * SyncService - Handles synchronization between client and server
 * 
 * This service manages:
 * 1. Detecting online/offline status changes
 * 2. Syncing local changes to server when online
 * 3. Fetching server changes when reconnecting
 */

import { localDbService } from './localDbService';

// Import axios dynamically to avoid issues with webpack/esbuild
let axios = null;
import('../config/axios').then(module => {
  axios = module.default;
}).catch(err => {
  console.error('Error loading axios:', err);
});

class SyncService {
  constructor() {
    this.isOnline = navigator.onLine;
    this.syncInProgress = false;
    this.lastSyncTime = null;
    this.listeners = [];
    this.syncInterval = null;
  }

  /**
   * Initialize the sync service
   */
  init() {
    // Set up online/offline listeners
    window.addEventListener('online', () => this.handleOnlineStatusChange(true));
    window.addEventListener('offline', () => this.handleOnlineStatusChange(false));
    
    // Start periodic sync if online
    if (this.isOnline) {
      this.startPeriodicSync();
    }

    console.log('Sync service initialized, online status:', this.isOnline);
    return this;
  }
  
  /**
   * Clean up resources
   */
  destroy() {
    window.removeEventListener('online', this.handleOnlineStatusChange);
    window.removeEventListener('offline', this.handleOnlineStatusChange);
    
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
      this.syncInterval = null;
    }
  }

  /**
   * Handle online status changes
   */
  async handleOnlineStatusChange(online) {
    const wasOffline = !this.isOnline;
    this.isOnline = online;
    
    // Notify listeners of status change
    this.notifyListeners();
    
    // Create a custom event for the application to listen to
    const event = new CustomEvent(online ? 'superapp:online' : 'superapp:offline');
    window.dispatchEvent(event);
    
    if (online && wasOffline) {
      console.log("Connection restored. Starting sync...");
      // If we're coming back online, start sync process
      await this.syncChanges();
      this.startPeriodicSync();
    } else if (!online) {
      // If we're going offline, stop sync interval
      this.stopPeriodicSync();
    }
  }

  /**
   * Start periodic sync (every 30 seconds)
   */
  startPeriodicSync() {
    if (!this.syncInterval) {
      this.syncInterval = setInterval(() => this.syncChanges(), 30000);
    }
  }

  /**
   * Stop periodic sync
   */
  stopPeriodicSync() {
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
      this.syncInterval = null;
    }
  }

  /**
   * Add listener for online/offline status changes
   */
  addStatusListener(callback) {
    this.listeners.push(callback);
    // Immediately call with current status
    callback(this.isOnline);
    return () => {
      this.listeners = this.listeners.filter(listener => listener !== callback);
    };
  }

  /**
   * Notify all listeners of status change
   */
  notifyListeners() {
    this.listeners.forEach(listener => listener(this.isOnline));
  }

  /**
   * Get current online status
   */
  getOnlineStatus() {
    return this.isOnline;
  }

  /**
   * Sync data between local database and server
   */
  async syncChanges() {
    if (this.syncInProgress || !this.isOnline || !axios) {
      return { status: 'error', message: 'Cannot sync now', synced: 0 };
    }
    
    this.syncInProgress = true;
    
    try {
      // 1. Get pending changes from local DB
      const pendingChanges = await localDbService.getPendingChanges();
      
      if (pendingChanges.length > 0) {
        console.log(`Syncing ${pendingChanges.length} local changes to server`);
        
        // 2. Send changes to server
        const result = await this.pushChangesToServer(pendingChanges);
        
        if (result.success) {
          // 3. Mark changes as synced
          await localDbService.markChangesAsSynced(pendingChanges.map(change => change.id));
          console.log(`Successfully synced ${pendingChanges.length} changes`);
        } else {
          console.error('Failed to sync changes:', result);
        }
      }
      
      // 4. Pull changes from server
      await this.pullChangesFromServer();
      
      this.lastSyncTime = new Date();
      
      return { 
        status: 'success', 
        synced: pendingChanges.length,
        message: `Synced ${pendingChanges.length} changes` 
      };
    } catch (error) {
      console.error("Error syncing data:", error);
      return { 
        status: 'error', 
        message: error.message || 'Unknown error during sync',
        synced: 0
      };
    } finally {
      this.syncInProgress = false;
    }
  }

  /**
   * Push local changes to server
   */
  async pushChangesToServer(changes) {
    if (!axios) {
      return { success: false, error: 'Axios not loaded' };
    }
    
    try {
      const response = await axios.post('/api/v1/sync', { changes });
      return response.data;
    } catch (error) {
      console.error("Error pushing changes to server:", error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Pull changes from server
   */
  async pullChangesFromServer() {
    if (!axios) {
      return false;
    }
    
    try {
      // Get last sync time to fetch only newer changes
      const timestamp = this.lastSyncTime ? this.lastSyncTime.toISOString() : null;
      
      const response = await axios.get('/api/v1/sync', {
        params: { since: timestamp }
      });
      
      if (response.data.success && response.data.changes) {
        const changes = response.data.changes;
        
        // Apply each change to local database
        for (const change of changes) {
          await this.applyServerChange(change);
        }
        
        return true;
      }
      
      return false;
    } catch (error) {
      console.error("Error pulling changes from server:", error);
      return false;
    }
  }
  
  /**
   * Apply a server change to local database
   */
  async applyServerChange(change) {
    try {
      const { table_name, record_id, operation, data } = change;
      
      if (table_name === 'devices') {
        if (data.device_name) {
          await localDbService.saveDeviceData({
            id: record_id,
            user_guid: data.guid,
            user_handle: data.handle,
            device_name: data.device_name,
            last_verified_at: data.last_verified_at
          });
        }
      } else if (table_name === 'users') {
        if (data.handle && data.old_handle) {
          await localDbService.updateUserHandle(data.old_handle, data.handle);
        } else if (data.pin_hash) {
          const user = await localDbService.getUserByHandle(record_id);
          if (user) {
            await localDbService.saveUserData({
              ...user,
              has_pin: 1,
              pin_hash: data.pin_hash
            });
          }
        }
      }
      
      return true;
    } catch (error) {
      console.error('Error applying server change:', error);
      return false;
    }
  }

  /**
   * Get the time of the last successful sync
   */
  getLastSyncTime() {
    return this.lastSyncTime;
  }
}

// Create singleton instance
const syncService = new SyncService();

// Export the instance
export { syncService };
export default syncService;
