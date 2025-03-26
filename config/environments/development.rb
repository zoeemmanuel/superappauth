require 'logger'

Rails.application.configure do
  # Development settings
  config.cache_classes = false
  config.eager_load = false
  config.consider_all_requests_local = true
  
  # Host configuration
  config.hosts.clear
  config.hosts << "superappproject.com"
  config.hosts << "www.superappproject.com"
  config.hosts << "localhost"
  config.hosts << "0.0.0.0"
  
  # Active Storage configuration
  config.active_storage.service = :local

  # Create custom logger that logs to both file and console
  class MultiLogger
    def initialize(*targets)
      @targets = targets
    end

    def formatter=(formatter)
      @targets.each { |t| t.formatter = formatter }
    end

    def formatter
      @targets.first&.formatter
    end

    def level=(level)
      @targets.each { |t| t.level = level }
    end

    def level 
      @targets.first&.level
    end

    # Add severity check methods
    def debug?
      @targets.any? { |t| t.debug? }
    end

    def info?
      @targets.any? { |t| t.info? }
    end

    def warn?
      @targets.any? { |t| t.warn? }
    end

    def error?
      @targets.any? { |t| t.error? }
    end

    def fatal?
      @targets.any? { |t| t.fatal? }
    end

    def debug(message)
      @targets.each { |t| t.debug(message) }
    end

    def info(message)
      @targets.each { |t| t.info(message) }
    end

    def warn(message)
      @targets.each { |t| t.warn(message) }
    end

    def error(message)
      @targets.each { |t| t.error(message) }
    end

    def fatal(message)
      @targets.each { |t| t.fatal(message) }
    end
  end

  # Set up console logger
  console_logger = Logger.new(STDOUT)
  console_logger.level = Logger::DEBUG

  # Set up file logger
  file_logger = Logger.new(Rails.root.join("log/development.log"))
  file_logger.level = Logger::DEBUG

  # Set up multi-logger
  multi_logger = MultiLogger.new(console_logger, file_logger)
  config.logger = multi_logger

  # Custom formatter
  formatter = proc do |severity, datetime, progname, msg|
    formatted_msg = "#{datetime.strftime('%Y-%m-%d %H:%M:%S')} #{severity}: #{msg}\n"
    puts msg if severity == "DEBUG" # Force debug messages to console
    formatted_msg
  end

  multi_logger.formatter = formatter
  config.log_level = :debug

  # Force logging
  config.colorize_logging = false
  config.active_record.verbose_query_logs = true
  config.log_tags = [:request_id]

  # Caching Configuration - Always Enabled
  config.action_controller.perform_caching = true
  config.action_controller.enable_fragment_cache_logging = true
config.cache_store = :file_store, Rails.root.join('tmp', 'cache')

 config.public_file_server.headers = {
    "Cache-Control" => "public, max-age=#{2.days.to_i}"
  }

  # Print deprecation notices to the Rails logger.
  config.active_support.deprecation = :log

  # Raise exceptions for disallowed deprecations.
  config.active_support.disallowed_deprecation = :raise

  # Tell Active Support which deprecation messages to disallow.
  config.active_support.disallowed_deprecation_warnings = []

  # Raise an error on page load if there are pending migrations.
  config.active_record.migration_error = :page_load

  # Highlight code that triggered database queries in logs.
  config.active_record.verbose_query_logs = true

  # CORS configuration
  config.middleware.insert_before 0, Rack::Cors do
    allow do
      origins 'superappproject.com', 'www.superappproject.com', 'localhost:3000'
      resource '*',
        headers: :any,
        methods: [:get, :post, :put, :patch, :delete, :options, :head],
        credentials: true
    end
  end
end
