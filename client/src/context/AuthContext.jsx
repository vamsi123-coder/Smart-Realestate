import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('sre_token') || null);
  const [loading, setLoading] = useState(true);

  // Set axios default auth header
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
  }, [token]);

  // Fetch user profile when token changes
  useEffect(() => {
    const fetchProfile = async () => {
      if (!token) {
        setCurrentUser(null);
        setLoading(false);
        return;
      }
      try {
        const res = await axios.get(`${API}/users/profile`);
        setCurrentUser(res.data);
      } catch (err) {
        // Token invalid or expired
        logout();
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [token]);

  const saveAuth = (userData, authToken) => {
    localStorage.setItem('sre_token', authToken);
    setToken(authToken);
    setCurrentUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('sre_token');
    setToken(null);
    setCurrentUser(null);
    delete axios.defaults.headers.common['Authorization'];
  };

  // Email/Password Register
  const register = async (name, email, password) => {
    const res = await axios.post(`${API}/auth/register`, { name, email, password });
    saveAuth(res.data.user, res.data.token);
    return res.data;
  };

  // Email/Password Login
  const login = async (email, password) => {
    const res = await axios.post(`${API}/auth/login`, { email, password });
    saveAuth(res.data.user, res.data.token);
    return res.data;
  };

  // Google OAuth Login
  const googleLogin = async (firebaseIdToken) => {
    const res = await axios.post(`${API}/auth/google`, { idToken: firebaseIdToken });
    saveAuth(res.data.user, res.data.token);
    return res.data;
  };

  // Update profile locally after editing
  const updateCurrentUser = (updatedUser) => {
    setCurrentUser(updatedUser);
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        token,
        loading,
        register,
        login,
        googleLogin,
        logout,
        updateCurrentUser,
        isAuthenticated: !!currentUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
