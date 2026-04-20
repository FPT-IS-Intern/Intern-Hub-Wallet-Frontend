#!/bin/sh
set -e

# Set default NODE_ENV if not provided
export NODE_ENV="${NODE_ENV:-production}"

# Generate env.js from environment variables
if [ -f /usr/share/nginx/html/env.js.template ]; then
  envsubst < /usr/share/nginx/html/env.js.template > /usr/share/nginx/html/env.js
  echo "✅ Generated env.js"
  echo "   API_URL=${API_URL}"
  echo "   NODE_ENV=${NODE_ENV}"
else
  echo "⚠️  env.js.template not found, skipping"
fi

# Start nginx
exec nginx -g 'daemon off;'
