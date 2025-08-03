# Panduan Login Earning Sakti Backend

## 🔑 User Default
Setelah aplikasi berhasil deploy, user default akan dibuat otomatis:

- **Username**: `admin`
- **Password**: `admin123`
- **Email**: `admin@example.com`

## 🚀 Cara Test Login

### 1. Menggunakan cURL
```bash
# Test login dengan user default
curl -X POST https://your-app-url.railway.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username": "admin", "password": "admin123"}'
```

### 2. Menggunakan Postman
- **Method**: POST
- **URL**: `https://your-app-url.railway.app/api/auth/login`
- **Headers**: `Content-Type: application/json`
- **Body** (raw JSON):
```json
{
  "username": "admin",
  "password": "admin123"
}
```

### 3. Menggunakan Python Script
```bash
# Install requests jika belum ada
pip install requests

# Jalankan script test
python test_login.py
```

## 🔍 Troubleshooting

### Jika mendapat "Invalid credentials":

1. **Cek apakah aplikasi sudah deploy dengan benar**:
   ```bash
   curl https://your-app-url.railway.app/ping
   ```

2. **Cek apakah user sudah dibuat**:
   ```bash
   curl https://your-app-url.railway.app/api/users
   ```

3. **Cek log Railway** untuk melihat apakah user default berhasil dibuat

4. **Buat user baru** jika user default tidak ada:
   ```bash
   curl -X POST https://your-app-url.railway.app/api/auth/register \
     -H "Content-Type: application/json" \
     -d '{"username": "testuser", "password": "test123", "email": "test@example.com"}'
   ```

### Common Issues:

1. **Database belum terinisialisasi**
   - Cek log Railway untuk error database
   - Pastikan DATABASE_URL sudah set dengan benar

2. **User belum dibuat**
   - Cek endpoint `/api/users` untuk melihat user yang ada
   - Buat user baru menggunakan endpoint register

3. **Password salah**
   - Pastikan menggunakan password yang benar
   - Coba buat user baru dengan password yang mudah diingat

## 📋 Endpoints yang Tersedia

### Authentication
- `POST /api/auth/register` - Register user baru
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get profile (butuh token)
- `POST /api/auth/logout` - Logout (butuh token)

### Testing
- `GET /ping` - Health check sederhana
- `GET /` - Root endpoint
- `GET /health` - Health check dengan database
- `GET /api/test` - Test API
- `GET /api/users` - List semua user (untuk debugging)

## 🔧 Cara Buat User Baru

### Via cURL:
```bash
curl -X POST https://your-app-url.railway.app/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "your_username",
    "password": "your_password",
    "email": "your_email@example.com"
  }'
```

### Via Python:
```python
import requests

response = requests.post(
    "https://your-app-url.railway.app/api/auth/register",
    json={
        "username": "your_username",
        "password": "your_password", 
        "email": "your_email@example.com"
    },
    headers={"Content-Type": "application/json"}
)

print(response.json())
```

## 🎯 Expected Response

### Login Success:
```json
{
  "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
  "user": {
    "id": 1,
    "username": "admin",
    "email": "admin@example.com",
    "created_at": "2024-01-01T00:00:00",
    "is_active": true
  }
}
```

### Login Failed:
```json
{
  "message": "Invalid credentials"
}
```

## 🚨 Jika Masih Bermasalah

1. **Cek Railway logs** untuk error spesifik
2. **Pastikan database terhubung** dengan cek endpoint `/health`
3. **Test lokal** dengan menjalankan `python create_user.py`
4. **Buat user baru** menggunakan endpoint register 