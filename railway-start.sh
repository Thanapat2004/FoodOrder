#!/bin/bash

echo "🚀 Starting Food Ordering App on Railway..."

# Wait for database to be ready
sleep 2

# Generate app key if not exists
if [ -z "$APP_KEY" ]; then
    echo "📋 Generating application key..."
    php artisan key:generate --force
fi

# Run migrations
echo "📊 Running database migrations..."
php artisan migrate --force

# Clear and cache config
echo "⚡ Optimizing application..."
php artisan config:clear
php artisan config:cache

# Create storage symlink
echo "🔗 Creating storage symlink..."
php artisan storage:link || true

echo "✅ Application ready! Starting server..."

# Start the application
exec php artisan serve --host=0.0.0.0 --port=${PORT:-8000}
