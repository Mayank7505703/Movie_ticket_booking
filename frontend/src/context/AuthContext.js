// context/AuthContext.js
// Provides global auth state (user info + token) across the entire app

import React, { createContext, useContext, useState, useEffect } from 'react';

// 1. Create the context
const AuthContext = createContext();

// 2. Create a Provider component that wraps the whole app
export const AuthProvider = ({ children }) => {
  // Load user from localStorage (so they stay logged in after refresh)
  const [user,  setUser]  = useState(() => JSON.parse(localStorage.getItem('user'))  || null);
  const [token, setToken] = useState(() => localStorage.getItem('token') || null);

  // Login: save user + token to state AND localStorage
  const login = (userData, authToken) => {
    setUser(userData);
    setToken(authToken);
    localStorage.setItem('user',  JSON.stringify(userData));
    localStorage.setItem('token', authToken);
  };

  // Logout: clear everything
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isLoggedIn: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

// 3. Custom hook for easy access in any component
export const useAuth = () => useContext(AuthContext);
