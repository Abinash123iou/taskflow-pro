import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

// Ensure axios base URL and headers are configured
axios.defaults.baseURL = ''; // proxy takes care of this or set explicitly
const token = localStorage.getItem('token');
if (token) {
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Restore user from local storage token if present
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    if (storedToken && storedUser) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
      setUser(JSON.parse(storedUser));
      setToken(storedToken);
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    setError(null);
    setLoading(true);
    try {
      const response = await axios.post('/api/auth/login', { email, password });
      const { token: jwtToken, user: userProfile } = response.data.data;

      localStorage.setItem('token', jwtToken);
      localStorage.setItem('user', JSON.stringify(userProfile));
      axios.defaults.headers.common['Authorization'] = `Bearer ${jwtToken}`;

      setUser(userProfile);
      setToken(jwtToken);
      setLoading(false);
      return { success: true };
    } catch (err) {
      setLoading(false);
      const errMsg = err.response?.data?.message || 'Invalid email or password';
      setError(errMsg);
      return { success: false, message: errMsg };
    }
  };

  const register = async (username, email, password) => {
    setError(null);
    setLoading(true);
    try {
      await axios.post('/api/auth/register', { username, email, password });
      setLoading(false);
      return { success: true };
    } catch (err) {
      setLoading(false);
      const errMsg = err.response?.data?.message || 'Registration failed';
      setError(errMsg);
      return { success: false, message: errMsg };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, error, login, register, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
