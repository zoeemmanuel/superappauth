require "test_helper"

class Api::V1::AuthControllerTest < ActionDispatch::IntegrationTest
  setup do
    Rails.logger.level = :debug
    # Clear any existing data
    User.delete_all
    Dir.glob(Rails.root.join('db', 'devices', '*.sqlite3')).each do |file|
      File.delete(file)
    end
  end

  test "complete verification flow" do
    puts "\n=== Starting verification flow test ==="
    
    # 1. Start with device check
    puts "\n--- Device Check ---"
    device_key = '1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef'
    post "/api/v1/auth/check_device", 
      headers: { 'X-Device-Key': device_key }
    
    puts "Device check response: #{response.body}"
    assert_response :success
    device_response = JSON.parse(response.body)
    assert_equal 'new_device', device_response['status']
    assert device_response['guid'].present?

    # 2. Try phone verification
    puts "\n--- Phone Verification ---"
    phone = '+447426401964'
    post "/api/v1/auth/verify_login", params: { identifier: phone }
    
    puts "Verify login response: #{response.body}"
    assert_response :success
    login_response = JSON.parse(response.body)
    assert_equal 'verification_sent', login_response['status']

    # Get the verification code from cache
    cache_key = "verification:#{phone}"
    verification = Rails.cache.read(cache_key)
    puts "Cache key: #{cache_key}"
    puts "Verification from cache: #{verification.inspect}"
    assert verification.present?, "Verification not found in cache"

    # 3. Submit verification code
    puts "\n--- Code Verification ---"
    post "/api/v1/auth/verify_code", 
      params: { code: verification[:code], phone: phone }
    
    puts "Verify code response: #{response.body}"
    assert_response :success
    code_response = JSON.parse(response.body)
    assert_equal 'needs_handle', code_response['status']

    # 4. Create handle
    puts "\n--- Handle Creation ---"
    post "/api/v1/auth/create_handle",
      params: { handle: '@testuser', phone: phone }
    
    puts "Create handle response: #{response.body}"
    assert_response :success
    handle_response = JSON.parse(response.body)
    assert_equal 'success', handle_response['status']
    
    puts "\n=== Test completed ==="
  end
end
