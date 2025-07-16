from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
from werkzeug.security import generate_password_hash, check_password_hash

db = SQLAlchemy()

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50), unique=True, nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    is_active = db.Column(db.Boolean, default=True)
    
    # Relationships
    tiktok_accounts = db.relationship('TikTokAccount', backref='user', lazy=True)
    effects = db.relationship('Effect', backref='user', lazy=True)
    campaigns = db.relationship('Campaign', backref='user', lazy=True)

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)
    
    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

    def __repr__(self):
        return f'<User {self.username}>'

    def to_dict(self):
        return {
            'id': self.id,
            'username': self.username,
            'email': self.email,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'is_active': self.is_active
        }

class TikTokAccount(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    account_username = db.Column(db.String(50), nullable=False)
    cookies_data = db.Column(db.Text)
    is_active = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    last_used = db.Column(db.DateTime)

    def to_dict(self):
        return {
            'id': self.id,
            'account_username': self.account_username,
            'is_active': self.is_active,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'last_used': self.last_used.isoformat() if self.last_used else None
        }

class Effect(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    effect_name = db.Column(db.String(100), nullable=False)
    effect_file_path = db.Column(db.String(255))
    icon_path = db.Column(db.String(255))
    category = db.Column(db.String(50))
    tags = db.Column(db.Text)
    hint = db.Column(db.String(100))
    status = db.Column(db.String(20), default='draft')
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'effect_name': self.effect_name,
            'category': self.category,
            'tags': self.tags,
            'hint': self.hint,
            'status': self.status,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }

class Campaign(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    campaign_name = db.Column(db.String(100), nullable=False)
    campaign_type = db.Column(db.String(50), nullable=False)  # 'web', 'youtube', 'soundon', 'adisterra', 'effect_house'
    target_urls = db.Column(db.Text)
    target_countries = db.Column(db.Text)
    device_types = db.Column(db.Text)
    traffic_sources = db.Column(db.Text)
    target_count = db.Column(db.Integer, default=0)
    current_count = db.Column(db.Integer, default=0)
    status = db.Column(db.String(20), default='inactive')
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relationships
    logs = db.relationship('CampaignLog', backref='campaign', lazy=True)

    def to_dict(self):
        return {
            'id': self.id,
            'campaign_name': self.campaign_name,
            'campaign_type': self.campaign_type,
            'target_count': self.target_count,
            'current_count': self.current_count,
            'status': self.status,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }

class CampaignLog(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    campaign_id = db.Column(db.Integer, db.ForeignKey('campaign.id'), nullable=False)
    action_type = db.Column(db.String(50), nullable=False)
    target_url = db.Column(db.String(255))
    device_type = db.Column(db.String(50))
    country = db.Column(db.String(10))
    success = db.Column(db.Boolean, default=False)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'action_type': self.action_type,
            'target_url': self.target_url,
            'device_type': self.device_type,
            'country': self.country,
            'success': self.success,
            'timestamp': self.timestamp.isoformat() if self.timestamp else None
        }

