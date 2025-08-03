# Setup Frontend Earning Sakti

## 🔧 Fitur Baru di Komponen Login

### 1. **Quick Login Button**
- Tombol hijau untuk login cepat dengan user default (admin/admin123)
- Otomatis mengisi form dan submit

### 2. **Debug Information**
- Panel debug yang bisa di-expand
- Menampilkan info koneksi server, user list, dan response API
- Membantu troubleshooting masalah login

### 3. **Error Handling yang Lebih Baik**
- Error message yang lebih jelas
- Tips untuk mengatasi masalah login
- Saran untuk membuat user baru jika login gagal

### 4. **Connection Testing**
- Test koneksi server sebelum login
- Cek user yang ada di database
- Validasi response dari API

## 📋 Cara Menggunakan

### 1. **Setup API URL**
Edit file `config.js` dan ganti URL dengan Railway app Anda:
```javascript
export const API_URL = 'https://your-railway-app-url.railway.app';
```

### 2. **Import Komponen**
```javascript
import Login from './components/Login';
import { API_URL } from './config';
```

### 3. **Gunakan di App**
```javascript
const App = () => {
  const handleLogin = (token, user) => {
    // Handle successful login
    console.log('Login successful:', user);
    // Redirect atau update state
  };

  return (
    <div>
      <Login onLogin={handleLogin} />
    </div>
  );
};
```

## 🚀 Testing Login

### **Metode 1: Quick Login**
1. Klik tombol "🚀 Quick Login (admin/admin123)"
2. Otomatis akan login dengan user default

### **Metode 2: Manual Login**
1. Masukkan username: `admin`
2. Masukkan password: `admin123`
3. Klik "Masuk"

### **Metode 3: Register User Baru**
1. Klik tab "Register"
2. Isi form dengan data baru
3. Klik "Daftar"
4. Login dengan user baru

## 🔍 Troubleshooting

### **Jika mendapat "Invalid credentials":**

1. **Cek Debug Info**
   - Klik "🔧 Debug Info" untuk melihat detail
   - Pastikan server connected
   - Cek apakah user ada di database

2. **Test Koneksi**
   - Pastikan API_URL sudah benar
   - Cek apakah server Railway sudah running

3. **Buat User Baru**
   - Klik tab "Register"
   - Buat user baru dengan data yang mudah diingat
   - Login dengan user baru

### **Common Issues:**

1. **CORS Error**
   - Pastikan backend sudah mengizinkan CORS
   - Cek apakah domain frontend sudah di-whitelist

2. **Network Error**
   - Cek koneksi internet
   - Pastikan Railway app sudah deploy dengan benar

3. **API URL Salah**
   - Ganti API_URL di config.js
   - Pastikan URL Railway sudah benar

## 📱 Fitur UI/UX

### **Visual Improvements:**
- Gradient background yang menarik
- Glassmorphism effect pada card
- Loading spinner yang smooth
- Error display yang jelas
- Debug panel yang collapsible

### **User Experience:**
- Quick login untuk testing
- Auto-fill form untuk user default
- Clear error messages
- Helpful tips untuk troubleshooting
- Responsive design

## 🎯 Expected Behavior

### **Login Success:**
```javascript
// onLogin callback akan dipanggil dengan:
{
  token: "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
  user: {
    id: 1,
    username: "admin",
    email: "admin@example.com",
    created_at: "2024-01-01T00:00:00",
    is_active: true
  }
}
```

### **Login Failed:**
- Error message akan ditampilkan
- Debug info akan menunjukkan detail error
- Tips untuk mengatasi masalah

## 🔧 Environment Variables

Buat file `.env` di root frontend project:
```env
REACT_APP_API_URL=https://your-railway-app-url.railway.app
```

## 📝 Notes

- Komponen ini sudah dioptimasi untuk debugging
- Debug info hanya muncul saat ada request
- Quick login button hanya untuk testing
- Error handling sudah comprehensive
- UI sudah responsive dan modern 