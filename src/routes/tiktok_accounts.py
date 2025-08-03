from flask import Blueprint, request, jsonify
from ..models.user import db, TikTokAccount
from .auth import token_required
import json

tiktok_accounts_bp = Blueprint('tiktok_accounts', __name__)

@tiktok_accounts_bp.route('/tiktok-accounts', methods=['GET'])
@token_required
def get_tiktok_accounts(current_user):
    try:
        accounts = TikTokAccount.query.filter_by(user_id=current_user.id).all()
        return jsonify({
            'accounts': [account.to_dict() for account in accounts]
        }), 200
    except Exception as e:
        return jsonify({'message': f'Error fetching TikTok accounts: {str(e)}'}), 500

@tiktok_accounts_bp.route('/tiktok-accounts', methods=['POST'])
@token_required
def create_tiktok_account(current_user):
    try:
        data = request.get_json()
        
        if not data or not data.get('account_username'):
            return jsonify({'message': 'Missing account username'}), 400
        
        account = TikTokAccount(
            user_id=current_user.id,
            account_username=data['account_username'],
            cookies_data=json.dumps(data.get('cookies_data', []))
        )
        
        db.session.add(account)
        db.session.commit()
        
        return jsonify({
            'message': 'TikTok account created successfully',
            'account': account.to_dict()
        }), 201
    
    except Exception as e:
        return jsonify({'message': f'Error creating TikTok account: {str(e)}'}), 500

@tiktok_accounts_bp.route('/tiktok-accounts/<int:account_id>', methods=['PUT'])
@token_required
def update_tiktok_account(current_user, account_id):
    try:
        account = TikTokAccount.query.filter_by(id=account_id, user_id=current_user.id).first()
        
        if not account:
            return jsonify({'message': 'TikTok account not found'}), 404
        
        data = request.get_json()
        
        if data.get('account_username'):
            account.account_username = data['account_username']
        if data.get('cookies_data'):
            account.cookies_data = json.dumps(data['cookies_data'])
        if data.get('is_active') is not None:
            account.is_active = data['is_active']
        
        db.session.commit()
        
        return jsonify({
            'message': 'TikTok account updated successfully',
            'account': account.to_dict()
        }), 200
    
    except Exception as e:
        return jsonify({'message': f'Error updating TikTok account: {str(e)}'}), 500

@tiktok_accounts_bp.route('/tiktok-accounts/<int:account_id>', methods=['DELETE'])
@token_required
def delete_tiktok_account(current_user, account_id):
    try:
        account = TikTokAccount.query.filter_by(id=account_id, user_id=current_user.id).first()
        
        if not account:
            return jsonify({'message': 'TikTok account not found'}), 404
        
        db.session.delete(account)
        db.session.commit()
        
        return jsonify({'message': 'TikTok account deleted successfully'}), 200
    
    except Exception as e:
        return jsonify({'message': f'Error deleting TikTok account: {str(e)}'}), 500

@tiktok_accounts_bp.route('/tiktok-accounts/<int:account_id>/test-login', methods=['POST'])
@token_required
def test_tiktok_login(current_user, account_id):
    try:
        account = TikTokAccount.query.filter_by(id=account_id, user_id=current_user.id).first()
        
        if not account:
            return jsonify({'message': 'TikTok account not found'}), 404
        
        # Simulate login test
        if account.cookies_data:
            cookies = json.loads(account.cookies_data)
            if cookies:
                return jsonify({
                    'message': 'Login test successful',
                    'status': 'success'
                }), 200
            else:
                return jsonify({
                    'message': 'No cookies data available',
                    'status': 'failed'
                }), 400
        else:
            return jsonify({
                'message': 'No cookies data available',
                'status': 'failed'
            }), 400
    
    except Exception as e:
        return jsonify({'message': f'Error testing TikTok login: {str(e)}'}), 500

