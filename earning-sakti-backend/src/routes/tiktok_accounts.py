from flask import Blueprint, request, jsonify
from models.user import db, TikTokAccount
from routes.auth import token_required
from datetime import datetime
import json

tiktok_accounts_bp = Blueprint('tiktok_accounts', __name__)

@tiktok_accounts_bp.route('/accounts', methods=['GET'])
@token_required
def get_accounts(current_user):
    try:
        accounts = TikTokAccount.query.filter_by(user_id=current_user.id).all()
        return jsonify({
            'accounts': [account.to_dict() for account in accounts]
        }), 200
    except Exception as e:
        return jsonify({'message': f'Error fetching accounts: {str(e)}'}), 500

@tiktok_accounts_bp.route('/accounts', methods=['POST'])
@token_required
def add_account(current_user):
    try:
        data = request.get_json()
        
        if not data or not data.get('account_username'):
            return jsonify({'message': 'Missing account username'}), 400
        
        # Check if account already exists for this user
        existing_account = TikTokAccount.query.filter_by(
            user_id=current_user.id,
            account_username=data['account_username']
        ).first()
        
        if existing_account:
            return jsonify({'message': 'Account already exists'}), 400
        
        account = TikTokAccount(
            user_id=current_user.id,
            account_username=data['account_username'],
            cookies_data=data.get('cookies_data', '')
        )
        
        db.session.add(account)
        db.session.commit()
        
        return jsonify({
            'message': 'Account added successfully',
            'account': account.to_dict()
        }), 201
    
    except Exception as e:
        return jsonify({'message': f'Error adding account: {str(e)}'}), 500

@tiktok_accounts_bp.route('/accounts/<int:account_id>', methods=['PUT'])
@token_required
def update_account(current_user, account_id):
    try:
        account = TikTokAccount.query.filter_by(id=account_id, user_id=current_user.id).first()
        
        if not account:
            return jsonify({'message': 'Account not found'}), 404
        
        data = request.get_json()
        
        if data.get('account_username'):
            account.account_username = data['account_username']
        if data.get('cookies_data'):
            account.cookies_data = data['cookies_data']
        if 'is_active' in data:
            account.is_active = data['is_active']
        
        db.session.commit()
        
        return jsonify({
            'message': 'Account updated successfully',
            'account': account.to_dict()
        }), 200
    
    except Exception as e:
        return jsonify({'message': f'Error updating account: {str(e)}'}), 500

@tiktok_accounts_bp.route('/accounts/<int:account_id>', methods=['DELETE'])
@token_required
def delete_account(current_user, account_id):
    try:
        account = TikTokAccount.query.filter_by(id=account_id, user_id=current_user.id).first()
        
        if not account:
            return jsonify({'message': 'Account not found'}), 404
        
        db.session.delete(account)
        db.session.commit()
        
        return jsonify({'message': 'Account deleted successfully'}), 200
    
    except Exception as e:
        return jsonify({'message': f'Error deleting account: {str(e)}'}), 500

@tiktok_accounts_bp.route('/accounts/<int:account_id>/test', methods=['POST'])
@token_required
def test_account(current_user, account_id):
    try:
        account = TikTokAccount.query.filter_by(id=account_id, user_id=current_user.id).first()
        
        if not account:
            return jsonify({'message': 'Account not found'}), 404
        
        # Simulate account testing
        # In real implementation, this would test the cookies/login status
        import random
        success = random.choice([True, False])
        
        if success:
            account.last_used = datetime.utcnow()
            db.session.commit()
            return jsonify({
                'message': 'Account test successful',
                'status': 'active'
            }), 200
        else:
            return jsonify({
                'message': 'Account test failed',
                'status': 'inactive'
            }), 400
    
    except Exception as e:
        return jsonify({'message': f'Error testing account: {str(e)}'}), 500

