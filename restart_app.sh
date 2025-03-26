#!/bin/bash
echo "Restarting SuperApp..."

# Change to application directory
cd /opt/superapp-poc1

# Kill any existing processes
echo "Stopping existing processes..."
sudo pkill -9 puma
sudo pkill -9 ruby
sudo fuser -k 3000/tcp

# Clean up pid files
echo "Cleaning up pid files..."
rm -f tmp/pids/server.pid

# Clean and rebuild assets
echo "Rebuilding assets..."
rm -rf public/assets
rm -rf app/assets/builds/*
yarn build
yarn build:css
RAILS_ENV=production bundle exec rails assets:precompile

# Restart services in correct order
echo "Restarting services..."
sudo systemctl restart puma
sleep 2  # Wait for Puma to fully start
sudo systemctl restart nginx

# Verify services are running
echo "Verifying services..."
echo "Puma status:"
sudo systemctl status puma
echo "Nginx status:"
sudo systemctl status nginx
echo "Port 3000 listeners:"
sudo lsof -i :3000

echo "Restart complete!"
