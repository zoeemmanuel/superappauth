module Api
  module V1
    class AuthMiddleware
      def initialize(app)
        @app = app
      end
      
      def call(env)
        request = ActionDispatch::Request.new(env)
        
        # Skip for non-API or auth routes
        if !request.path.include?('/api/v1/') || request.path.include?('/api/v1/auth/')
          return @app.call(env)
        end
        
        # Get auth version from request header
        auth_version = request.headers['HTTP_X_AUTH_VERSION'].to_i
        
        # Get device key
        device_key = request.headers['HTTP_X_DEVICE_KEY']
        
        if device_key && auth_version > 0
          # Find user for this device
          user_handle = nil
          user_guid = nil
          
          # Lookup device in database
          Dir.glob(Rails.root.join('db', 'devices', '*.sqlite3')).each do |db_path|
            begin
              db = SQLite3::Database.new(db_path)
              device_info = db.get_first_row("SELECT handle, guid FROM device_info WHERE device_id = ? LIMIT 1", [device_key])
              db.close
              
              if device_info
                user_handle = device_info[0]
                user_guid = device_info[1]
                break
              end
            rescue => e
              puts "Error checking device: #{e.message}"
            end
          end
          
          if user_handle
            # Find user
            user = User.find_by(handle: user_handle)
            
            # Check auth version
            if user && user.auth_version.present? && auth_version < user.auth_version
              # Auth version mismatch - return error
              return [
                401,
                {'Content-Type' => 'application/json'},
                [{ error: 'AuthVersionMismatch', current_version: user.auth_version }.to_json]
              ]
            end
          end
        end
        
        # Continue with request
        @app.call(env)
      end
    end
  end
end
