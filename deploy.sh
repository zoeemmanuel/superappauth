#!/bin/bash
# Script to deploy from staging to production

# Configuration
PROD_SERVER="167.99.89.187"  # Production server IP
PROD_HOSTNAME="ZoePOC1"      # Production hostname
STAGING_APP_PATH="/opt/superapp-poc1"
PROD_APP_PATH="/opt/superapp-poc1"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)

# Exit on error
set -e

echo "Starting deployment from staging to production..."

# Verify we're on the staging server
if [ "$(hostname)" != "stage-superapp" ]; then
  echo "Error: This script should be run from the staging server."
  exit 1
fi

# Create backup directories if they don't exist
echo "Creating backup directory on production server..."
ssh root@${PROD_SERVER} "mkdir -p /opt/backups"

# Create backup of production's database
echo "Creating backup of production databases..."
ssh root@${PROD_SERVER} "mkdir -p /opt/backups/databases-${TIMESTAMP} && \
                        cp -r ${PROD_APP_PATH}/db/*.sqlite3 /opt/backups/databases-${TIMESTAMP}/ && \
                        cp -r ${PROD_APP_PATH}/db/devices/*.sqlite3 /opt/backups/databases-${TIMESTAMP}/ 2>/dev/null || true"

# Create a full backup of production
echo "Creating full backup of production environment..."
ssh root@${PROD_SERVER} "cd /opt && \
                        tar -czf /opt/backups/superapp-full-${TIMESTAMP}.tar.gz ${PROD_APP_PATH##*/}"

# Stop the production server
echo "Stopping Puma server on production..."
ssh root@${PROD_SERVER} "cd ${PROD_APP_PATH} && pkill -f puma || true"
sleep 5

# Synchronize files excluding specific items
echo "Copying application files from staging to production..."
rsync -avz --delete \
  --exclude='.git/' \
  --exclude='log/*.log' \
  --exclude='tmp/pids/' \
  --exclude='tmp/sockets/' \
  --exclude='tmp/cache/' \
  --exclude='db/*.sqlite3-journal' \
  --exclude='config/puma.rb' \
  --exclude='node_modules/' \
  ${STAGING_APP_PATH}/ root@${PROD_SERVER}:${PROD_APP_PATH}/

# Copy devices databases specifically
echo "Copying device databases..."
ssh root@${PROD_SERVER} "mkdir -p ${PROD_APP_PATH}/db/devices"
rsync -avz ${STAGING_APP_PATH}/db/devices/*.sqlite3 root@${PROD_SERVER}:${PROD_APP_PATH}/db/devices/

# Update puma.rb on production to maintain TCP binding instead of socket
echo "Updating Puma configuration..."
cat << 'EOF' > /tmp/puma.rb
# Puma configuration
threads_count = ENV.fetch("RAILS_MAX_THREADS") { 5 }
threads threads_count, threads_count

# Environment
environment ENV.fetch("RAILS_ENV") { "production" }

# Directory
directory ENV.fetch("RAILS_ROOT") { Dir.pwd }

# TCP binding
bind "tcp://0.0.0.0:3000"

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
EOF

scp /tmp/puma.rb root@${PROD_SERVER}:${PROD_APP_PATH}/config/puma.rb

# Ensure directory permissions
echo "Setting permissions..."
ssh root@${PROD_SERVER} "mkdir -p ${PROD_APP_PATH}/tmp/pids ${PROD_APP_PATH}/tmp/sockets ${PROD_APP_PATH}/log && \
                        chmod -R 755 ${PROD_APP_PATH}/tmp ${PROD_APP_PATH}/log"

# Start the production server
echo "Starting Puma on production..."
ssh root@${PROD_SERVER} "cd ${PROD_APP_PATH} && RAILS_ENV=production bundle exec puma -C config/puma.rb -d"

echo "Deployment complete!"
echo "Production backup is at: /opt/backups/superapp-full-${TIMESTAMP}.tar.gz"
echo "Database backup is at: /opt/backups/databases-${TIMESTAMP}/"
echo "To verify the deployment, check: http://${PROD_SERVER}:3000"
