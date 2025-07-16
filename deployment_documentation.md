# Earning Sakti - Dokumentasi Deployment dan Penggunaan

## 🚀 URL Deployment

### Frontend (Website Utama)
**URL**: https://0vhlizcp939y.manus.space

### Backend (API Server)
**URL**: https://mzhyi8cqzng8.manus.space

## 📋 Ringkasan Proyek

Earning Sakti adalah platform otomatisasi pendapatan digital yang mengintegrasikan semua fungsionalitas dari aplikasi desktop "earning sakti.exe" ke dalam bentuk website modern. Platform ini dilengkapi dengan fitur baru "Up Pendapatan Effect House" untuk otomatisasi publikasi efek TikTok.

## ✨ Fitur Utama

### 1. Sistem Autentikasi
- Registrasi dan login pengguna
- Manajemen session dengan JWT token
- Keamanan password dengan hashing

### 2. Dashboard Utama
- Overview statistik kampanye, akun, dan pendapatan
- Grafik pendapatan bulanan
- Monitoring real-time

### 3. Manajemen Kampanye
- **Up Pendapatan Web**: Otomatisasi traffic website
- **Up Pendapatan YouTube**: Boost views dan engagement
- **Up Pendapatan SoundOn**: Streaming musik otomatis
- **Up Pendapatan Adisterra**: Optimasi iklan
- **Up Pendapatan Effect House**: Publikasi efek TikTok (FITUR BARU)

### 4. Manajemen Akun TikTok
- Tambah/edit/hapus akun TikTok
- Sistem cookies untuk autentikasi
- Test koneksi akun
- Support multiple akun (hingga 1000+ akun)

### 5. Effect House (FITUR BARU)
- Upload dan manajemen efek TikTok
- Publikasi otomatis ke multiple akun
- Monitoring pendapatan real-time
- Auto re-submit efek yang ditolak
- Analytics lengkap (views, uses, earnings)

## 🔧 Cara Penggunaan

### Langkah 1: Registrasi/Login
1. Buka https://gjvtoqht.manus.space
2. Klik tab "Register" untuk membuat akun baru
3. Isi username, email, dan password
4. Setelah registrasi berhasil, login dengan kredensial Anda

### Langkah 2: Menambah Akun TikTok
1. Klik menu "Akun TikTok" di sidebar
2. Klik "Tambah Akun"
3. Masukkan username TikTok
4. Copy-paste cookies dari browser (cara mendapatkan cookies dijelaskan di halaman)
5. Test koneksi untuk memastikan akun valid

### Langkah 3: Upload Efek TikTok (Effect House)
1. Klik menu "Effect House" di sidebar
2. Klik "Upload Efek Baru"
3. Upload file efek (.zip) dan icon efek
4. Isi metadata: nama efek, kategori, tags, hint
5. Pilih akun TikTok untuk publikasi
6. Klik "Publish" untuk memulai otomatisasi

### Langkah 4: Membuat Kampanye
1. Klik menu "Kampanye" di sidebar
2. Klik "Buat Kampanye"
3. Pilih jenis kampanye (Web, YouTube, SoundOn, Adisterra, Effect House)
4. Atur target dan parameter kampanye
5. Start kampanye untuk memulai otomatisasi

## 🎯 Logika "Up Pendapatan Effect House"

### Workflow Otomatisasi:
1. **Upload Efek**: User upload file efek dan metadata
2. **Login Otomatis**: Sistem login ke TikTok menggunakan cookies yang disimpan
3. **Submit ke Effect House**: Otomatis submit efek ke TikTok Effect House
4. **Multi-Account Publishing**: Publikasi ke semua akun yang dipilih secara bersamaan
5. **Status Monitoring**: Monitor status review (pending, approved, rejected)
6. **Auto Re-submission**: Jika ditolak, otomatis revisi dan submit ulang
7. **Earnings Tracking**: Monitor pendapatan real-time dari setiap efek

### Keunggulan Sistem:
- **Bulk Publishing**: Satu efek bisa dipublish ke 50+ akun sekaligus
- **Background Processing**: Proses berjalan di background tanpa mengganggu user
- **Smart Retry**: Otomatis retry jika ada error atau penolakan
- **Real-time Analytics**: Dashboard earnings dengan data lengkap
- **Cookie Management**: Sistem cookies yang aman dan persistent

## 🛠 Teknologi yang Digunakan

### Frontend
- **React**: Framework JavaScript modern
- **Vite**: Build tool yang cepat
- **React Router**: Routing untuk SPA
- **Custom UI Components**: Komponen UI yang responsive

### Backend
- **Flask**: Framework Python untuk API
- **SQLite**: Database untuk development
- **JWT**: Authentication token
- **SQLAlchemy**: ORM untuk database

### Deployment
- **Manus Cloud**: Platform deployment yang reliable
- **Production URLs**: HTTPS dengan SSL certificate
- **Auto-scaling**: Mendukung traffic tinggi

## 📊 Monitoring dan Analytics

### Dashboard Metrics:
- Total kampanye aktif
- Jumlah akun TikTok terhubung
- Total efek yang dipublish
- Pendapatan real-time
- Success rate publikasi

### Effect House Analytics:
- Views per efek
- Usage count
- Earnings per efek
- CPM (Cost Per Mille)
- Trend pendapatan bulanan

## 🔒 Keamanan

### Data Protection:
- Password hashing dengan Werkzeug
- JWT token dengan expiration
- Secure cookie storage
- Input validation dan sanitization

### TikTok Integration:
- Cookies disimpan dengan enkripsi
- Rate limiting untuk mencegah spam
- Error handling yang aman
- Session management yang proper

## 📈 Skalabilitas

### Current Capacity:
- Support hingga 1000+ akun TikTok per user
- Bulk processing untuk multiple efek
- Background jobs untuk operasi berat
- Database yang optimized

### Future Scaling:
- Horizontal scaling dengan load balancer
- Database migration ke PostgreSQL
- Redis untuk caching
- Microservices architecture

## 🆘 Troubleshooting

### Masalah Umum:

**1. Login Gagal**
- Pastikan username dan password benar
- Clear browser cache dan cookies
- Coba refresh halaman

**2. Akun TikTok Tidak Terhubung**
- Pastikan cookies masih valid
- Login ulang ke TikTok di browser
- Copy cookies yang baru

**3. Efek Gagal Upload**
- Pastikan file efek dalam format .zip
- Check ukuran file (max 50MB)
- Pastikan metadata lengkap

**4. Kampanye Tidak Berjalan**
- Check status akun TikTok
- Pastikan target kampanye valid
- Monitor log error di dashboard

## 📞 Support

Untuk bantuan teknis atau pertanyaan lebih lanjut, silakan hubungi tim development melalui platform yang tersedia.

---

**© 2025 Earning Sakti. Platform otomatisasi terpercaya.**

