import { API_URL } from "../config";
import { useState } from 'react';
import { Eye, EyeOff, Zap } from 'lucide-react';

const Login = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
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
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const endpoint = isLogin ? `${API_URL}/api/auth/login` : `${API_URL}/api/auth/register`;
      const payload = isLogin
        ? { username: formData.username, password: formData.password }
        : formData;

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok) {
        if (isLogin) {
          onLogin(data.token, data.user);
          alert(`Selamat datang, ${data.user.username}!`);
        } else {
          alert("Registrasi berhasil");
          setIsLogin(true);
          setFormData({ username: '', email: '', password: '' });
        }
      } else {
        alert(data.message || "Terjadi kesalahan");
      }
    } catch (error) {
      alert("Tidak dapat terhubung ke server");
    } finally {
      setLoading(false);
    }
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
                  cursor: 'pointer'
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
    </div>
  );
};

export default Login;