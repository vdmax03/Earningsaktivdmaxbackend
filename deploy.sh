#!/bin/bash

echo "Starting deployment..."

# Set default environment variables
export PORT=${PORT:-5000}
export SECRET_KEY=${SECRET_KEY:-"dev-secret-key-change-in-production"}

echo "Port: $PORT"
echo "Database URL: ${DATABASE_URL:-'Not set'}"

# Test if application can start
echo "Testing application startup..."
python -c "
import sys
try:
    from src.main import app
    print('✓ Application imported successfully')
    
    with app.test_client() as client:
        response = client.get('/ping')
        print(f'✓ Ping endpoint status: {response.status_code}')
        
        response = client.get('/')
        print(f'✓ Root endpoint status: {response.status_code}')
        
except Exception as e:
    print(f'✗ Error: {e}')
    sys.exit(1)
"

if [ $? -eq 0 ]; then
    echo "✓ Application test passed"
    echo "Starting gunicorn..."
    exec gunicorn --workers 1 --bind 0.0.0.0:$PORT --timeout 120 --keep-alive 5 wsgi:app
else
    echo "✗ Application test failed"
    exit 1
fi 