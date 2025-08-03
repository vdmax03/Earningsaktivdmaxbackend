import requests
import json
import time
import random
from datetime import datetime
from ..models.user import db, Effect, TikTokAccount

class EffectHouseService:
    """
    Service untuk mengotomatisasi publikasi efek ke TikTok Effect House
    """
    
    def __init__(self):
        self.base_url = "https://effecthouse.tiktok.com"
        self.session = requests.Session()
    
    def login_with_cookies(self, cookies_data):
        """
        Login ke TikTok Effect House menggunakan cookies
        """
        try:
            if not cookies_data:
                return False, "Cookies data tidak tersedia"
            
            # Parse cookies data (assuming JSON format)
            if isinstance(cookies_data, str):
                cookies = json.loads(cookies_data)
            else:
                cookies = cookies_data
            
            # Set cookies to session
            for cookie in cookies:
                self.session.cookies.set(
                    cookie.get('name'),
                    cookie.get('value'),
                    domain=cookie.get('domain', '.tiktok.com')
                )
            
            # Test login by accessing profile or dashboard
            response = self.session.get(f"{self.base_url}/creator")
            
            if response.status_code == 200 and "login" not in response.url.lower():
                return True, "Login berhasil"
            else:
                return False, "Login gagal - cookies mungkin expired"
                
        except Exception as e:
            return False, f"Error saat login: {str(e)}"
    
    def upload_effect(self, effect_data, account_cookies):
        """
        Upload efek ke TikTok Effect House
        """
        try:
            # Login dengan cookies
            login_success, login_message = self.login_with_cookies(account_cookies)
            if not login_success:
                return False, login_message
            
            # Simulate effect upload process
            # In real implementation, this would:
            # 1. Upload effect file (.zip)
            # 2. Upload icon/thumbnail
            # 3. Fill form with metadata (name, category, tags, hint)
            # 4. Submit for review
            
            # Simulate upload steps
            steps = [
                "Mempersiapkan file efek...",
                "Mengupload file efek (.zip)...",
                "Mengupload icon efek...",
                "Mengisi metadata efek...",
                "Mengirim untuk review..."
            ]
            
            for step in steps:
                print(f"[Effect Upload] {step}")
                time.sleep(random.uniform(1, 3))  # Simulate processing time
            
            # Simulate success/failure (90% success rate)
            success = random.choice([True] * 9 + [False])
            
            if success:
                return True, "Efek berhasil diupload dan sedang dalam review"
            else:
                return False, "Upload gagal - silakan coba lagi"
                
        except Exception as e:
            return False, f"Error saat upload: {str(e)}"
    
    def check_effect_status(self, effect_id):
        """
        Cek status review efek
        """
        try:
            # Simulate status check
            statuses = ['pending', 'approved', 'rejected', 'needs_revision']
            weights = [0.4, 0.3, 0.2, 0.1]  # Probability weights
            
            status = random.choices(statuses, weights=weights)[0]
            
            status_messages = {
                'pending': 'Efek sedang dalam review',
                'approved': 'Efek telah disetujui dan dipublikasikan',
                'rejected': 'Efek ditolak - tidak memenuhi guidelines',
                'needs_revision': 'Efek perlu revisi sebelum dipublikasikan'
            }
            
            return status, status_messages[status]
            
        except Exception as e:
            return 'error', f"Error saat cek status: {str(e)}"
    
    def get_effect_analytics(self, effect_id):
        """
        Ambil data analytics efek (views, uses, earnings)
        """
        try:
            # Simulate analytics data
            views = random.randint(100, 50000)
            uses = random.randint(50, views // 2)
            earnings = uses * random.uniform(0.001, 0.01)  # $0.001-$0.01 per use
            
            return {
                'views': views,
                'uses': uses,
                'earnings': round(earnings, 2),
                'cpm': round((earnings / views * 1000) if views > 0 else 0, 4)
            }
            
        except Exception as e:
            return None
    
    def bulk_publish_effect(self, effect_id, account_ids):
        """
        Publikasi efek ke multiple akun sekaligus
        """
        results = []
        effect = Effect.query.get(effect_id)
        
        if not effect:
            return False, "Efek tidak ditemukan"
        
        # Update status to publishing
        effect.status = 'publishing'
        db.session.commit()
        
        success_count = 0
        total_accounts = len(account_ids)
        
        for account_id in account_ids:
            account = TikTokAccount.query.get(account_id)
            if not account:
                results.append({
                    'account_id': account_id,
                    'success': False,
                    'message': 'Akun tidak ditemukan'
                })
                continue
            
            # Attempt to upload to this account
            success, message = self.upload_effect({
                'name': effect.effect_name,
                'category': effect.category,
                'tags': effect.tags,
                'hint': effect.hint,
                'file_path': effect.effect_file_path,
                'icon_path': effect.icon_path
            }, account.cookies_data)
            
            results.append({
                'account_id': account_id,
                'account_username': account.account_username,
                'success': success,
                'message': message
            })
            
            if success:
                success_count += 1
                # Update account last_used
                account.last_used = datetime.utcnow()
            
            # Small delay between accounts
            time.sleep(random.uniform(2, 5))
        
        # Update effect status based on results
        if success_count == total_accounts:
            effect.status = 'published'
        elif success_count > 0:
            effect.status = 'partially_published'
        else:
            effect.status = 'failed'
        
        db.session.commit()
        
        return True, {
            'total_accounts': total_accounts,
            'successful_uploads': success_count,
            'failed_uploads': total_accounts - success_count,
            'success_rate': round((success_count / total_accounts) * 100, 2),
            'results': results
        }
    
    def auto_resubmit_rejected(self, effect_id):
        """
        Otomatis submit ulang efek yang ditolak dengan revisi
        """
        try:
            effect = Effect.query.get(effect_id)
            if not effect:
                return False, "Efek tidak ditemukan"
            
            # Check current status
            status, message = self.check_effect_status(effect_id)
            
            if status == 'rejected' or status == 'needs_revision':
                # Simulate auto-revision process
                print(f"[Auto Resubmit] Melakukan revisi otomatis untuk efek: {effect.effect_name}")
                
                # Simulate revision steps
                revision_steps = [
                    "Menganalisis alasan penolakan...",
                    "Melakukan perbaikan otomatis...",
                    "Mengoptimalkan metadata...",
                    "Mengirim ulang untuk review..."
                ]
                
                for step in revision_steps:
                    print(f"[Auto Resubmit] {step}")
                    time.sleep(random.uniform(1, 2))
                
                # Update effect status
                effect.status = 'pending'
                db.session.commit()
                
                return True, "Efek berhasil disubmit ulang setelah revisi"
            else:
                return False, f"Efek tidak perlu resubmit (status: {status})"
                
        except Exception as e:
            return False, f"Error saat auto resubmit: {str(e)}"
    
    def generate_earnings_report(self, user_id, date_range='30d'):
        """
        Generate laporan pendapatan dari semua efek user
        """
        try:
            effects = Effect.query.filter_by(user_id=user_id).all()
            
            total_earnings = 0
            effects_data = []
            
            for effect in effects:
                if effect.status == 'published':
                    analytics = self.get_effect_analytics(effect.id)
                    if analytics:
                        total_earnings += analytics['earnings']
                        effects_data.append({
                            'effect_id': effect.id,
                            'effect_name': effect.effect_name,
                            'category': effect.category,
                            'views': analytics['views'],
                            'uses': analytics['uses'],
                            'earnings': analytics['earnings'],
                            'cpm': analytics['cpm']
                        })
            
            return {
                'total_earnings': round(total_earnings, 2),
                'total_effects': len(effects),
                'published_effects': len([e for e in effects if e.status == 'published']),
                'average_earnings_per_effect': round(total_earnings / len(effects_data) if effects_data else 0, 2),
                'effects_data': effects_data,
                'date_range': date_range,
                'generated_at': datetime.utcnow().isoformat()
            }
            
        except Exception as e:
            return None

# Global service instance
effect_house_service = EffectHouseService()

