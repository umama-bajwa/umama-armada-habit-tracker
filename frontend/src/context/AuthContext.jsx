import { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(true);

  // Helper to format API error messages gracefully
  const handleApiError = (error) => {
    if (!error.response) {
      return {
        message: 'Unable to connect to the server. Please make sure the backend is running.',
        errors: {},
      };
    }

    const status = error.response.status;
    const data = error.response.data || {};

    if (status === 401) {
      return {
        message: data.message || 'Invalid email or password.',
        errors: {},
      };
    }

    if (status === 422) {
      return {
        message: data.message || 'Please fix the highlighted fields below.',
        errors: data.errors || {},
      };
    }

    if (status >= 500) {
      return {
        message: 'Something went wrong on the server. Please try again later.',
        errors: {},
      };
    }

    return {
      message: data.message || 'An unexpected error occurred.',
      errors: data.errors || {},
    };
  };

  // Verify token and load current user profile on app load
  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('token');
      if (!storedToken) {
        setUser(null);
        setToken(null);
        setLoading(false);
        return;
      }

      try {
        const response = await api.get('/me');
        if (response.data && response.data.user) {
          setUser(response.data.user);
          localStorage.setItem('user', JSON.stringify(response.data.user));
        }
      } catch (err) {
        // If token is invalid or expired, clear local session
        console.warn('Auth check failed:', err?.response?.status || err.message);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (credentials) => {
    try {
      const response = await api.post('/login', credentials);
      const { token: newToken, user: userData } = response.data;

      localStorage.setItem('token', newToken);
      localStorage.setItem('user', JSON.stringify(userData));

      setToken(newToken);
      setUser(userData);

      return { success: true, user: userData, message: response.data.message };
    } catch (error) {
      return { success: false, ...handleApiError(error) };
    }
  };

  const register = async (userData) => {
    try {
      const response = await api.post('/register', userData);
      const { token: newToken, user: newUser } = response.data;

      localStorage.setItem('token', newToken);
      localStorage.setItem('user', JSON.stringify(newUser));

      setToken(newToken);
      setUser(newUser);

      return { success: true, user: newUser, message: response.data.message };
    } catch (error) {
      return { success: false, ...handleApiError(error) };
    }
  };

  const logout = async () => {
    try {
      if (token) {
        await api.post('/logout');
      }
    } catch (err) {
      // Even if backend logout fails, clear local credentials
      console.warn('Backend logout failed or token already invalid:', err.message);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setToken(null);
      setUser(null);
    }
  };

  const value = {
    user,
    token,
    loading,
    isAuthenticated: !!token && !!user,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
