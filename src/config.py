import os
from pathlib import Path

# Base directory
BASE_DIR = Path(__file__).resolve().parent.parent

# Security
SECRET_KEY = os.environ.get('SECRET_KEY', 'dev-secret-key-change-in-production')
DEBUG = os.environ.get('DEBUG', 'False') == 'True'

# Database
DB_PATH = BASE_DIR / 'database'
DB_PATH.mkdir(exist_ok=True)

# Use PostgreSQL in production, SQLite in development
DATABASE_URL = os.environ.get('DATABASE_URL')
if DATABASE_URL and DATABASE_URL.startswith('postgres://'):
    # Heroku/Railway style postgres:// -> postgresql://
    DATABASE_URL = DATABASE_URL.replace('postgres://', 'postgresql://', 1)

if DATABASE_URL:
    SQLALCHEMY_DATABASE_URI = DATABASE_URL
else:
    SQLALCHEMY_DATABASE_URI = f"sqlite:///{DB_PATH / 'app.db'}"

SQLALCHEMY_TRACK_MODIFICATIONS = False

# Frontend build path
FRONTEND_BUILD_PATH = BASE_DIR / 'frontend-build'

# CORS
ALLOWED_ORIGINS = os.environ.get('ALLOWED_ORIGINS', '*').split(',')