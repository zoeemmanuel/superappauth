class DeviceSyncJob < ApplicationJob
  queue_as :default

  def perform(*args)
    # Here we'll implement the device synchronization logic
    Rails.logger.info "Starting device sync job at #{Time.current}"
    
    begin
      # Call the device sync service
      DeviceSyncService.new.sync_all_devices
      Rails.logger.info "Device sync completed successfully"
    rescue => e
      Rails.logger.error "Error in device sync job: #{e.message}"
      Rails.logger.error e.backtrace.join("\n")
    end
  end
end
