# Troubleshooting Health Check

## Masalah yang Ditemui
Health check masih menggunakan endpoint `/api/auth/login` yang lama, bukan `/ping` yang baru.

## Solusi yang Diterapkan

### 1. Endpoint Health Check Baru
- **`/ping`**: Endpoint sederhana tanpa database
- **`/health`**: Endpoint dengan tes database
- **`/api/test`**: Endpoint test API

### 2. Konfigurasi Railway
```json
{
  "healthcheckPath": "/ping",
  "startCommand": "gunicorn --workers 1 --bind 0.0.0.0:$PORT --timeout 120 --keep-alive 5 app:app"
}
```

### 3. File Entry Point
- Dibuat `app.py` di root untuk memudahkan import
- Update Procfile untuk menggunakan `app:app`

## Langkah Deployment

1. **Commit dan push perubahan**:
   ```bash
   git add .
   git commit -m "Fix health check endpoints"
   git push
   ```

2. **Redeploy di Railway**:
   - Buka Railway dashboard
   - Trigger manual deployment
   - Monitor logs untuk error

3. **Test endpoints**:
   ```bash
   curl https://your-app-url/ping
   curl https://your-app-url/health
   curl https://your-app-url/api/test
   ```

## Debugging

### Cek Log Railway
1. Buka Railway dashboard
2. Pilih service Anda
3. Klik tab "Logs"
4. Cari error messages

### Test Lokal
```bash
# Install dependencies
pip install -r requirements.txt

# Test aplikasi
python app.py

# Test endpoints
curl http://localhost:5000/ping
curl http://localhost:5000/health
```

### Environment Variables
Pastikan environment variables sudah set:
- `PORT`: Port number
- `DATABASE_URL`: Database connection string
- `SECRET_KEY`: Secret key untuk JWT

## Common Issues

### 1. Import Error
**Error**: `ModuleNotFoundError: No module named 'src'`
**Solution**: Pastikan struktur folder benar dan `app.py` ada di root

### 2. Database Connection
**Error**: Database connection failed
**Solution**: Cek `DATABASE_URL` environment variable

### 3. Port Issues
**Error**: Port already in use
**Solution**: Pastikan `PORT` environment variable set dengan benar

## Monitoring

Setelah deploy, monitor:
1. **Health check status** di Railway dashboard
2. **Application logs** untuk error messages
3. **Endpoint responses** menggunakan curl

Jika masih gagal, cek log untuk error spesifik dan sesuaikan konfigurasi. 