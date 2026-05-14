// frontend/src/context/AuthContext.jsx
import React, { createContext, useState, useEffect, useContext } from 'react';
import { authAPI } from '../services/auth';

// Export the context separately for Fast Refresh compatibility
export const AuthContext = createContext();

// Export the provider as a named export
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  // Add this state
const [sessionTimeout, setSessionTimeout] = useState(null);

  useEffect(() => {
    // Check if user is already logged in
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    
    if (token && storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        setUser(userData);
        // console.log('Restored user session:', userData);
      } catch (error) {
        console.error('Error restoring user:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);


  // Add this for session timeout
useEffect(() => {
  let timeoutId;
  
  const resetTimeout = () => {
    if (timeoutId) clearTimeout(timeoutId);
    if (user) {
      timeoutId = setTimeout(() => {
        toast.warning('Session expired due to inactivity. Please login again.');
        logout();
      }, 30 * 60 * 1000); // 30 minutes
    }
  };
  
  const events = ['mousemove', 'keypress', 'click'];
  events.forEach(event => window.addEventListener(event, resetTimeout));
  resetTimeout();
  
  return () => {
    clearTimeout(timeoutId);
    events.forEach(event => window.removeEventListener(event, resetTimeout));
  };
}, [user]);

  const login = async (email, password) => {
    const response = await authAPI.login(email, password);
    const { token, user } = response.data;
    
    // Store token and user
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    
    setUser(user);
    console.log('User logged in:', user);
    
    return user;
  };

  const logout = () => {
    authAPI.logout();
    setUser(null);
  };

  const isAuthenticated = !!user && !!localStorage.getItem('token');
  const isAdmin = user?.role === 'admin';

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      login, 
      logout, 
      isAuthenticated, 
      isAdmin 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

// Add a custom hook for better usage (optional but recommended)
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
