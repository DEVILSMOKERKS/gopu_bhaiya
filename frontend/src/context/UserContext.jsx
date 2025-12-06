'use client';
import React, { createContext, useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

// Create context
export const UserContext = createContext();

// Custom hook to use user context
export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

// Provider component
export const UserProvider = ({ children }) => {
  const router = useRouter();
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Initialize auth state on mount (client-side only)
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const initializeAuth = async () => {
      const storedToken = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');

      if (storedToken && storedUser) {
        try {
          setLoading(true);

          // Verify token by fetching user profile
          const response = await axios.get(`${API_URL}/auth/me`, {
            headers: { Authorization: `Bearer ${storedToken}` }
          });

          if (response.data.success) {
            setUser(response.data.data.user);
            setToken(storedToken);
            setSuccess('Welcome back!');
          } else {
            // Token is invalid, clear storage
            if (typeof window !== 'undefined') {
              localStorage.removeItem('token');
              localStorage.removeItem('user');
            }
            setUser(null);
            setToken(null);
          }
        } catch (error) {
          console.error('Auth initialization error:', error);
          if (typeof window !== 'undefined') {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
          }
          setUser(null);
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

  // Update localStorage when user/token changes (client-side only)
  useEffect(() => {
    if (typeof window === 'undefined') return;

    if (user && token) {
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('user');
      localStorage.removeItem('token');
    }
  }, [user, token]);

  // Login function
  const login = async (credentials) => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(null);

      const response = await axios.post(`${API_URL}/auth/signin`, credentials);

      if (response.data.success) {
        // Remove password if present before saving
        const userData = { ...response.data.data.user };
        if (userData.password) delete userData.password;

        setUser(userData);
        setToken(response.data.data.token);
        setSuccess(response.data.message);

        // Immediately fetch complete user profile data
        try {
          const profileResponse = await axios.get(`${API_URL}/auth/me`, {
            headers: { Authorization: `Bearer ${response.data.data.token}` }
          });

          if (profileResponse.data.success) {
            const completeUserData = { ...profileResponse.data.data.user };
            if (completeUserData.password) delete completeUserData.password;
            setUser(completeUserData);
          }
        } catch (profileError) {
          console.warn('Could not fetch complete profile data:', profileError);
          // Continue with basic user data if profile fetch fails
        }

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

  // Signup function
  const signup = async (userData) => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(null);

      const response = await axios.post(`${API_URL}/auth/signup`, userData);

      if (response.data.success) {
        // Remove password if present before saving
        const userDataToSave = { ...response.data.data.user };
        if (userDataToSave.password) delete userDataToSave.password;

        setUser(userDataToSave);
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

  // Signup with photo function
  const signupWithPhoto = async (userData) => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(null);

      const formData = new FormData();

      // Add user data
      Object.keys(userData).forEach(key => {
        if (key === 'photo') {
          formData.append(key, userData[key]);
        } else {
          formData.append(key, userData[key]);
        }
      });

      const response = await axios.post(`${API_URL}/auth/signup-with-photo`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.success) {
        // Remove password if present before saving
        const userDataToSave = { ...response.data.data.user };
        if (userDataToSave.password) delete userDataToSave.password;

        setUser(userDataToSave);
        setToken(response.data.data.token);
        setSuccess(response.data.message);

        // Immediately fetch complete user profile data
        try {
          const profileResponse = await axios.get(`${API_URL}/auth/me`, {
            headers: { Authorization: `Bearer ${response.data.data.token}` }
          });

          if (profileResponse.data.success) {
            const completeUserData = { ...profileResponse.data.data.user };
            if (completeUserData.password) delete completeUserData.password;
            setUser(completeUserData);
          }
        } catch (profileError) {
          console.warn('Could not fetch complete profile data:', profileError);
          // Continue with basic user data if profile fetch fails
        }

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
        await axios.post(`${API_URL}/auth/logout`, {}, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear localStorage and state
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }

      setUser(null);
      setToken(null);
      setError(null);
      setSuccess(null);

      router.push('/login');
    }
  };

  // Update user profile
  const updateUser = (userData) => {
    // Remove password if present before saving
    const userDataToSave = { ...userData };
    if (userDataToSave.password) delete userDataToSave.password;

    setUser(userDataToSave);
  };

  // Clear error
  const clearError = () => {
    setError(null);
  };

  // Clear success
  const clearSuccess = () => {
    setSuccess(null);
  };

  // Get user profile
  const getProfile = async () => {
    try {
      const response = await axios.get(`${API_URL}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        updateUser(response.data.data.user);
        return { success: true, data: response.data.data.user };
      } else {
        return { success: false, ...response.data };
      }
    } catch (error) {
      return { success: false, message: 'Failed to fetch profile' };
    }
  };

  // Update user profile
  const updateProfile = async (profileData) => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(null);

      const response = await axios.put(
        `${API_URL}/auth/update-profile`,
        profileData,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      if (response.data.success) {
        updateUser(response.data.data.user);
        setSuccess(response.data.message);
        return { success: true, message: response.data.message };
      } else {
        setError(response.data);
        return { success: false, ...response.data };
      }
    } catch (error) {
      const errorResponse = {
        message: error.response?.data?.message || 'Failed to update profile',
        type: 'network'
      };
      setError(errorResponse);
      return { success: false, ...errorResponse };
    } finally {
      setLoading(false);
    }
  };

  // Update profile photo
  const updateProfilePhoto = async (photoFile) => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(null);

      const formData = new FormData();
      formData.append('photo', photoFile);

      const response = await axios.put(
        `${API_URL}/auth/update-photo`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      if (response.data.success) {
        updateUser(response.data.data.user);
        setSuccess(response.data.message);
        return { success: true, message: response.data.message };
      } else {
        setError(response.data);
        return { success: false, ...response.data };
      }
    } catch (error) {
      const errorResponse = {
        message: error.response?.data?.message || 'Failed to update photo',
        type: 'network'
      };
      setError(errorResponse);
      return { success: false, ...errorResponse };
    } finally {
      setLoading(false);
    }
  };

  // Check if user is authenticated
  const isAuthenticated = !!user && !!token;

  const value = {
    user,
    token,
    isAuthenticated,
    loading,
    error,
    success,
    login,
    signup,
    signupWithPhoto,
    logout,
    updateUser,
    updateProfile,
    updateProfilePhoto,
    clearError,
    clearSuccess,
    getProfile,
    setUser
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};
