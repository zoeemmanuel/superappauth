#!/bin/bash

# Kill all existing puma processes
echo "Stopping all Puma processes..."
pkill -9 -f puma

# Clean up socket and pid files
echo "Cleaning up socket and pid files..."
rm -f /opt/superapp-poc1/tmp/sockets/puma.sock
rm -f /opt/superapp-poc1/tmp/pids/puma.pid
rm -f /opt/superapp-poc1/tmp/pids/puma.state

# Ensure directories exist with correct permissions
echo "Creating directories..."
mkdir -p /opt/superapp-poc1/tmp/sockets
mkdir -p /opt/superapp-poc1/tmp/pids
chmod -R 777 /opt/superapp-poc1/tmp

# Wait for processes to fully stop
echo "Waiting for processes to stop..."
sleep 5

# Start Puma
echo "Starting Puma..."
cd /opt/superapp-poc1
RAILS_ENV=production bundle exec puma -C config/puma.rb
