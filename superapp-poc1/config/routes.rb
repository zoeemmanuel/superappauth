Rails.application.routes.draw do
  namespace :api do
    namespace :v1 do
      resources :auth, only: [] do
        collection do
          post :check_device
          post :verify_login
          post :verify_code
          post :create_handle
          get :check_status
          post :scan_local_devices
          get :check_handle
          get :check_phone
        end
      end
    end
  end
  
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
  
  root 'auth#login'
end
