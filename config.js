// Konfigurasi API URL
// Ganti dengan URL Railway Anda
export const API_URL = process.env.REACT_APP_API_URL || 'https://your-railway-app-url.railway.app';

// Konfigurasi untuk development
export const DEV_API_URL = 'http://localhost:5000';

// Fungsi untuk mendapatkan API URL berdasarkan environment
export const getApiUrl = () => {
  if (process.env.NODE_ENV === 'development') {
    return DEV_API_URL;
  }
  return API_URL;
};

// Konfigurasi default untuk testing
export const DEFAULT_CREDENTIALS = {
  username: 'admin',
  password: 'admin123',
  email: 'admin@example.com'
}; 