# Arsitektur Website Earning Sakti

## 1. Struktur Database

### Tabel Users
```sql
CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE
);
```

### Tabel TikTok Accounts
```sql
CREATE TABLE tiktok_accounts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    account_username VARCHAR(50) NOT NULL,
    cookies_data TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_used TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);
```

### Tabel Effects
```sql
CREATE TABLE effects (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    effect_name VARCHAR(100) NOT NULL,
    effect_file_path VARCHAR(255),
    icon_path VARCHAR(255),
    category VARCHAR(50),
    tags TEXT,
    hint VARCHAR(100),
    status VARCHAR(20) DEFAULT 'draft',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);
```

### Tabel Campaigns
```sql
CREATE TABLE campaigns (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    campaign_name VARCHAR(100) NOT NULL,
    campaign_type VARCHAR(50) NOT NULL, -- 'web', 'youtube', 'soundon', 'adisterra', 'effect_house'
    target_urls TEXT,
    target_countries TEXT,
    device_types TEXT,
    traffic_sources TEXT,
    target_count INTEGER DEFAULT 0,
    current_count INTEGER DEFAULT 0,
    status VARCHAR(20) DEFAULT 'inactive',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);
```

### Tabel Campaign Logs
```sql
CREATE TABLE campaign_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    campaign_id INTEGER NOT NULL,
    action_type VARCHAR(50) NOT NULL,
    target_url VARCHAR(255),
    device_type VARCHAR(50),
    country VARCHAR(10),
    success BOOLEAN DEFAULT FALSE,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (campaign_id) REFERENCES campaigns(id)
);
```

## 2. API Endpoints

### Authentication
- `POST /api/auth/register` - Registrasi pengguna baru
- `POST /api/auth/login` - Login pengguna
- `POST /api/auth/logout` - Logout pengguna
- `GET /api/auth/profile` - Mendapatkan profil pengguna

### TikTok Accounts Management
- `GET /api/accounts` - Mendapatkan daftar akun TikTok
- `POST /api/accounts` - Menambah akun TikTok baru
- `PUT /api/accounts/{id}` - Update akun TikTok
- `DELETE /api/accounts/{id}` - Hapus akun TikTok
- `POST /api/accounts/{id}/test` - Test koneksi akun

### Effects Management
- `GET /api/effects` - Mendapatkan daftar efek
- `POST /api/effects` - Upload efek baru
- `PUT /api/effects/{id}` - Update efek
- `DELETE /api/effects/{id}` - Hapus efek
- `POST /api/effects/{id}/publish` - Publish efek ke TikTok

### Campaigns Management
- `GET /api/campaigns` - Mendapatkan daftar kampanye
- `POST /api/campaigns` - Membuat kampanye baru
- `PUT /api/campaigns/{id}` - Update kampanye
- `DELETE /api/campaigns/{id}` - Hapus kampanye
- `POST /api/campaigns/{id}/start` - Mulai kampanye
- `POST /api/campaigns/{id}/stop` - Stop kampanye
- `GET /api/campaigns/{id}/stats` - Statistik kampanye

### Effect House Specific
- `POST /api/effect-house/create` - Membuat efek baru di Effect House
- `POST /api/effect-house/upload` - Upload efek ke Effect House
- `POST /api/effect-house/publish` - Publish efek ke multiple akun
- `GET /api/effect-house/earnings` - Mendapatkan data pendapatan dari efek

## 3. Struktur Frontend

### Halaman Utama
- Dashboard dengan statistik kampanye
- Quick actions untuk memulai kampanye baru
- Grafik pendapatan real-time

### Halaman Kampanye
- Daftar semua kampanye dengan status
- Form untuk membuat kampanye baru
- Detail kampanye dengan statistik

### Halaman Akun TikTok
- Manajemen multiple akun TikTok
- Import cookies dari browser
- Test koneksi akun

### Halaman Effect House
- Upload dan manajemen efek
- Preview efek
- Publikasi ke multiple akun
- Tracking pendapatan efek

### Halaman Pengaturan
- Konfigurasi proxy
- Pengaturan device simulation
- Target negara dan traffic sources

## 4. Logika Fitur "Up Pendapatan Effect House"

### Workflow:
1. **Upload Efek**: User upload file efek (.zip) dan icon
2. **Konfigurasi**: Set kategori, tags, hint, dan target akun
3. **Publikasi Otomatis**: 
   - Login ke multiple akun TikTok menggunakan cookies
   - Submit efek ke Effect House untuk setiap akun
   - Monitor status review
4. **Optimasi Pendapatan**:
   - Rotasi publikasi efek ke akun berbeda
   - Tracking usage dan earnings per efek
   - Auto-resubmit jika ditolak dengan revisi

### Komponen Teknis:
- **Browser Automation**: Selenium untuk simulasi interaksi
- **Cookie Management**: Sistem untuk menyimpan dan menggunakan cookies login
- **Queue System**: Antrian untuk mengelola publikasi ke multiple akun
- **Monitoring**: Real-time tracking status efek dan earnings

## 5. Fitur Keamanan

### Rate Limiting
- Batasi jumlah request per menit per user
- Delay antar publikasi untuk menghindari deteksi bot

### Proxy Support
- Rotasi IP untuk setiap akun
- Support untuk proxy HTTP/SOCKS

### Error Handling
- Retry mechanism untuk failed requests
- Logging semua aktivitas untuk debugging

## 6. Teknologi Stack

### Backend
- **Framework**: Flask (Python)
- **Database**: SQLite (development), PostgreSQL (production)
- **Authentication**: JWT tokens
- **Task Queue**: Celery dengan Redis
- **Browser Automation**: Selenium WebDriver

### Frontend
- **Framework**: React.js
- **UI Library**: Material-UI atau Tailwind CSS
- **State Management**: Redux atau Context API
- **Charts**: Chart.js atau Recharts

### DevOps
- **Containerization**: Docker
- **Deployment**: Heroku atau DigitalOcean
- **Monitoring**: Sentry untuk error tracking

