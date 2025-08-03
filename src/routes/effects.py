from flask import Blueprint, request, jsonify
from ..models.user import db, Effect, TikTokAccount
from .auth import token_required
from ..services.effect_house_service import effect_house_service
import os
import threading
import time
import random

effects_bp = Blueprint('effects', __name__)

@effects_bp.route('/effects', methods=['GET'])
@token_required
def get_effects(current_user):
    try:
        effects = Effect.query.filter_by(user_id=current_user.id).all()
        return jsonify({
            'effects': [effect.to_dict() for effect in effects]
        }), 200
    except Exception as e:
        return jsonify({'message': f'Error fetching effects: {str(e)}'}), 500

@effects_bp.route('/effects', methods=['POST'])
@token_required
def create_effect(current_user):
    try:
        data = request.get_json()
        
        if not data or not data.get('effect_name'):
            return jsonify({'message': 'Missing effect name'}), 400
        
        effect = Effect(
            user_id=current_user.id,
            effect_name=data['effect_name'],
            category=data.get('category', ''),
            tags=data.get('tags', ''),
            hint=data.get('hint', ''),
            effect_file_path=data.get('effect_file_path', ''),
            icon_path=data.get('icon_path', '')
        )
        
        db.session.add(effect)
        db.session.commit()
        
        return jsonify({
            'message': 'Effect created successfully',
            'effect': effect.to_dict()
        }), 201
    
    except Exception as e:
        return jsonify({'message': f'Error creating effect: {str(e)}'}), 500

@effects_bp.route('/effects/<int:effect_id>', methods=['PUT'])
@token_required
def update_effect(current_user, effect_id):
    try:
        effect = Effect.query.filter_by(id=effect_id, user_id=current_user.id).first()
        
        if not effect:
            return jsonify({'message': 'Effect not found'}), 404
        
        data = request.get_json()
        
        if data.get('effect_name'):
            effect.effect_name = data['effect_name']
        if data.get('category'):
            effect.category = data['category']
        if data.get('tags'):
            effect.tags = data['tags']
        if data.get('hint'):
            effect.hint = data['hint']
        if data.get('status'):
            effect.status = data['status']
        
        db.session.commit()
        
        return jsonify({
            'message': 'Effect updated successfully',
            'effect': effect.to_dict()
        }), 200
    
    except Exception as e:
        return jsonify({'message': f'Error updating effect: {str(e)}'}), 500

@effects_bp.route('/effects/<int:effect_id>', methods=['DELETE'])
@token_required
def delete_effect(current_user, effect_id):
    try:
        effect = Effect.query.filter_by(id=effect_id, user_id=current_user.id).first()
        
        if not effect:
            return jsonify({'message': 'Effect not found'}), 404
        
        db.session.delete(effect)
        db.session.commit()
        
        return jsonify({'message': 'Effect deleted successfully'}), 200
    
    except Exception as e:
        return jsonify({'message': f'Error deleting effect: {str(e)}'}), 500

def publish_effect_background(effect_id, account_ids):
    """Background task for publishing effect to multiple accounts"""
    try:
        success, result = effect_house_service.bulk_publish_effect(effect_id, account_ids)
        print(f"[Background Task] Effect {effect_id} publish result: {result}")
    except Exception as e:
        print(f"[Background Task] Error publishing effect {effect_id}: {str(e)}")

@effects_bp.route('/effects/<int:effect_id>/publish', methods=['POST'])
@token_required
def publish_effect(current_user, effect_id):
    try:
        effect = Effect.query.filter_by(id=effect_id, user_id=current_user.id).first()
        
        if not effect:
            return jsonify({'message': 'Effect not found'}), 404
        
        data = request.get_json()
        account_ids = data.get('account_ids', [])
        
        if not account_ids:
            return jsonify({'message': 'No accounts selected'}), 400
        
        # Verify all accounts belong to the user
        accounts = TikTokAccount.query.filter(
            TikTokAccount.id.in_(account_ids),
            TikTokAccount.user_id == current_user.id
        ).all()
        
        if len(accounts) != len(account_ids):
            return jsonify({'message': 'Some accounts not found or not owned by user'}), 400
        
        # Start publishing in background
        thread = threading.Thread(target=publish_effect_background, args=(effect_id, account_ids))
        thread.daemon = True
        thread.start()
        
        return jsonify({
            'message': 'Effect publishing started',
            'effect': effect.to_dict()
        }), 200
    
    except Exception as e:
        return jsonify({'message': f'Error publishing effect: {str(e)}'}), 500

@effects_bp.route('/effects/<int:effect_id>/status', methods=['GET'])
@token_required
def get_effect_status(current_user, effect_id):
    try:
        effect = Effect.query.filter_by(id=effect_id, user_id=current_user.id).first()
        
        if not effect:
            return jsonify({'message': 'Effect not found'}), 404
        
        # Check status using Effect House service
        status, message = effect_house_service.check_effect_status(effect_id)
        
        # Update effect status in database
        effect.status = status
        db.session.commit()
        
        return jsonify({
            'effect_id': effect_id,
            'status': status,
            'message': message,
            'effect': effect.to_dict()
        }), 200
    
    except Exception as e:
        return jsonify({'message': f'Error checking effect status: {str(e)}'}), 500

@effects_bp.route('/effects/<int:effect_id>/analytics', methods=['GET'])
@token_required
def get_effect_analytics(current_user, effect_id):
    try:
        effect = Effect.query.filter_by(id=effect_id, user_id=current_user.id).first()
        
        if not effect:
            return jsonify({'message': 'Effect not found'}), 404
        
        analytics = effect_house_service.get_effect_analytics(effect_id)
        
        if analytics:
            return jsonify({
                'effect_id': effect_id,
                'analytics': analytics
            }), 200
        else:
            return jsonify({'message': 'Analytics not available'}), 404
    
    except Exception as e:
        return jsonify({'message': f'Error fetching analytics: {str(e)}'}), 500

@effects_bp.route('/effects/<int:effect_id>/resubmit', methods=['POST'])
@token_required
def resubmit_effect(current_user, effect_id):
    try:
        effect = Effect.query.filter_by(id=effect_id, user_id=current_user.id).first()
        
        if not effect:
            return jsonify({'message': 'Effect not found'}), 404
        
        success, message = effect_house_service.auto_resubmit_rejected(effect_id)
        
        return jsonify({
            'success': success,
            'message': message,
            'effect': effect.to_dict()
        }), 200 if success else 400
    
    except Exception as e:
        return jsonify({'message': f'Error resubmitting effect: {str(e)}'}), 500

@effects_bp.route('/effect-house/earnings', methods=['GET'])
@token_required
def get_effect_house_earnings(current_user):
    try:
        date_range = request.args.get('date_range', '30d')
        
        earnings_report = effect_house_service.generate_earnings_report(current_user.id, date_range)
        
        if earnings_report:
            return jsonify(earnings_report), 200
        else:
            return jsonify({'message': 'Unable to generate earnings report'}), 500
    
    except Exception as e:
        return jsonify({'message': f'Error fetching earnings: {str(e)}'}), 500

@effects_bp.route('/effect-house/bulk-operations', methods=['POST'])
@token_required
def bulk_operations(current_user):
    try:
        data = request.get_json()
        operation = data.get('operation')
        effect_ids = data.get('effect_ids', [])
        
        if not operation or not effect_ids:
            return jsonify({'message': 'Missing operation or effect_ids'}), 400
        
        results = []
        
        if operation == 'bulk_publish':
            account_ids = data.get('account_ids', [])
            if not account_ids:
                return jsonify({'message': 'No accounts selected for bulk publish'}), 400
            
            for effect_id in effect_ids:
                effect = Effect.query.filter_by(id=effect_id, user_id=current_user.id).first()
                if effect:
                    # Start background publishing
                    thread = threading.Thread(target=publish_effect_background, args=(effect_id, account_ids))
                    thread.daemon = True
                    thread.start()
                    
                    results.append({
                        'effect_id': effect_id,
                        'status': 'publishing_started'
                    })
        
        elif operation == 'bulk_resubmit':
            for effect_id in effect_ids:
                effect = Effect.query.filter_by(id=effect_id, user_id=current_user.id).first()
                if effect:
                    success, message = effect_house_service.auto_resubmit_rejected(effect_id)
                    results.append({
                        'effect_id': effect_id,
                        'success': success,
                        'message': message
                    })
        
        return jsonify({
            'operation': operation,
            'results': results
        }), 200
    
    except Exception as e:
        return jsonify({'message': f'Error performing bulk operation: {str(e)}'}), 500

