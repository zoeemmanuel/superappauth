/**
 * LocalDbService - WASM SQLite implementation for offline authentication
 * 
 * This service manages a local SQLite database (via WASM) that mirrors
 * the server-side device database structure for offline authentication.
 */

// Import SQL.js - simplified approach
let sqlPromise = null;
let SQL = null;

function initSqlJs() {
  if (!sqlPromise) {
    sqlPromise = import('sql.js')
      .then(async module => {
        SQL = await module.default({
          locateFile: file => `/wasm/${file}`
        });
        console.log("SQL.js initialized successfully with WebAssembly");
        return SQL;
      })
      .catch(err => {
        console.error('Error importing sql.js:', err);
        return null;
      });
  }
  return sqlPromise;
}

// Use localStorage for simplicity
const storage = {
  async get(key) {
    try {
      return JSON.parse(localStorage.getItem(key) || 'null');
    } catch (e) {
      console.error('Storage get error:', e);
      return null;
    }
  },
  
  async set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (e) {
      console.error('Storage set error:', e);
      return false;
    }
  }
};

class LocalDbService {
  constructor() {
    this.db = null;
    this.initialized = false;
    this.initPromise = null;
    this.storageKey = 'superapp-sqlite-db';
  }

  /**
   * Initialize the WASM SQLite database
   */
  async init() {
    if (this.initPromise) return this.initPromise;
    
    this.initPromise = new Promise(async (resolve) => {
      try {
        // Load SQL.js first
        await initSqlJs();
        
        if (!SQL) {
          console.error('SQL.js failed to load');
          this.initialized = false;
          resolve(false);
          return;
        }
        
        // Try to load existing database
        const dbData = await storage.get(this.storageKey);
        
        if (dbData) {
          // Convert base64 string back to Uint8Array
          const binaryString = atob(dbData);
          const bytes = new Uint8Array(binaryString.length);
          for (let i = 0; i < binaryString.length; i++) {
            bytes[i] = binaryString.charCodeAt(i);
          }
          
          this.db = new SQL.Database(bytes);
        } else {
          // Create new database
          this.db = new SQL.Database();
          this.setupSchema();
        }
        
        this.initialized = true;
        console.log('Local DB initialized successfully');
        
        // Set up periodic persistence
        this.persistInterval = setInterval(() => this.persist(), 10000);
        
        resolve(true);
      } catch (error) {
        console.error('Error initializing local database:', error);
        this.initialized = false;
        resolve(false);
      }
    });
    
    return this.initPromise;
  }
  
  /**
   * Set up database schema
   */
  setupSchema() {
    this.exec(`
      -- Device info table
      CREATE TABLE IF NOT EXISTS devices (
        id TEXT PRIMARY KEY,
        user_guid TEXT,
        user_handle TEXT,
        device_name TEXT,
        last_verified_at TEXT,
        created_at TEXT,
        updated_at TEXT
      );
      
      -- Users table
      CREATE TABLE IF NOT EXISTS users (
        guid TEXT PRIMARY KEY,
        handle TEXT UNIQUE,
        phone TEXT,
        has_pin INTEGER DEFAULT 0,
        pin_hash TEXT,
        created_at TEXT,
        updated_at TEXT
      );
      
      -- Local changes queue for sync
      CREATE TABLE IF NOT EXISTS local_changes (
        id TEXT PRIMARY KEY,
        table_name TEXT,
        record_id TEXT,
        change_type TEXT,
        change_data TEXT,
        created_at TEXT,
        synced INTEGER DEFAULT 0
      );
    `);
  }
  
  /**
   * Persist database to storage
   */
async persist() {
  if (!this.db || this._persistPending) return;
  
  this._persistPending = true;
  
  // Debounce persistence to avoid frequent heavy operations
  clearTimeout(this._persistTimeout);
  this._persistTimeout = setTimeout(async () => {
    try {
      const data = this.db.export();
      const arr = new Uint8Array(data);
      
      // Convert Uint8Array to base64 string for storage
      let binary = '';
      const bytes = new Uint8Array(arr);
      const len = bytes.byteLength;
      for (let i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i]);
      }
      const base64 = btoa(binary);
      
      await storage.set(this.storageKey, base64);
      this._persistPending = false;
    } catch (error) {
      console.error('Error persisting database:', error);
      this._persistPending = false;
    }
  }, 1000); // Wait 1 second before persisting
}
  /**
   * Clean up resources
   */
  destroy() {
    if (this.persistInterval) {
      clearInterval(this.persistInterval);
    }
    
    if (this.db) {
      this.db.close();
    }
  }
  
  /**
   * Ensure database is initialized
   */
  async ensureInitialized() {
    if (!this.initialized) {
      await this.init();
    }
    return this.db !== null;
  }
  
  /**
   * Execute SQL statement
   */
  exec(sql, params = []) {
    if (!this.db) return null;
    try {
      return this.db.exec(sql, params);
    } catch (error) {
      console.error('SQL execution error:', error, 'SQL:', sql);
      throw error;
    }
  }
  
  /**
   * Save user data
   */
  async saveUserData(userData) {
    await this.ensureInitialized();
    
    const { guid, handle, phone, has_pin, pin_hash } = userData;
    const now = new Date().toISOString();
    
    try {
      // Check if user exists
      const result = this.exec('SELECT guid FROM users WHERE guid = ?', [guid]);
      const exists = result.length > 0 && result[0].values.length > 0;
      
      if (exists) {
        this.exec(`
          UPDATE users 
          SET handle = ?, phone = ?, has_pin = ?, pin_hash = ?, updated_at = ?
          WHERE guid = ?
        `, [
          handle,
          phone || null,
          has_pin ? 1 : 0,
          pin_hash || null,
          now,
          guid
        ]);
      } else {
        this.exec(`
          INSERT INTO users (guid, handle, phone, has_pin, pin_hash, created_at, updated_at)
          VALUES (?, ?, ?, ?, ?, ?, ?)
        `, [
          guid,
          handle,
          phone || null,
          has_pin ? 1 : 0,
          pin_hash || null,
          now,
          now
        ]);
      }
      
      await this.persist();
      return true;
    } catch (error) {
      console.error('Error saving user data:', error);
      return false;
    }
  }
  
  /**
   * Get user data by handle
   */
  async getUserByHandle(handle) {
    await this.ensureInitialized();
    
    try {
      const result = this.exec('SELECT * FROM users WHERE handle = ? LIMIT 1', [handle]);
      
      if (result.length === 0 || result[0].values.length === 0) {
        return null;
      }
      
      const columns = result[0].columns;
      const values = result[0].values[0];
      
      const user = {};
      columns.forEach((col, i) => {
        user[col] = values[i];
      });
      
      return user;
    } catch (error) {
      console.error('Error getting user:', error);
      return null;
    }
  }
  
  /**
   * Save device data
   */
  async saveDeviceData(deviceData) {
    await this.ensureInitialized();
    
    const { id, user_guid, user_handle, device_name, last_verified_at } = deviceData;
    const now = new Date().toISOString();
    
    try {
      // Check if device exists
      const result = this.exec('SELECT id FROM devices WHERE id = ? LIMIT 1', [id]);
      const exists = result.length > 0 && result[0].values.length > 0;
      
      if (exists) {
        this.exec(`
          UPDATE devices 
          SET user_guid = ?, user_handle = ?, device_name = ?, 
              last_verified_at = ?, updated_at = ?
          WHERE id = ?
        `, [
          user_guid,
          user_handle,
          device_name,
          last_verified_at || now,
          now,
          id
        ]);
      } else {
        this.exec(`
          INSERT INTO devices (id, user_guid, user_handle, device_name, 
                              last_verified_at, created_at, updated_at)
          VALUES (?, ?, ?, ?, ?, ?, ?)
        `, [
          id,
          user_guid,
          user_handle,
          device_name,
          last_verified_at || now,
          now,
          now
        ]);
      }
      
      await this.persist();
      return true;
    } catch (error) {
      console.error('Error saving device data:', error);
      return false;
    }
  }
  
  /**
   * Get device by ID
   */
  async getDeviceById(deviceId) {
    await this.ensureInitialized();
    
    try {
      const result = this.exec('SELECT * FROM devices WHERE id = ? LIMIT 1', [deviceId]);
      
      if (result.length === 0 || result[0].values.length === 0) {
        return null;
      }
      
      const columns = result[0].columns;
      const values = result[0].values[0];
      
      const device = {};
      columns.forEach((col, i) => {
        device[col] = values[i];
      });
      
      return device;
    } catch (error) {
      console.error('Error getting device:', error);
      return null;
    }
  }
  
  /**
   * Get devices by user handle
   */
  async getDevicesByUserHandle(handle) {
    await this.ensureInitialized();
    
    try {
      const result = this.exec('SELECT * FROM devices WHERE user_handle = ?', [handle]);
      
      if (result.length === 0 || result[0].values.length === 0) {
        return [];
      }
      
      const columns = result[0].columns;
      return result[0].values.map(row => {
        const device = {};
        columns.forEach((col, i) => {
          device[col] = row[i];
        });
        return device;
      });
    } catch (error) {
      console.error('Error getting devices by user:', error);
      return [];
    }
  }
  
  /**
   * Update device name
   */
  async updateDeviceName(deviceId, newName) {
    await this.ensureInitialized();
    
    try {
      this.exec(`
        UPDATE devices SET device_name = ?, updated_at = ? WHERE id = ?
      `, [newName, new Date().toISOString(), deviceId]);
      
      // Queue for sync
      await this.queueChange('update', 'devices', deviceId, { device_name: newName });
      
      await this.persist();
      return true;
    } catch (error) {
      console.error('Error updating device name:', error);
      return false;
    }
  }
  
  /**
   * Update user handle
   */
  async updateUserHandle(oldHandle, newHandle) {
    await this.ensureInitialized();
    
    try {
      const now = new Date().toISOString();
      
      // Start transaction
      this.exec('BEGIN TRANSACTION');
      
      // Update user record
      this.exec(`
        UPDATE users SET handle = ?, updated_at = ? WHERE handle = ?
      `, [newHandle, now, oldHandle]);
      
      // Update all devices with this handle
      this.exec(`
        UPDATE devices SET user_handle = ?, updated_at = ? WHERE user_handle = ?
      `, [newHandle, now, oldHandle]);
      
      // Commit transaction
      this.exec('COMMIT');
      
      // Queue for sync
      await this.queueChange('update', 'users', oldHandle, {
        handle: newHandle,
        old_handle: oldHandle
      });
      
      await this.persist();
      return true;
    } catch (error) {
      // Rollback on error
      try {
        this.exec('ROLLBACK');
      } catch (e) {
        console.error('Error rolling back transaction:', e);
      }
      
      console.error('Error updating user handle:', error);
      return false;
    }
  }
  
  /**
   * Update user PIN
   */
  async updateUserPin(handle, pin) {
    await this.ensureInitialized();
    
    try {
      const user = await this.getUserByHandle(handle);
      if (!user) {
        return false;
      }
      
      // Simple PIN hash (for demo only)
      const pinHash = `pin_hash_${pin}_${Date.now()}`;
      
      this.exec(`
        UPDATE users 
        SET has_pin = 1, pin_hash = ?, updated_at = ? 
        WHERE handle = ?
      `, [pinHash, new Date().toISOString(), handle]);
      
      // Queue for sync
      await this.queueChange('update', 'users', handle, { 
        pin_hash: pinHash,
        has_pin: 1
      });
      
      await this.persist();
      return true;
    } catch (error) {
      console.error('Error updating user PIN:', error);
      return false;
    }
  }
  
  /**
   * Verify PIN
   */
  async verifyPin(handle, pin) {
    await this.ensureInitialized();
    
    try {
      const user = await this.getUserByHandle(handle);
      if (!user || !user.pin_hash) {
        return false;
      }
      
      // In a real implementation, use proper password verification
      // This is just for demo
      return user.pin_hash.startsWith(`pin_hash_${pin}_`);
    } catch (error) {
      console.error('Error verifying PIN:', error);
      return false;
    }
  }
  
  /**
   * Queue change for sync
   */
  async queueChange(changeType, tableName, recordId, data) {
    await this.ensureInitialized();
    
    try {
      const id = this.generateId();
      const now = new Date().toISOString();
      
      this.exec(`
        INSERT INTO local_changes (id, table_name, record_id, change_type, change_data, created_at, synced)
        VALUES (?, ?, ?, ?, ?, ?, 0)
      `, [
        id,
        tableName,
        recordId,
        changeType,
        JSON.stringify(data),
        now
      ]);
      
      await this.persist();
      return true;
    } catch (error) {
      console.error('Error queueing change:', error);
      return false;
    }
  }
  
  /**
   * Get pending changes
   */
async getPendingChanges() {
  await this.ensureInitialized();
  
  try {
    const result = this.exec(`
      SELECT * FROM local_changes 
      WHERE synced = 0 
      ORDER BY created_at ASC
    `);
    
    // Add this null check
    if (!result || result.length === 0 || result[0].values.length === 0) {
      return [];
    }
    
    const columns = result[0].columns;
    
    return result[0].values.map(row => {
      const change = {};
      
      columns.forEach((col, i) => {
        if (col === 'change_data') {
          try {
            change[col] = JSON.parse(row[i]);
          } catch (e) {
            change[col] = row[i];
          }
        } else {
          change[col] = row[i];
        }
      });
      
      return change;
    });
  } catch (error) {
    console.error('Error getting pending changes:', error);
    return [];
  }
}  
  /**
   * Mark changes as synced
   */
  async markChangesAsSynced(changeIds) {
    await this.ensureInitialized();
    
    if (!changeIds || changeIds.length === 0) {
      return true;
    }
    
    try {
      const placeholders = changeIds.map(() => '?').join(',');
      
      this.exec(`
        UPDATE local_changes 
        SET synced = 1 
        WHERE id IN (${placeholders})
      `, changeIds);
      
      await this.persist();
      return true;
    } catch (error) {
      console.error('Error marking changes as synced:', error);
      return false;
    }
  }
  
  /**
   * Generate random ID
   */
  generateId() {
    // Simple UUID v4 implementation
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }
}

// Create singleton instance
const localDbService = new LocalDbService();

// Export the instance
export { localDbService };
export default localDbService;
