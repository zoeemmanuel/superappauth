class DeviceSyncService
  attr_reader :device_path

  def initialize(device_path = nil)
    @device_path = device_path
  end

  # Sync a specific device with all other devices for the same user
  def sync_device_data
    return false unless @device_path
    
    begin
      # Get local database connection
      local_db = SQLite3::Database.new(Rails.root.join('db', @device_path))
      local_db.results_as_hash = true
      
      # Get device info to identify user
      device_info = local_db.get_first_row("SELECT handle, guid FROM device_info LIMIT 1")
      
      return false unless device_info && device_info['handle']
      
      user_handle = device_info['handle']
      Rails.logger.info "Syncing device #{@device_path} for user #{user_handle}"
      
      # Get last sync timestamp
      last_sync = local_db.get_first_value("SELECT MAX(last_sync) FROM sync_state") || Time.at(0).iso8601
      timestamp = Time.current.iso8601
      
      # 1. Find all devices for this user
      other_devices = find_devices_for_user(user_handle, @device_path)
      
      # 2. Process changes in local database
      local_changes = []
      begin
        # Check if local_changes table exists
        has_local_changes = local_db.get_first_value("SELECT 1 FROM sqlite_master WHERE type='table' AND name='local_changes'")
        
        if has_local_changes
          # Get changes that need to be synced
          local_changes = local_db.execute("SELECT * FROM local_changes WHERE synced = 0")
          
          Rails.logger.info "Found #{local_changes.size} unsynchronized changes in #{@device_path}"
        else
          # Create the local_changes table
          local_db.execute(<<~SQL)
            CREATE TABLE local_changes (
              id TEXT PRIMARY KEY,
              sql_statement TEXT,
              created_at TEXT,
              synced INTEGER DEFAULT 0
            )
          SQL
        end
      rescue SQLite3::Exception => e
        Rails.logger.error "Error getting local changes: #{e.message}"
      end
      
      # 3. Apply local changes to other devices
      other_devices.each do |other_device_path|
        begin
          Rails.logger.info "Syncing changes to device: #{other_device_path}"
          other_db = SQLite3::Database.new(Rails.root.join('db', other_device_path))
          
          # Apply each local change to the other device
          local_changes.each do |change|
            begin
              other_db.execute(change['sql_statement'])
              Rails.logger.debug "Applied change #{change['id']} to #{other_device_path}"
            rescue SQLite3::Exception => e
              Rails.logger.error "Error applying change to #{other_device_path}: #{e.message}"
            end
          end
          
          # Get changes from other device
          ensure_local_changes_table(other_db)
          other_changes = other_db.execute("SELECT * FROM local_changes WHERE synced = 0")
          
          # Apply changes from other device to local database
          other_changes.each do |change|
            begin
              local_db.execute(change['sql_statement'])
              Rails.logger.debug "Applied change from #{other_device_path}: #{change['id']}"
              
              # Mark change as synced in other device
              other_db.execute("UPDATE local_changes SET synced = 1 WHERE id = ?", [change['id']])
            rescue SQLite3::Exception => e
              Rails.logger.error "Error applying other device change: #{e.message}"
            end
          end
          
          other_db.close
        rescue StandardError => e
          Rails.logger.error "Error syncing with device #{other_device_path}: #{e.message}"
        end
      end
      
      # 4. Mark local changes as synced
      local_changes.each do |change|
        begin
          local_db.execute("UPDATE local_changes SET synced = 1 WHERE id = ?", [change['id']])
        rescue SQLite3::Exception => e
          Rails.logger.error "Error marking change as synced: #{e.message}"
        end
      end
      
      # 5. Update sync state
      local_db.execute(
        "INSERT INTO sync_state (last_sync, status) VALUES (?, ?)",
        [timestamp, 'synced']
      )
      
      Rails.logger.info "Sync completed for #{@device_path}: processed #{local_changes.size} local changes"
      
      local_db.close
      return true
    rescue StandardError => e
      Rails.logger.error "Error syncing device #{@device_path}: #{e.message}"
      Rails.logger.error e.backtrace.join("\n")
      return false
    end
  end
  
  # Sync all devices
  def sync_all_devices
    count = 0
    success = 0
    
    Dir.glob(Rails.root.join('db', 'devices', '*.sqlite3')).each do |db_path|
      device_path = db_path.split('db/').last
      count += 1
      
      # Only sync each device once
      begin
        if sync_device_data(device_path)
          success += 1
        end
      rescue StandardError => e
        Rails.logger.error "Error syncing device #{device_path}: #{e.message}"
      end
    end
    
    Rails.logger.info "Completed sync of all devices: #{success}/#{count} successful"
    
    return {
      total: count,
      successful: success
    }
  end
  
  # Record a change in the local_changes table
  def self.record_change(device_path, sql_statement)
    return false unless device_path && sql_statement
    
    begin
      db = SQLite3::Database.new(Rails.root.join('db', device_path))
      
      # Ensure local_changes table exists
      ensure_local_changes_table(db)
      
      # Add change record
      id = SecureRandom.uuid
      timestamp = Time.current.iso8601
      
      db.execute(
        "INSERT INTO local_changes (id, sql_statement, created_at, synced) VALUES (?, ?, ?, ?)",
        [id, sql_statement, timestamp, 0]
      )
      
      db.close
      return true
    rescue SQLite3::Exception => e
      Rails.logger.error "Error recording change: #{e.message}"
      return false
    end
  end
  
  private
  
  # Find all devices for a user
  def find_devices_for_user(handle, exclude_path = nil)
    devices = []
    
    Dir.glob(Rails.root.join('db', 'devices', '*.sqlite3')).each do |db_path|
      device_path = db_path.split('db/').last
      
      # Skip the current device
      next if device_path == exclude_path
      
      begin
        db = SQLite3::Database.new(db_path)
        device_handle = db.get_first_value("SELECT handle FROM device_info LIMIT 1")
        db.close
        
        if device_handle == handle
          devices << device_path
        end
      rescue SQLite3::Exception => e
        Rails.logger.error "Error checking device #{device_path}: #{e.message}"
      end
    end
    
    return devices
  end
  
  # Ensure the local_changes table exists
  def self.ensure_local_changes_table(db)
    begin
      # Check if table exists
      has_table = db.get_first_value("SELECT 1 FROM sqlite_master WHERE type='table' AND name='local_changes'")
      
      unless has_table
        db.execute(<<~SQL)
          CREATE TABLE local_changes (
            id TEXT PRIMARY KEY,
            sql_statement TEXT,
            created_at TEXT,
            synced INTEGER DEFAULT 0
          )
        SQL
      end
    rescue SQLite3::Exception => e
      Rails.logger.error "Error ensuring local_changes table: #{e.message}"
    end
  end
  
  # Instance method version for convenience
  def ensure_local_changes_table(db)
    self.class.ensure_local_changes_table(db)
  end
end
