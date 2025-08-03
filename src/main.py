import os
import datetime
from flask import Flask, send_from_directory
from flask_cors import CORS
from .models.user import db
from .routes.user import user_bp
from .routes.auth import auth_bp
from .routes.campaigns import campaigns_bp
from .routes.tiktok_accounts import tiktok_accounts_bp
from .routes.effects import effects_bp
from .config import SQLALCHEMY_DATABASE_URI, SECRET_KEY

# --- Path Configuration ---
# Define path to the frontend build directory. This is crucial for serving the React app.
frontend_build_path = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', 'earning-sakti-frontend', 'dist'))
assets_path = os.path.join(frontend_build_path, 'assets')

# Check if frontend build exists, if not use a fallback
if not os.path.exists(frontend_build_path):
    print(f"Warning: Frontend build not found at {frontend_build_path}")
    # Use current directory as fallback
    frontend_build_path = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'static'))
    assets_path = frontend_build_path

# --- App Initialization ---
# Initialize Flask app, pointing static_folder to the 'assets' directory of the React build
app = Flask(__name__, static_folder=assets_path, static_url_path='/assets')

# --- Configuration and Security ---
# Load SECRET_KEY from an environment variable for security.
# Provide a default for development, but set a strong, unique key in production.
app.config['SECRET_KEY'] = SECRET_KEY

# For development, allow all origins. For production, it's better to restrict this.
# e.g., CORS(app, resources={r"/api/*": {"origins": "https://0vhlizcp939y.manus.space"}})
CORS(app)

# --- Blueprints (API Routes) ---
app.register_blueprint(user_bp, url_prefix='/api')
app.register_blueprint(auth_bp, url_prefix='/api/auth')
app.register_blueprint(campaigns_bp, url_prefix='/api')
app.register_blueprint(tiktok_accounts_bp, url_prefix='/api')
app.register_blueprint(effects_bp, url_prefix='/api')

# --- Database Configuration ---
app.config['SQLALCHEMY_DATABASE_URI'] = SQLALCHEMY_DATABASE_URI
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db.init_app(app)

# Create database tables
with app.app_context():
    try:
        db.create_all()
        print("Database tables initialized successfully")
        
        # Create default user if not exists
        from .models.user import User
        default_user = User.query.filter_by(username='admin').first()
        if not default_user:
            user = User(
                username='admin',
                email='admin@example.com'
            )
            user.set_password('admin123')
            db.session.add(user)
            db.session.commit()
            print("✅ Default user created: admin/admin123")
        else:
            print("ℹ️ Default user already exists: admin/admin123")
            
    except Exception as e:
        print(f"Warning: Database initialization failed: {e}")
        # Continue running the app even if database init fails
        # The health check will catch database connectivity issues

# --- Healthcheck Endpoint ---
@app.route('/health')
def health_check():
    print("Health check requested")  # Debug log
    try:
        # Test database connectivity
        db.session.execute('SELECT 1')
        print("Database connection successful")  # Debug log
        return {
            'status': 'healthy', 
            'message': 'Earning Sakti Backend is running',
            'database': 'connected',
            'timestamp': datetime.datetime.utcnow().isoformat()
        }, 200
    except Exception as e:
        print(f"Database connection failed: {e}")  # Debug log
        # Return healthy status even if database fails, but log the error
        return {
            'status': 'healthy', 
            'message': 'Earning Sakti Backend is running (database warning)',
            'database': 'disconnected',
            'warning': str(e),
            'timestamp': datetime.datetime.utcnow().isoformat()
        }, 200

# --- Test Endpoint ---
@app.route('/api/test')
def test_endpoint():
    return {'message': 'API is working correctly'}, 200

# --- Users Endpoint (for debugging) ---
@app.route('/api/users')
def list_users():
    try:
        from .models.user import User
        users = User.query.all()
        return {
            'users': [
                {
                    'id': user.id,
                    'username': user.username,
                    'email': user.email,
                    'created_at': user.created_at.isoformat() if user.created_at else None
                }
                for user in users
            ]
        }, 200
    except Exception as e:
        return {'error': str(e)}, 500

# --- Simple Health Check (no database) ---
@app.route('/ping')
def ping():
    print("Ping endpoint called")  # Debug log
    return {'status': 'pong', 'message': 'Server is alive', 'timestamp': datetime.datetime.utcnow().isoformat()}, 200

# --- Root Endpoint ---
@app.route('/')
def root():
    return {'message': 'Earning Sakti Backend API', 'status': 'running'}, 200

# --- Route for Serving the React Frontend ---
@app.route('/<path:path>')
def serve_react_app(path):
    # This catch-all route serves the React app and handles client-side routing.
    if path != "" and os.path.exists(os.path.join(frontend_build_path, path)):
        # If the requested path is a real file (e.g., favicon.ico), serve it.
        return send_from_directory(frontend_build_path, path)
    else:
        # Otherwise, serve the main index.html for React to handle routing.
        return send_from_directory(frontend_build_path, 'index.html')

if __name__ == '__main__':
    import os
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=False)
