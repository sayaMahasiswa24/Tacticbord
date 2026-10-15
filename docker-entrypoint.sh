#!/bin/sh
set -e

DB_DIR="/var/www/html/database"
DB_FILE="$DB_DIR/database.sqlite"

# Ensure database directory exists with proper permissions
mkdir -p "$DB_DIR"
if [ ! -f "$DB_FILE" ]; then
    touch "$DB_FILE"
    chown -R www-data:www-data "$DB_DIR"
    chmod 775 "$DB_DIR"
    chmod 664 "$DB_FILE"
    echo "Fresh SQLite database created at $DB_FILE. Running migrations and seeders..."
    php artisan migrate --force
    php artisan db:seed --class=TacticalSeeder --force
else
    chown -R www-data:www-data "$DB_DIR"
    chmod 775 "$DB_DIR"
    chmod 664 "$DB_FILE"
    echo "Existing SQLite database detected. Ensuring migrations are up to date..."
    php artisan migrate --force
fi

# Ensure storage subdirectories and permissions
mkdir -p /var/www/html/storage/framework/cache/data
mkdir -p /var/www/html/storage/framework/sessions
mkdir -p /var/www/html/storage/framework/views
mkdir -p /var/www/html/storage/logs
chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache
chmod -R 775 /var/www/html/storage /var/www/html/bootstrap/cache

# Generate APP_KEY if not already set
if [ -z "$APP_KEY" ]; then
    echo "APP_KEY is missing. Generating application key..."
    php artisan key:generate --force
fi

# Optimize Laravel for production
php artisan config:cache || true
php artisan route:cache || true
php artisan view:cache || true

echo "Starting Supervisor (PHP-FPM + Nginx)..."
exec "$@"
