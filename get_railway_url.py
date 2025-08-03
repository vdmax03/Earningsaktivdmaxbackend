#!/usr/bin/env python3
"""
Script untuk mendapatkan URL Railway yang benar
"""

import os
import requests
import json

def get_railway_url():
    """Mendapatkan URL Railway dari environment atau manual input"""
    
    # Cek environment variable
    railway_url = os.environ.get('RAILWAY_URL')
    if railway_url:
        print(f"✅ Railway URL dari environment: {railway_url}")
        return railway_url
    
    # Cek file .env jika ada
    try:
        with open('.env', 'r') as f:
            for line in f:
                if line.startswith('RAILWAY_URL='):
                    railway_url = line.split('=')[1].strip()
                    print(f"✅ Railway URL dari .env: {railway_url}")
                    return railway_url
    except FileNotFoundError:
        pass
    
    # Manual input
    print("❌ Railway URL tidak ditemukan di environment atau .env")
    print("Silakan masukkan URL Railway Anda:")
    print("Contoh: https://your-app-name.railway.app")
    
    railway_url = input("Railway URL: ").strip()
    
    if not railway_url.startswith('https://'):
        railway_url = f"https://{railway_url}"
    
    print(f"✅ Railway URL: {railway_url}")
    return railway_url

def test_railway_url(url):
    """Test apakah URL Railway bisa diakses"""
    try:
        print(f"🔍 Testing URL: {url}")
        
        # Test ping endpoint
        response = requests.get(f"{url}/ping", timeout=10)
        if response.status_code == 200:
            print(f"✅ Ping endpoint berhasil: {response.json()}")
            return True
        else:
            print(f"❌ Ping endpoint gagal: {response.status_code}")
            return False
            
    except requests.exceptions.RequestException as e:
        print(f"❌ Error testing URL: {e}")
        return False

def update_config_file(url):
    """Update file config.js dengan URL yang benar"""
    config_content = f"""// Konfigurasi API URL
// Railway app URL
export const API_URL = '{url}';

// Konfigurasi untuk development
export const DEV_API_URL = 'http://localhost:5000';

// Fungsi untuk mendapatkan API URL berdasarkan environment
export const getApiUrl = () => {{
  if (process.env.NODE_ENV === 'development') {{
    return DEV_API_URL;
  }}
  return API_URL;
}};

// Konfigurasi default untuk testing
export const DEFAULT_CREDENTIALS = {{
  username: 'admin',
  password: 'admin123',
  email: 'admin@example.com'
}};
"""
    
    try:
        with open('config.js', 'w') as f:
            f.write(config_content)
        print("✅ File config.js berhasil diupdate")
        return True
    except Exception as e:
        print(f"❌ Error updating config.js: {e}")
        return False

def main():
    print("🚀 Railway URL Setup")
    print("=" * 50)
    
    # Get Railway URL
    railway_url = get_railway_url()
    
    # Test URL
    if test_railway_url(railway_url):
        print("✅ URL Railway valid dan bisa diakses")
        
        # Update config file
        if update_config_file(railway_url):
            print("✅ Setup selesai!")
            print(f"📝 URL yang digunakan: {railway_url}")
            print("🔧 Silakan restart aplikasi frontend Anda")
        else:
            print("❌ Gagal update config file")
    else:
        print("❌ URL Railway tidak valid atau tidak bisa diakses")
        print("💡 Pastikan:")
        print("   - Railway app sudah deploy")
        print("   - URL sudah benar")
        print("   - Health check endpoint /ping tersedia")

if __name__ == '__main__':
    main() 