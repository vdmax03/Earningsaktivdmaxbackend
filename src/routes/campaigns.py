from flask import Blueprint, request, jsonify
from ..models.user import db, Campaign, CampaignLog
from .auth import token_required
import json
import threading
import time
import random

campaigns_bp = Blueprint('campaigns', __name__)

@campaigns_bp.route('/campaigns', methods=['GET'])
@token_required
def get_campaigns(current_user):
    try:
        campaigns = Campaign.query.filter_by(user_id=current_user.id).all()
        return jsonify({
            'campaigns': [campaign.to_dict() for campaign in campaigns]
        }), 200
    except Exception as e:
        return jsonify({'message': f'Error fetching campaigns: {str(e)}'}), 500

@campaigns_bp.route('/campaigns', methods=['POST'])
@token_required
def create_campaign(current_user):
    try:
        data = request.get_json()
        
        if not data or not data.get('campaign_name') or not data.get('campaign_type'):
            return jsonify({'message': 'Missing required fields'}), 400
        
        campaign = Campaign(
            user_id=current_user.id,
            campaign_name=data['campaign_name'],
            campaign_type=data['campaign_type'],
            target_urls=json.dumps(data.get('target_urls', [])),
            target_countries=json.dumps(data.get('target_countries', [])),
            device_types=json.dumps(data.get('device_types', [])),
            traffic_sources=json.dumps(data.get('traffic_sources', [])),
            target_count=data.get('target_count', 0)
        )
        
        db.session.add(campaign)
        db.session.commit()
        
        return jsonify({
            'message': 'Campaign created successfully',
            'campaign': campaign.to_dict()
        }), 201
    
    except Exception as e:
        return jsonify({'message': f'Error creating campaign: {str(e)}'}), 500

@campaigns_bp.route('/campaigns/<int:campaign_id>', methods=['PUT'])
@token_required
def update_campaign(current_user, campaign_id):
    try:
        campaign = Campaign.query.filter_by(id=campaign_id, user_id=current_user.id).first()
        
        if not campaign:
            return jsonify({'message': 'Campaign not found'}), 404
        
        data = request.get_json()
        
        if data.get('campaign_name'):
            campaign.campaign_name = data['campaign_name']
        if data.get('target_urls'):
            campaign.target_urls = json.dumps(data['target_urls'])
        if data.get('target_countries'):
            campaign.target_countries = json.dumps(data['target_countries'])
        if data.get('device_types'):
            campaign.device_types = json.dumps(data['device_types'])
        if data.get('traffic_sources'):
            campaign.traffic_sources = json.dumps(data['traffic_sources'])
        if data.get('target_count'):
            campaign.target_count = data['target_count']
        
        db.session.commit()
        
        return jsonify({
            'message': 'Campaign updated successfully',
            'campaign': campaign.to_dict()
        }), 200
    
    except Exception as e:
        return jsonify({'message': f'Error updating campaign: {str(e)}'}), 500

@campaigns_bp.route('/campaigns/<int:campaign_id>', methods=['DELETE'])
@token_required
def delete_campaign(current_user, campaign_id):
    try:
        campaign = Campaign.query.filter_by(id=campaign_id, user_id=current_user.id).first()
        
        if not campaign:
            return jsonify({'message': 'Campaign not found'}), 404
        
        db.session.delete(campaign)
        db.session.commit()
        
        return jsonify({'message': 'Campaign deleted successfully'}), 200
    
    except Exception as e:
        return jsonify({'message': f'Error deleting campaign: {str(e)}'}), 500

def run_campaign_simulation(campaign_id):
    """Simulate campaign execution in background"""
    campaign = Campaign.query.get(campaign_id)
    if not campaign:
        return
    
    campaign.status = 'running'
    db.session.commit()
    
    target_urls = json.loads(campaign.target_urls) if campaign.target_urls else []
    target_countries = json.loads(campaign.target_countries) if campaign.target_countries else ['US']
    device_types = json.loads(campaign.device_types) if campaign.device_types else ['Desktop']
    
    while campaign.current_count < campaign.target_count and campaign.status == 'running':
        # Simulate action
        url = random.choice(target_urls) if target_urls else 'https://example.com'
        country = random.choice(target_countries)
        device = random.choice(device_types)
        success = random.choice([True, True, True, False])  # 75% success rate
        
        # Log action
        log = CampaignLog(
            campaign_id=campaign.id,
            action_type=campaign.campaign_type,
            target_url=url,
            device_type=device,
            country=country,
            success=success
        )
        db.session.add(log)
        
        if success:
            campaign.current_count += 1
        
        db.session.commit()
        
        # Simulate delay between actions
        time.sleep(random.uniform(1, 3))
        
        # Refresh campaign status
        db.session.refresh(campaign)
    
    campaign.status = 'completed' if campaign.current_count >= campaign.target_count else 'stopped'
    db.session.commit()

@campaigns_bp.route('/campaigns/<int:campaign_id>/start', methods=['POST'])
@token_required
def start_campaign(current_user, campaign_id):
    try:
        campaign = Campaign.query.filter_by(id=campaign_id, user_id=current_user.id).first()
        
        if not campaign:
            return jsonify({'message': 'Campaign not found'}), 404
        
        if campaign.status == 'running':
            return jsonify({'message': 'Campaign is already running'}), 400
        
        # Start campaign in background thread
        thread = threading.Thread(target=run_campaign_simulation, args=(campaign_id,))
        thread.daemon = True
        thread.start()
        
        return jsonify({'message': 'Campaign started successfully'}), 200
    
    except Exception as e:
        return jsonify({'message': f'Error starting campaign: {str(e)}'}), 500

@campaigns_bp.route('/campaigns/<int:campaign_id>/stop', methods=['POST'])
@token_required
def stop_campaign(current_user, campaign_id):
    try:
        campaign = Campaign.query.filter_by(id=campaign_id, user_id=current_user.id).first()
        
        if not campaign:
            return jsonify({'message': 'Campaign not found'}), 404
        
        campaign.status = 'stopped'
        db.session.commit()
        
        return jsonify({'message': 'Campaign stopped successfully'}), 200
    
    except Exception as e:
        return jsonify({'message': f'Error stopping campaign: {str(e)}'}), 500

@campaigns_bp.route('/campaigns/<int:campaign_id>/stats', methods=['GET'])
@token_required
def get_campaign_stats(current_user, campaign_id):
    try:
        campaign = Campaign.query.filter_by(id=campaign_id, user_id=current_user.id).first()
        
        if not campaign:
            return jsonify({'message': 'Campaign not found'}), 404
        
        logs = CampaignLog.query.filter_by(campaign_id=campaign_id).all()
        
        stats = {
            'total_actions': len(logs),
            'successful_actions': len([log for log in logs if log.success]),
            'failed_actions': len([log for log in logs if not log.success]),
            'success_rate': (len([log for log in logs if log.success]) / len(logs) * 100) if logs else 0,
            'recent_logs': [log.to_dict() for log in logs[-10:]]  # Last 10 logs
        }
        
        return jsonify({
            'campaign': campaign.to_dict(),
            'stats': stats
        }), 200
    
    except Exception as e:
        return jsonify({'message': f'Error fetching campaign stats: {str(e)}'}), 500

