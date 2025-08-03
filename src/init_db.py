from flask import Flask
from .models.user import db
from .config import SQLALCHEMY_DATABASE_URI

def init_database():
    """Initialize the database with all tables"""
    app = Flask(__name__)
    app.config['SQLALCHEMY_DATABASE_URI'] = SQLALCHEMY_DATABASE_URI
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    db.init_app(app)
    
    with app.app_context():
        try:
            db.create_all()
            print("Database tables created successfully")
        except Exception as e:
            print(f"Error creating database tables: {e}")
            raise

if __name__ == '__main__':
    init_database() 