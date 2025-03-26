Rails.application.routes.draw do
  
  # API routes
  namespace :api do
    namespace :v1 do
      # Use scope instead of namespace for the auth part
      scope path: 'auth' do
        # Authentication routes
        post 'check_device', to: 'auth#check_device'
        post 'verify_login', to: 'auth#verify_login'
        post 'verify_code', to: 'auth#verify_code'
        post 'create_handle', to: 'auth#create_handle'
        
        # Handle and phone verification endpoints
        get 'check_handle', to: 'auth#check_handle'
        get 'check_phone', to: 'auth#check_phone'
        get 'suggest_handles', to: 'auth#suggest_handles'
        get 'session_status', to: 'auth#session_status'

        # New fast authentication endpoint
        post 'fast_authenticate', to: 'auth#fast_authenticate'
        get 'link-device', to: 'devices#link_device'
        
        # Database schema updates
        post 'update_database_schema', to: 'auth#update_database_schema'
        
        # PIN related routes
        get 'check_pin_status', to: 'auth#check_pin_status'
        post 'setup_pin', to: 'auth#setup_pin'
        post 'verify_pin', to: 'auth#verify_pin'
        
        get 'check_session_status', to: 'auth#session_status'
         
        # WebAuthn routes
        post 'webauthn_registration_options', to: 'auth#webauthn_registration_options'
        post 'register_webauthn_credential', to: 'auth#register_webauthn_credential'
        post 'webauthn_login_options', to: 'auth#webauthn_login_options'
        post 'verify_webauthn_login', to: 'auth#verify_webauthn_login'
      end
    end
  end
  
  # Direct PIN setup route at root level that forwards to API
  post 'setup_pin', to: 'api/v1/auth#setup_pin'
  
  # Dashboard routes
  get 'dashboard', to: 'dashboard#index'
  
  # Auth routes - group these together
  get '/logout_confirmation', to: 'auth#logout_confirmation'
  match 'logout', to: 'dashboard#logout', via: [:delete, :post] # Support both DELETE and POST
  
  # Dashboard management routes
  delete 'reset_devices', to: 'dashboard#reset_devices', defaults: { format: :html }
  put 'update_handle', to: 'dashboard#update_handle', defaults: { format: :json }
  
  # Add the reset_device route here at the root level like your other dashboard actions
  post 'reset_device', to: 'dashboard#reset_device'
 
  # Rename devices
  post 'devices/rename', to: 'devices#rename'  
  
 # Sync
 resources :sync, only: [:index, :create] do
      collection do
        get 'status'
      end
    end

  # Device linking routes
  post 'dashboard/generate_linking_code', to: 'dashboard#generate_linking_code'
  
  # Devices controller routes
  resources :devices, only: [:index, :update, :destroy] do
    member do
      post 'trust'
      post 'untrust'
      post 'sign_out'
      put 'rename'
    end
    
    collection do
      post 'generate_linking_code'
      get 'verify_linking_code'
    end
  end
  
  # Device linking via URL
  get 'link-device', to: 'devices#link_device'
  
  # Root route
  root 'auth#login'
  
  # Catch-all for client-side routing
  get '*path', to: 'home#index', constraints: ->(request) do
    !request.xhr? && request.format.html?
  end
end
