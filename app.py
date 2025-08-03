#!/usr/bin/env python3
"""
Entry point untuk aplikasi Flask
"""

from src.main import app

if __name__ == '__main__':
    import os
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=False) 