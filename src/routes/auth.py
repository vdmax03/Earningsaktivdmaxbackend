from flask import Blueprint, request, jsonify, session
from ..models.user import db, User
import jwt
import datetime
from functools import wraps
from ..config import SECRET_KEY

auth_bp = Blueprint('auth', __name__)

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.headers.get('Authorization')
        if not token:
            return jsonify({'message': 'Token is missing!'}), 401
        
        try:
            if token.startswith('Bearer '):
                token = token[7:]
            data = jwt.decode(token, SECRET_KEY, algorithms=['HS256'])
            current_user = User.query.filter_by(id=data['user_id']).first()
            if not current_user:
                return jsonify({'message': 'Token is invalid!'}), 401
        except:
            return jsonify({'message': 'Token is invalid!'}), 401
        
        return f(current_user, *args, **kwargs)
    return decorated

@auth_bp.route('/register', methods=['POST'])
def register():
    try:
        data = request.get_json()
        
        if not data or not data.get('username') or not data.get('email') or not data.get('password'):
            return jsonify({'message': 'Missing required fields'}), 400
        
        # Check if user already exists
        if User.query.filter_by(username=data['username']).first():
            return jsonify({'message': 'Username already exists'}), 400
        
        if User.query.filter_by(email=data['email']).first():
            return jsonify({'message': 'Email already exists'}), 400
        
        # Create new user
        user = User(
            username=data['username'],
            email=data['email']
        )
        user.set_password(data['password'])
        
        db.session.add(user)
        db.session.commit()
        
        return jsonify({'message': 'User created successfully'}), 201
    
    except Exception as e:
        return jsonify({'message': f'Error creating user: {str(e)}'}), 500

@auth_bp.route('/login', methods=['POST'])
def login():
    try:
        data = request.get_json()
        
        if not data or not data.get('username') or not data.get('password'):
            return jsonify({'message': 'Missing username or password'}), 400
        
        # Test database connectivity first
        try:
            db.session.execute(db.text('SELECT 1'))
        except Exception as db_error:
            return jsonify({'message': 'Database connection error'}), 503
        
        user = User.query.filter_by(username=data['username']).first()
        
        if user and user.check_password(data['password']):
            token = jwt.encode({
                'user_id': user.id,
                'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=24)
            }, SECRET_KEY, algorithm='HS256')
            
            return jsonify({
                'token': token,
                'user': user.to_dict()
            }), 200
        
        return jsonify({'message': 'Invalid credentials'}), 401
    
    except Exception as e:
        return jsonify({'message': f'Error during login: {str(e)}'}), 500

@auth_bp.route('/profile', methods=['GET'])
@token_required
def get_profile(current_user):
    return jsonify({'user': current_user.to_dict()}), 200

@auth_bp.route('/logout', methods=['POST'])
@token_required
def logout(current_user):
    return jsonify({'message': 'Logged out successfully'}), 200

