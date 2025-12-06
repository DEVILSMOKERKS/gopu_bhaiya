import React, { useState } from 'react';
import axios from 'axios';
import { useAdmin } from '../../../context/AdminContext';
import './AdminAuthPopup.css';

const AdminAuthPopup = ({ isOpen, onClose, onLogin }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetSent, setResetSent] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // Added state for password visibility
  const { loading, error, login } = useAdmin();

  // Get API URL from environment variable
  const API_URL = process.env.NEXT_PUBLIC_API_URL

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const result = await login(formData);
    if (result.success) {
      onLogin(result);
      onClose();
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setResetLoading(true);

    try {
      const response = await axios.post(`${API_URL}/admin/forgot-password`, { email: resetEmail });

      const data = response.data;

      if (response.status === 200 && data.success) {
        setResetSent(true);
        setResetEmail('');
      } else {
        alert(data.message || 'Failed to send reset email');
      }
    } catch (error) {
      alert('Network error. Please try again.');
    } finally {
      setResetLoading(false);
    }
  };

  const handleBackToLogin = () => {
    setIsForgotPassword(false);
    setResetSent(false);
    setResetEmail('');
  };

  if (!isOpen) return null;

  return (
    <div className="admin-form-overlay" onClick={onClose}>
      <div className="admin-form-popup" onClick={(e) => e.stopPropagation()}>
        <div className="admin-form-header">
          <h2>{isForgotPassword ? 'Forgot Password' : 'Admin Login'}</h2>
          <button className="admin-form-close-btn" onClick={onClose}>
            <span>&times;</span>
          </button>
        </div>

        {!isForgotPassword ? (
          // Login Form
          <form onSubmit={handleSubmit} className="admin-form-form">
            <div className="admin-form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                placeholder="Enter your email"
              />
            </div>

            <div className="admin-form-group">
              <label htmlFor="password">Password</label>
              <div className="admin-form-password-input-container">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  className="admin-form-toggle-password-visibility"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <span className="admin-form-eye-icon">👁️</span>
                  ) : (
                    <span className="admin-form-eye-icon">👁️‍🗨️</span>
                  )}
                </button>
              </div>
            </div>

            {error && <div className="admin-form-error-message">{error.message || error}</div>}

            <button
              type="submit"
              className="admin-form-login-btn"
              disabled={loading}
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>

            <div className="admin-form-forgot-password-section">
              <button
                type="button"
                className="admin-form-forgot-password-btn"
                onClick={() => setIsForgotPassword(true)}
              >
                Forgot Password?
              </button>
            </div>
          </form>
        ) : (
          // Forgot Password Form
          <div className="admin-form-forgot-password-container">
            {!resetSent ? (
              <form onSubmit={handleForgotPassword} className="admin-form-form">
                <div className="admin-form-group">
                  <label htmlFor="resetEmail">Email Address</label>
                  <input
                    type="email"
                    id="resetEmail"
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    required
                    placeholder="Enter your email address"
                  />
                </div>

                <p className="admin-form-reset-instructions">
                  Enter your email address and we'll send you a link to reset your password.
                </p>

                <button
                  type="submit"
                  className="admin-form-reset-btn"
                  disabled={resetLoading}
                >
                  {resetLoading ? 'Sending...' : 'Send Reset Link'}
                </button>

                <button
                  type="button"
                  className="admin-form-back-to-login-btn"
                  onClick={handleBackToLogin}
                >
                  Back to Login
                </button>
              </form>
            ) : (
              <div className="admin-form-reset-sent-container">
                <div className="admin-form-success-icon">✓</div>
                <h3>Reset Link Sent!</h3>
                <p>
                  We've sent a password reset link to <strong>{resetEmail}</strong>.
                  Please check your email and click the link to reset your password.
                </p>
                <button
                  type="button"
                  className="admin-form-back-to-login-btn"
                  onClick={handleBackToLogin}
                >
                  Back to Login
                </button>
              </div>
            )}
          </div>
        )}

        <div className="admin-form-footer">
          <p>Access admin dashboard</p>
        </div>
      </div>
    </div>
  );
};

export default AdminAuthPopup;