import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  // ✅ UPDATED LOGIN FUNCTION
  const login = async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      const userData = response.data; // Includes token, name, email, role

      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      
      // Return success AND the user data so we can check the role immediately
      return { success: true, user: userData }; 

    } catch (error) {
      console.error("Login Failed:", error);
      return { success: false, message: "Invalid credentials" };
    }
  };

  const register = async (name, email, password, phone, role) => {
    try {
      await api.post('/auth/register', { name, email, password, phoneNumber: phone, role });
      return { success: true };
    } catch (error) {
      console.error("Registration Failed:", error);
      return { success: false, message: error.response?.data || "Registration failed" };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    // Optional: Redirect to login handled by protected routes
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);