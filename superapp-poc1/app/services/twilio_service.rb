class TwilioService
  class << self
    def send_sms(to, body)
      logger.debug "========== TWILIO SMS START =========="
      logger.debug "To: #{to}"
      
      # Log verification code if present in the message
      if body.include?("verification code")
        code = body.match(/code: (\d+)/)[1]
        logger.debug "Verification code being sent: #{code}"
      end
      
      logger.debug "Message body: #{body}"
      logger.debug "Using Twilio credentials:"
      logger.debug "  SID: #{ENV['TWILIO_ACCOUNT_SID']}"
      logger.debug "  From: #{ENV['TWILIO_PHONE_NUMBER']}"
      
      response = client.messages.create(
        from: ENV['TWILIO_PHONE_NUMBER'],
        to: to,
        body: body
      )
      
      logger.debug "Twilio Response:"
      logger.debug "  Message SID: #{response.sid}"
      logger.debug "  Status: #{response.status}"
      logger.debug "  Error Code: #{response.error_code}" if response.error_code
      logger.debug "  Error Message: #{response.error_message}" if response.error_message
      logger.info "SMS sent successfully"
      
      true
    rescue Twilio::REST::RestError => e
      logger.error "========== TWILIO ERROR =========="
      logger.error "Error Type: REST Error"
      logger.error "Message: #{e.message}"
      logger.error "Code: #{e.code}"
      logger.error "Status: #{e.status}"
      logger.error "More Info: #{e.more_info}"
      logger.error "Details: #{e.details}"
      logger.error "Backtrace:\n#{e.backtrace.join("\n")}"
      false
    rescue => e
      logger.error "========== UNEXPECTED TWILIO ERROR =========="
      logger.error "Error Type: #{e.class}"
      logger.error "Message: #{e.message}"
      logger.error "Backtrace:\n#{e.backtrace.join("\n")}"
      false
    end

    private

    def client
      @client ||= begin
        logger.debug "Initializing new Twilio client"
        client = Twilio::REST::Client.new(
          ENV['TWILIO_ACCOUNT_SID'],
          ENV['TWILIO_AUTH_TOKEN']
        )
        logger.debug "Twilio client initialized successfully"
        client
      end
    end

    def logger
      Rails.logger
    end
  end
end
