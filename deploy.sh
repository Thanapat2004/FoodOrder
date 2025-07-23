#!/bin/bash

# Railway deployment script
echo "Running post-deployment commands..."

# Run database migrations
php artisan migrate --force

# Create storage symlink if needed
php artisan storage:link

# Seed database (optional - only run once)
# php artisan db:seed --force

echo "Deployment completed successfully!"
