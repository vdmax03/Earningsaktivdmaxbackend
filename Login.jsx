import { API_URL } from "../config";
import { useState } from 'react';
import { Eye, EyeOff, Zap } from 'lucide-react';

const Login = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [debugInfo, setDebugInfo] = useState('');
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError(''); // Clear error when user types
  };

  const testConnection = async () => {
    try {
      const response = await fetch(`${API_URL}/ping`);
      const data = await response.json();
      setDebugInfo(`✅ Server connected: ${JSON.stringify(data)}`);
      return true;
    } catch (error) {
      setDebugInfo(`❌ Server connection failed: ${error.message}`);
      return false;
    }
  };

  const checkUsers = async () => {
    try {
      const response = await fetch(`${API_URL}/api/users`);
      const data = await response.json();
      setDebugInfo(prev => prev + `\n👥 Users: ${JSON.stringify(data)}`);
    } catch (error) {
      setDebugInfo(prev => prev + `\n❌ Users check failed: ${error.message}`);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setDebugInfo('');

    try {
      // Test connection first
      const isConnected = await testConnection();
      if (!isConnected) {
        setError('Tidak dapat terhubung ke server. Cek koneksi internet Anda.');
        return;
      }

      // Check users for debugging
      await checkUsers();

      const endpoint = isLogin ? `${API_URL}/api/auth/login` : `${API_URL}/api/auth/register`;
      const payload = isLogin
        ? { username: formData.username, password: formData.password }
        : formData;

      console.log('Sending request to:', endpoint);
      console.log('Payload:', payload);

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      console.log('Response status:', response.status);
      console.log('Response data:', data);

      setDebugInfo(prev => prev + `\n📡 Response: ${JSON.stringify(data)}`);

      if (response.ok) {
        if (isLogin) {
          onLogin(data.token, data.user);
          alert(`Selamat datang, ${data.user.username}!`);
        } else {
          alert("Registrasi berhasil! Silakan login dengan akun baru Anda.");
          setIsLogin(true);
          setFormData({ username: '', email: '', password: '' });
        }
      } else {
        const errorMessage = data.message || "Terjadi kesalahan";
        setError(errorMessage);
        
        // If login failed, suggest creating a new user
        if (isLogin && response.status === 401) {
          setError(`${errorMessage}\n\n💡 Tips: Coba buat akun baru dengan tombol "Register"`);
        }
      }
    } catch (error) {
      console.error('Network error:', error);
      setError(`Error jaringan: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = async () => {
    // Quick login dengan user default
    setFormData({
      username: 'admin',
      email: '',
      password: 'admin123'
    });
    
    // Auto submit after a short delay
    setTimeout(() => {
      handleSubmit(new Event('submit'));
    }, 100);
  };

  return (
    <div style={{
      background: 'linear-gradient(to bottom right, #1e3a8a, #4f46e5, #3730a3)',
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1rem',
      fontFamily: 'sans-serif'
    }}>
      <div style={{ width: '100%', maxWidth: '28rem' }}>
        {/* Logo & Heading */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            gap: '0.5rem',
            marginBottom: '1rem'
          }}>
            <Zap style={{ color: '#FACC15', width: '3rem', height: '3rem' }} />
            <h1 style={{ fontSize: '2.25rem', fontWeight: '800', color: 'white' }}>
              Earning Sakti
            </h1>
          </div>
          <p style={{ color: 'rgba(255,255,255,0.7)' }}>
            Platform otomatisasi pendapatan digital
          </p>
        </div>

        {/* Quick Login Button */}
        <div style={{ marginBottom: '1rem', textAlign: 'center' }}>
          <button
            onClick={handleQuickLogin}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: 'rgba(34, 197, 94, 0.8)',
              color: 'white',
              border: 'none',
              borderRadius: '0.375rem',
              cursor: 'pointer',
              fontSize: '0.875rem'
            }}
          >
            🚀 Quick Login (admin/admin123)
          </button>
        </div>

        {/* Login/Register Card */}
        <div style={{ 
          backgroundColor: 'rgba(255,255,255,0.1)', 
          backdropFilter: 'blur(8px)',
          borderRadius: '1rem',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          border: '1px solid rgba(255,255,255,0.2)',
          overflow: 'hidden'
        }}>
          <div style={{ padding: '1.5rem' }}>
            <h2 style={{ color: 'white', textAlign: 'center', fontSize: '1.5rem', fontWeight: 'bold' }}>
              {isLogin ? 'Masuk ke Akun' : 'Buat Akun Baru'}
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.7)', textAlign: 'center', marginTop: '0.5rem' }}>
              {isLogin
                ? 'Masukkan kredensial Anda untuk mengakses dashboard'
                : 'Daftar untuk mulai menggunakan platform'
              }
            </p>
          </div>
          <div style={{ padding: '0 1.5rem 1.5rem' }}>
            {/* Tabs */}
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: '1fr 1fr',
              gap: '0.5rem',
              marginBottom: '1.5rem',
              background: 'rgba(255,255,255,0.1)',
              padding: '0.25rem',
              borderRadius: '0.5rem'
            }}>
              <button
                style={{ 
                  padding: '0.5rem', 
                  borderRadius: '0.25rem',
                  background: isLogin ? 'rgba(59, 130, 246, 0.8)' : 'transparent',
                  color: 'white',
                  border: 'none',
                  cursor: 'pointer'
                }}
                onClick={() => setIsLogin(true)}
              >
                Login
              </button>
              <button
                style={{ 
                  padding: '0.5rem', 
                  borderRadius: '0.25rem',
                  background: !isLogin ? 'rgba(59, 130, 246, 0.8)' : 'transparent',
                  color: 'white',
                  border: 'none',
                  cursor: 'pointer'
                }}
                onClick={() => setIsLogin(false)}
              >
                Register
              </button>
            </div>

            {/* Error Display */}
            {error && (
              <div style={{
                backgroundColor: 'rgba(239, 68, 68, 0.2)',
                border: '1px solid rgba(239, 68, 68, 0.5)',
                borderRadius: '0.375rem',
                padding: '0.75rem',
                marginBottom: '1rem',
                color: '#fecaca'
              }}>
                <strong>Error:</strong> {error}
              </div>
            )}

            {/* Debug Info */}
            {debugInfo && (
              <details style={{
                backgroundColor: 'rgba(0, 0, 0, 0.3)',
                borderRadius: '0.375rem',
                padding: '0.75rem',
                marginBottom: '1rem',
                color: '#d1d5db',
                fontSize: '0.75rem'
              }}>
                <summary style={{ cursor: 'pointer', fontWeight: 'bold' }}>
                  🔧 Debug Info
                </summary>
                <pre style={{ 
                  whiteSpace: 'pre-wrap', 
                  marginTop: '0.5rem',
                  fontSize: '0.7rem'
                }}>
                  {debugInfo}
                </pre>
              </details>
            )}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label htmlFor="username" style={{ color: 'white', fontWeight: '500' }}>Username</label>
                <input
                  id="username"
                  name="username"
                  type="text"
                  value={formData.username}
                  onChange={handleInputChange}
                  required
                  placeholder="Masukkan username"
                  style={{ 
                    padding: '0.5rem 0.75rem',
                    backgroundColor: 'rgba(255,255,255,0.1)',
                    border: '1px solid rgba(255,255,255,0.2)',
                    borderRadius: '0.375rem',
                    color: 'white',
                    width: '100%'
                  }}
                />
              </div>

              {!isLogin && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <label htmlFor="email" style={{ color: 'white', fontWeight: '500' }}>Email</label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    placeholder="Masukkan email"
                    style={{ 
                      padding: '0.5rem 0.75rem',
                      backgroundColor: 'rgba(255,255,255,0.1)',
                      border: '1px solid rgba(255,255,255,0.2)',
                      borderRadius: '0.375rem',
                      color: 'white',
                      width: '100%'
                    }}
                  />
                </div>
              )}

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label htmlFor="password" style={{ color: 'white', fontWeight: '500' }}>Password</label>
                <div style={{ position: 'relative' }}>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                    placeholder="Masukkan password"
                    style={{ 
                      padding: '0.5rem 0.75rem',
                      paddingRight: '2.5rem',
                      backgroundColor: 'rgba(255,255,255,0.1)',
                      border: '1px solid rgba(255,255,255,0.2)',
                      borderRadius: '0.375rem',
                      color: 'white',
                      width: '100%'
                    }}
                  />
                  <button
                    type="button"
                    style={{ 
                      position: 'absolute',
                      right: '0.5rem',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'none',
                      border: 'none',
                      color: 'white',
                      cursor: 'pointer'
                    }}
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                style={{ 
                  marginTop: '0.5rem',
                  padding: '0.75rem',
                  backgroundColor: 'rgb(37, 99, 235)',
                  color: 'white',
                  fontWeight: 'bold',
                  borderRadius: '0.375rem',
                  border: 'none',
                  cursor: 'pointer',
                  opacity: loading ? 0.7 : 1
                }}
                disabled={loading}
              >
                {loading ? (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ 
                      width: '1rem', 
                      height: '1rem', 
                      borderRadius: '50%',
                      border: '2px solid white',
                      borderTopColor: 'transparent',
                      marginRight: '0.5rem',
                      animation: 'spin 1s linear infinite'
                    }}></div>
                    {isLogin ? 'Masuk...' : 'Mendaftar...'}
                  </div>
                ) : (
                  isLogin ? 'Masuk' : 'Daftar'
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Footer */}
        <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.75rem' }}>
            © 2025 <span style={{ fontWeight: 'bold' }}>Earning Sakti</span>. Platform otomatisasi terpercaya.
          </p>
        </div>
      </div>

      {/* CSS for spinner animation */}
      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default Login; 