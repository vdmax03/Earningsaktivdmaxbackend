#!/usr/bin/env python3
"""
Script untuk test login dan cek user
"""

import requests
import json

# Ganti dengan URL aplikasi Anda
BASE_URL = "https://your-railway-app-url.railway.app"  # Ganti dengan URL Railway Anda

def test_endpoints():
    """Test semua endpoint"""
    print("🔍 Testing endpoints...")
    
    # Test ping
    try:
        response = requests.get(f"{BASE_URL}/ping")
        print(f"✅ Ping: {response.status_code} - {response.json()}")
    except Exception as e:
        print(f"❌ Ping failed: {e}")
    
    # Test root
    try:
        response = requests.get(f"{BASE_URL}/")
        print(f"✅ Root: {response.status_code} - {response.json()}")
    except Exception as e:
        print(f"❌ Root failed: {e}")
    
    # Test users list
    try:
        response = requests.get(f"{BASE_URL}/api/users")
        print(f"✅ Users: {response.status_code} - {response.json()}")
    except Exception as e:
        print(f"❌ Users failed: {e}")

def test_login(username, password):
    """Test login dengan username dan password"""
    print(f"\n🔐 Testing login dengan {username}/{password}")
    
    try:
        response = requests.post(f"{BASE_URL}/api/auth/login", 
                               json={"username": username, "password": password},
                               headers={"Content-Type": "application/json"})
        
        print(f"Status: {response.status_code}")
        print(f"Response: {response.json()}")
        
        if response.status_code == 200:
            print("✅ Login berhasil!")
            token = response.json().get('token')
            if token:
                print(f"Token: {token[:50]}...")
        else:
            print("❌ Login gagal!")
            
    except Exception as e:
        print(f"❌ Error: {e}")

def create_user(username, password, email):
    """Buat user baru"""
    print(f"\n👤 Creating user {username}")
    
    try:
        response = requests.post(f"{BASE_URL}/api/auth/register", 
                               json={
                                   "username": username, 
                                   "password": password,
                                   "email": email
                               },
                               headers={"Content-Type": "application/json"})
        
        print(f"Status: {response.status_code}")
        print(f"Response: {response.json()}")
        
        if response.status_code == 201:
            print("✅ User berhasil dibuat!")
        else:
            print("❌ Gagal membuat user!")
            
    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == "__main__":
    print("🚀 Earning Sakti Backend - Login Test")
    print("=" * 50)
    
    # Test endpoints dulu
    test_endpoints()
    
    # Test login dengan user default
    test_login("admin", "admin123")
    
    # Test login dengan user yang salah
    test_login("wrong", "wrong")
    
    # Buat user baru untuk testing
    create_user("testuser", "test123", "test@example.com")
    
    # Test login dengan user baru
    test_login("testuser", "test123") 