module Api
  module V1
    class SyncController < ApplicationController
      skip_before_action :verify_authenticity_token
      
      # Process incoming changes from client
      def create
        # Check for authenticated session
        unless session[:device_session] == 'authenticated'
          return render json: { error: 'Not authenticated', success: false }, status: :unauthorized
        end
        
        # Ensure changes are provided
        unless params[:changes] && params[:changes].is_a?(Array)
          return render json: { 
            error: 'No changes provided or invalid format', 
            success: false 
          }, status: :bad_request
        end
        
        changes = params[:changes]
        processed_changes = []
        
        changes.each do |change|
          begin
            # Process each change based on type
            case change[:table_name]
            when 'device_info'
              process_device_change(change)
            when 'users'
              process_user_change(change)
            else
              logger.warn "Unhandled change type: #{change[:table_name]}"
              next
            end
            
            # Mark as processed
            processed_changes << change[:id]
          rescue => e
            # Log errors but continue processing other changes
            logger.error "Error processing change #{change[:id]}: #{e.message}"
            logger.error e.backtrace.join("\n")
          end
        end
        
        # Return success response
        render json: { 
          success: true, 
          processed: processed_changes,
          message: "Processed #{processed_changes.size} of #{changes.size} changes"
        }
      end
      
      # Get changes since a specific timestamp
      def index
        # Check for authenticated session
        unless session[:device_session] == 'authenticated'
          return render json: { error: 'Not authenticated', success: false }, status: :unauthorized
        end
        
        # Get timestamp parameter
        since = params[:since] ? Time.parse(params[:since]) : 30.days.ago
        
        # Get current user
        current_handle = session[:current_handle]
        user = User.find_by(handle: current_handle)
        
        unless user
          return render json: { 
            error: 'User not found', 
            success: false 
          }, status: :not_found
        end
        
        # Collect changes
        changes = []
        
        # Get user changes
        if user.updated_at > since
          changes << {
            id: "user-#{user.id}-#{user.updated_at.to_i}",
            table_name: 'users',
            record_id: user.handle,
            operation: 'update',
            data: {
              handle: user.handle,
              updated_at: user.updated_at.iso8601
            }
          }
          
          # Add PIN hash if it was updated
          if user.pin_set_at && user.pin_set_at > since
            changes.last[:data][:pin_hash] = user.pin_hash
          end
        end
        
        # Get device changes
        device_changes = collect_device_changes(since, user.handle)
        changes.concat(device_changes)
        
        # Return changes
        render json: { 
          success: true, 
          changes: changes,
          since: since.iso8601,
          current_time: Time.current.iso8601,
          message: "Found #{changes.size} changes since #{since.iso8601}"
        }
      end
      
      private
      
      # Process device-related changes
      def process_device_change(change)
        case change[:operation]
        when 'update'
          # Handle device name update
          if change[:data] && change[:data][:device_name]
            update_device_name(change[:record_id], change[:data][:device_name])
          end
        when 'upsert'
          # Handle full device update
          if change[:data]
            update_device_info(change[:record_id], change[:data])
          end
        end
      end
      
      # Process user-related changes
      def process_user_change(change)
        case change[:operation]
        when 'update'
          # Handle user updates
          
          # Handle change
          if change[:data] && change[:data][:handle] && change[:data][:old_handle]
            update_user_handle(change[:data][:old_handle], change[:data][:handle])
          end
          
          # PIN update
          if change[:data] && change[:data][:pin_hash]
            update_user_pin(change[:record_id], change[:data][:pin_hash])
          end
        end
      end
      
      # Update device name
      def update_device_name(device_id, new_name)
        # Find the device database
        device_path = find_device_by_id(device_id)
        return false unless device_path
        
        begin
          db = SQLite3::Database.new(Rails.root.join('db', device_path))
          db.execute(
            "UPDATE device_info SET device_name = ?, custom_name = ? WHERE device_id = ?", 
            [new_name, new_name, device_id]
          )
          db.close
          return true
        rescue SQLite3::Exception => e
          logger.error "Error updating device name: #{e.message}"
          return false
        end
      end
      
      # Update full device info
      def update_device_info(device_id, device_data)
        # Find the device database
        device_path = find_device_by_id(device_id)
        
        # If device not found, it might be a new device
        unless device_path
          # Check if this belongs to current user
          return false unless device_data[:handle] == session[:current_handle]
          
          # Create new device database
          device_guid = device_data[:guid] || SecureRandom.uuid
          device_path = "devices/#{device_guid}.sqlite3"
          
          # Create directory if needed
          FileUtils.mkdir_p(Rails.root.join('db', 'devices')) unless Dir.exist?(Rails.root.join('db', 'devices'))
        end
        
        begin
          db = SQLite3::Database.new(Rails.root.join('db', device_path))
          
          # Check if device_info table exists
          tables = db.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='device_info'")
          
          if tables.empty?
            # Create device_info table
            db.execute <<-SQL
              CREATE TABLE device_info (
                device_id TEXT PRIMARY KEY,
                handle TEXT,
                guid TEXT,
                phone TEXT,
                created_at TEXT,
                last_verified_at TEXT,
                device_name TEXT,
                device_type TEXT,
                is_trusted INTEGER DEFAULT 0,
                browser_info TEXT,
                custom_name TEXT
              )
            SQL
            
            # Insert new record
            db.execute(
              "INSERT INTO device_info (device_id, handle, guid, phone, created_at, last_verified_at, device_name, device_type) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
              [
                device_id,
                device_data[:handle],
                device_data[:guid] || device_guid,
                device_data[:phone],
                device_data[:created_at] || Time.current.iso8601,
                device_data[:last_verified_at] || Time.current.iso8601,
                device_data[:device_name],
                device_data[:device_type] || 'Unknown'
              ]
            )
          else
            # Update existing record
            db.execute(
              "UPDATE device_info SET handle = ?, guid = ?, phone = ?, last_verified_at = ?, device_name = ?, device_type = ?, custom_name = ? WHERE device_id = ?",
              [
                device_data[:handle],
                device_data[:guid],
                device_data[:phone],
                device_data[:last_verified_at] || Time.current.iso8601,
                device_data[:device_name],
                device_data[:device_type],
                device_data[:custom_name],
                device_id
              ]
            )
          end
          
          db.close
          return true
        rescue SQLite3::Exception => e
          logger.error "Error updating device info: #{e.message}"
          logger.error e.backtrace.join("\n")
          return false
        end
      end
      
      # Update user handle
      def update_user_handle(old_handle, new_handle)
        # Find the user
        user = User.find_by(handle: old_handle)
        return false unless user
        
        # Update handle
        user.handle = new_handle
        
        # Save changes
        user.save
        
        # Also update device databases
        update_handle_in_devices(old_handle, new_handle)
        
        return true
      end
      
      # Update user PIN
      def update_user_pin(handle, pin_hash)
        # Find the user
        user = User.find_by(handle: handle)
        return false unless user
        
        # Update PIN hash
        user.pin_hash = pin_hash
        user.pin_set_at = Time.current
        
        # Save changes
        user.save
        
        return true
      end
      
      # Update handle in device databases
      def update_handle_in_devices(old_handle, new_handle)
        Dir.glob(Rails.root.join('db', 'devices', '*.sqlite3')).each do |db_path|
          begin
            db = SQLite3::Database.new(db_path)
            db.execute(
              "UPDATE device_info SET handle = ? WHERE handle = ?", 
              [new_handle, old_handle]
            )
            db.close
          rescue SQLite3::Exception => e
            logger.error "Error updating handle in device #{db_path}: #{e.message}"
          end
        end
      end
      
      # Find device database by device ID
      def find_device_by_id(device_id)
        Dir.glob(Rails.root.join('db', 'devices', '*.sqlite3')).each do |db_path|
          begin
            db = SQLite3::Database.new(db_path)
            device = db.get_first_row(
              "SELECT device_id FROM device_info WHERE device_id = ? LIMIT 1", 
              [device_id]
            )
            db.close
            
            if device
              return db_path.split('db/').last
            end
          rescue SQLite3::Exception => e
            logger.error "Error checking device in #{db_path}: #{e.message}"
          end
        end
        
        return nil
      end
      
      # Collect device changes
      def collect_device_changes(since, handle)
        changes = []
        
        Dir.glob(Rails.root.join('db', 'devices', '*.sqlite3')).each do |db_path|
          begin
            db = SQLite3::Database.new(db_path)
            
            # Get device info
            device_info = db.get_first_row(
              "SELECT device_id, handle, guid, device_name, custom_name, last_verified_at FROM device_info WHERE handle = ? LIMIT 1", 
              [handle]
            )
            
            if device_info
              device_id = device_info[0]
              device_handle = device_info[1]
              device_guid = device_info[2]
              device_name = device_info[3]
              custom_name = device_info[4]
              last_verified_at = device_info[5] ? Time.parse(device_info[5]) : nil
              
              # Check if verified since the timestamp
              if last_verified_at && last_verified_at > since
                changes << {
                  id: "device-#{device_guid}-#{last_verified_at.to_i}",
                  table_name: 'device_info',
                  record_id: device_id,
                  operation: 'update',
                  data: {
                    device_id: device_id,
                    handle: device_handle,
                    guid: device_guid,
                    device_name: device_name || custom_name,
                    custom_name: custom_name,
                    last_verified_at: last_verified_at.iso8601
                  }
                }
              end
            end
            
            db.close
          rescue => e
            logger.error "Error checking device changes in #{db_path}: #{e.message}"
          end
        end
        
        return changes
      end
    end
  end
end
