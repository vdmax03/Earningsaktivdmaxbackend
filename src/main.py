import os
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
    db.create_all()

# --- Route for Serving the React Frontend ---
@app.route('/', defaults={'path': ''})
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
