FileUtils.rm_f '/opt/superapp-poc1/tmp/sockets/puma.sock'

# Puma configuration
threads_count = ENV.fetch("RAILS_MAX_THREADS") { 5 }
threads threads_count, threads_count

# Environment
environment ENV.fetch("RAILS_ENV") { "staging" }

# Directory
directory ENV.fetch("RAILS_ROOT") { Dir.pwd }

# Unix socket binding
bind "unix:///opt/superapp-poc1/tmp/sockets/puma.sock"

# Logging
stdout_redirect "log/puma.stdout.log", "log/puma.stderr.log", true

# Process management
pidfile ENV.fetch("PIDFILE") { "tmp/pids/server.pid" }

# Workers
workers ENV.fetch("WEB_CONCURRENCY") { 2 }

# Preload app for better performance
preload_app!

# Plugin for clean restarts
plugin :tmp_restart
