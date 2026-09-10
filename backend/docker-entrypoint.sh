#!/bin/sh
set -e

# Configure Apache port based on Render's $PORT env (defaults to 80 or 8000)
PORT="${PORT:-8000}"
sed -i "s/80/${PORT}/g" /etc/apache2/sites-available/000-default.conf /etc/apache2/ports.conf

# Auto-create SQLite database file if SQLite is configured
if [ "$DB_CONNECTION" = "sqlite" ] || [ -z "$DB_CONNECTION" ]; then
    mkdir -p /var/www/html/database
    touch /var/www/html/database/database.sqlite
    chown -R www-data:www-data /var/www/html/database
    chmod -R 775 /var/www/html/database
fi

echo "==> Configuring storage symlink..."
php artisan storage:link --force || true

echo "==> Caching Laravel configuration and routes..."
php artisan config:cache || true
php artisan route:cache || true
php artisan view:cache || true

echo "==> Running database migrations..."
php artisan migrate --force || true

echo "==> Seeding initial admin account if not present..."
php artisan db:seed --force || true

echo "==> Starting Apache web server on port ${PORT}..."
exec apache2-foreground
