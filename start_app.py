#!/usr/bin/env python3
"""
Script untuk start aplikasi dengan error handling yang lebih baik
"""

import os
import sys
import time

def main():
    """Main function untuk start aplikasi"""
    print("Starting Earning Sakti Backend...")
    
    # Set environment variables jika belum ada
    if not os.environ.get('PORT'):
        os.environ['PORT'] = '5000'
    
    if not os.environ.get('SECRET_KEY'):
        os.environ['SECRET_KEY'] = 'dev-secret-key-change-in-production'
    
    print(f"Port: {os.environ.get('PORT')}")
    print(f"Database URL: {'Set' if os.environ.get('DATABASE_URL') else 'Not set'}")
    
    try:
        # Import dan start aplikasi
        from src.main import app
        
        print("✓ Application imported successfully")
        
        # Test basic functionality
        with app.test_client() as client:
            response = client.get('/ping')
            if response.status_code == 200:
                print("✓ Health check endpoint working")
            else:
                print(f"⚠ Health check returned status: {response.status_code}")
        
        # Start aplikasi
        port = int(os.environ.get('PORT', 5000))
        print(f"Starting server on port {port}")
        
        app.run(host='0.0.0.0', port=port, debug=False)
        
    except Exception as e:
        print(f"✗ Error starting application: {e}")
        sys.exit(1)

if __name__ == '__main__':
    main() 