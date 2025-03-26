#!/bin/bash
# Script to create a comprehensive backup of the staging environment

# Set variables
STAGING_APP_PATH="/opt/superapp-poc1"
BACKUP_DIR="/opt/backups"
TIMESTAMP=$(date +%Y-%m-%d-%H%M%S)
BACKUP_FILE="${BACKUP_DIR}/superapp-full-${TIMESTAMP}.tar.gz"
DB_BACKUP_DIR="${BACKUP_DIR}/databases-${TIMESTAMP}"

# Create backup directories if they don't exist
mkdir -p ${BACKUP_DIR}
mkdir -p ${DB_BACKUP_DIR}

echo "Starting backup of staging environment..."

# Backup database files separately
echo "Backing up database files..."
cp -r ${STAGING_APP_PATH}/db/*.sqlite3 ${DB_BACKUP_DIR}/ 2>/dev/null || true
cp -r ${STAGING_APP_PATH}/db/devices/*.sqlite3 ${DB_BACKUP_DIR}/ 2>/dev/null || true

# Create full application backup
echo "Creating full application backup..."
cd /opt
tar -czf ${BACKUP_FILE} --exclude="*/tmp/cache/*" --exclude="*/tmp/sockets/*" --exclude="*/log/*.log" superapp-poc1

echo "Backup completed successfully!"
echo "Full backup: ${BACKUP_FILE}"
echo "Database backup: ${DB_BACKUP_DIR}"

# Print backup size information
FULL_SIZE=$(du -h ${BACKUP_FILE} | cut -f1)
DB_SIZE=$(du -sh ${DB_BACKUP_DIR} | cut -f1)

echo "Backup sizes:"
echo "- Full backup: ${FULL_SIZE}"
echo "- Database backup: ${DB_SIZE}"
