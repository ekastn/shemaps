#!/bin/sh

# Generate runtime configuration
echo "window.env = {"
echo "  VITE_API_BASE_URL: "${VITE_API_URL}","
echo "  VITE_GOOGLE_MAPS_API_KEY: "${VITE_GOOGLE_MAPS_API_KEY}","
echo "  VITE_ALLOWED_ORIGINS: "${VITE_ALLOWED_ORIGINS}","
echo "  VITE_WS_URL: "${VITE_WS_URL}","echo "  VITE_GOOGLE_MAPS_ID: "${VITE_GOOGLE_MAPS_ID}","echo "}" > /usr/share/nginx/html/config.js

# Start Nginx
exec nginx -g "daemon off;"

