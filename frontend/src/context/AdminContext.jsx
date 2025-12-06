'use client';

import React, { createContext, useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

// Create context
const AdminContext = createContext();

// Custom hook to use admin context
export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};

// Provider component
export const AdminProvider = ({ children }) => {
  const router = useRouter();
  const API_URL = process.env.NEXT_PUBLIC_API_URL || process.env.VITE_API_URL;

  const [admin, setAdmin] = useState(null);
  const [token, setToken] = useState(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Initialize auth state on mount (client-side only)
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const initializeAuth = async () => {
      const storedToken = localStorage.getItem('adminToken');
      const storedAdmin = localStorage.getItem('admin');

      if (storedToken && storedAdmin) {
        try {
          setLoading(true);

          // Verify token by fetching admin profile
          const response = await axios.get(`${API_URL}/admin/me`, {
            headers: { Authorization: `Bearer ${storedToken}` }
          });

          if (response.data.success) {
            setAdmin(response.data.data.admin);
            setToken(storedToken);
            setSuccess('Welcome back!');
          } else {
            // Token is invalid, clear storage
            if (typeof window !== 'undefined') {
              localStorage.removeItem('adminToken');
              localStorage.removeItem('admin');
            }
            setAdmin(null);
            setToken(null);
          }
        } catch (error) {
          console.error('Admin auth initialization error:', error);
          if (typeof window !== 'undefined') {
            localStorage.removeItem('adminToken');
            localStorage.removeItem('admin');
          }
          setAdmin(null);
          setToken(null);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    initializeAuth();
  }, [API_URL]);

  // Update localStorage when admin/token changes (client-side only)
  useEffect(() => {
    if (typeof window === 'undefined') return;

    if (admin && token) {
      localStorage.setItem('admin', JSON.stringify(admin));
      localStorage.setItem('adminToken', token);
    } else {
      localStorage.removeItem('admin');
      localStorage.removeItem('adminToken');
    }
  }, [admin, token]);

  // Login function
  const login = async (credentials) => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(null);

      const response = await axios.post(`${API_URL}/admin/signin`, credentials);

      if (response.data.success) {
        // Remove password if present before saving
        const adminData = { ...response.data.data.admin };
        if (adminData.password) delete adminData.password;

        setAdmin(adminData);
        setToken(response.data.data.token);
        setSuccess(response.data.message);

        return { success: true, message: response.data.message };
      } else {
        setError(response.data);
        return { success: false, ...response.data };
      }
    } catch (error) {
      const errorResponse = {
        message: error.response?.data?.message || 'Network error. Please check your connection.',
        type: 'network'
      };
      setError(errorResponse);
      return { success: false, ...errorResponse };
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = async () => {
    try {
      if (token) {
        await axios.post(`${API_URL}/admin/logout`, {}, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }
    } catch (error) {
      console.error('Admin logout error:', error);
    } finally {
      // Clear localStorage and state
      if (typeof window !== 'undefined') {
        localStorage.removeItem('adminToken');
        localStorage.removeItem('admin');
      }

      setAdmin(null);
      setToken(null);
      setError(null);
      setSuccess(null);

      router.push('/admin/login');
    }
  };

  // Update admin profile
  const updateAdmin = (adminData) => {
    // Remove password if present before saving
    const adminDataToSave = { ...adminData };
    if (adminDataToSave.password) delete adminDataToSave.password;

    setAdmin(adminDataToSave);
  };

  // Clear error
  const clearError = () => {
    setError(null);
  };

  // Clear success
  const clearSuccess = () => {
    setSuccess(null);
  };

  // Get admin profile
  const getProfile = async () => {
    try {
      const response = await axios.get(`${API_URL}/admin/me`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        updateAdmin(response.data.data.admin);
        return { success: true, data: response.data.data.admin };
      } else {
        return { success: false, ...response.data };
      }
    } catch (error) {
      return { success: false, message: 'Failed to fetch profile' };
    }
  };

  // Check if admin is authenticated
  const isAuthenticated = !!admin && !!token;

  const value = {
    admin,
    token,
    isAuthenticated,
    loading,
    error,
    success,
    login,
    logout,
    updateAdmin,
    clearError,
    clearSuccess,
    getProfile,
    setAdmin
  };

  return (
    <AdminContext.Provider value={value}>
      {children}
    </AdminContext.Provider>
  );
};

export default AdminContext;
