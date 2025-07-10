import { createContext, useState, useEffect, useContext } from 'react';

// 1. Create the Context
const AuthContext = createContext(null);

// 2. Create the Provider Component
export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Define handleLogout first so it's available for the useEffect hook
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    setUser(null);
  };

  // Check localStorage when the component first loads
  useEffect(() => {
    try {
      const token = localStorage.getItem('token');
      const userDataString = localStorage.getItem('user');
      
      if (token && userDataString) {
        const userData = JSON.parse(userDataString);
        setUser(userData);
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error("Failed to parse user data from localStorage, logging out.", error);
      handleLogout();
    } finally {
      setLoading(false);
    }
  }, []);

  const handleLogin = (token, userData) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setIsAuthenticated(true);
    setUser(userData);
  };

  const value = {
    isAuthenticated,
    user,
    loading,
    handleLogin,
    handleLogout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// 3. Create a custom hook to easily use the context
export function useAuth() {
  return useContext(AuthContext);
}
