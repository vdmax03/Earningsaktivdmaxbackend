#!/usr/bin/env python3
"""
Script untuk membuat user default untuk testing
"""

import os
import sys
from src.main import app
from src.models.user import db, User

def create_default_user():
    """Membuat user default untuk testing"""
    with app.app_context():
        try:
            # Cek apakah user sudah ada
            existing_user = User.query.filter_by(username='admin').first()
            if existing_user:
                print("User 'admin' sudah ada!")
                print(f"Username: admin")
                print(f"Email: {existing_user.email}")
                return
            
            # Buat user baru
            user = User(
                username='admin',
                email='admin@example.com'
            )
            user.set_password('admin123')
            
            db.session.add(user)
            db.session.commit()
            
            print("✅ User default berhasil dibuat!")
            print("Username: admin")
            print("Password: admin123")
            print("Email: admin@example.com")
            
        except Exception as e:
            print(f"❌ Error membuat user: {e}")
            db.session.rollback()

if __name__ == '__main__':
    create_default_user() 