#!/usr/bin/env python3
"""
Startup script for the Earning Sakti Backend application.
This script ensures proper initialization of the Flask app and database.
"""

import os
import sys
from src.main import app
from src.models.user import db

def main():
    """Main startup function"""
    try:
        # Test database connectivity
        with app.app_context():
            db.session.execute('SELECT 1')
            print("✓ Database connection successful")
    except Exception as e:
        print(f"✗ Database connection failed: {e}")
        print("Continuing with startup...")
    
    # Get port from environment or use default
    port = int(os.environ.get('PORT', 5000))
    
    print(f"Starting Earning Sakti Backend on port {port}")
    print("Health check available at: /health")
    
    # Start the application
    app.run(host='0.0.0.0', port=port, debug=False)

if __name__ == '__main__':
    main() 