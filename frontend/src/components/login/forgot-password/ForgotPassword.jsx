'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Mail, ArrowLeft, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import axios from 'axios';
import loginimage from '../../../assets/img/loginimage.jpg';
import './ForgotPassword.css';

const ForgotPassword = () => {
  const [formData, setFormData] = useState({
    email: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [error, setError] = useState('');
  const [focusedField, setFocusedField] = useState('');

  const API_URL = process.env.NEXT_PUBLIC_API_URL

  // Handle input changes with real-time validation
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear field error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }

    // Clear general error
    if (error) {
      setError('');
    }
  };

  // Handle input focus
  const handleInputFocus = (fieldName) => {
    setFocusedField(fieldName);
  };

  // Handle input blur
  const handleInputBlur = (fieldName) => {
    setFocusedField('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    setSuccessMessage('');

    try {
      const response = await axios.post(`${API_URL}/auth/forgot-password`, {
        email: formData.email
      });

      if (response.data.success) {
        setSuccessMessage('Password reset link has been sent to your email address.');
      } else {
        setError(response.data.message || 'Failed to send reset link');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="forgot-password-container">
      {/* Image Section */}
      <div className="forgot-password-img">
        <Image src={loginimage} alt="Forgot Password" fill style={{ objectFit: 'cover' }} />
      </div>

      {/* Form Section */}
      <div className="forgot-password-form">
        <h1>Forgot Password?</h1>
        <p className="forgot-password-subtitle">Don&apos;t worry! Enter your email address and we&apos;ll send you a link to reset your password.</p>

        <form onSubmit={handleSubmit}>
          <div className="forgot-password-form-group">
            <div className="input-container">
              <Mail className="input-icon" />
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                onFocus={() => handleInputFocus('email')}
                onBlur={() => handleInputBlur('email')}
                placeholder="Enter your email address"
                className={`forgot-password-input ${focusedField === 'email' ? 'focused' : ''} ${errors.email ? 'error' : ''}`}
                required
              />
            </div>
            {errors.email && (
              <div className="field-error">
                <AlertCircle className="error-icon" />
                {errors.email}
              </div>
            )}
          </div>

          {error && (
            <div className="error-message">
              <AlertCircle className="error-icon" />
              {error}
            </div>
          )}

          {successMessage && (
            <div className="success-message">
              <CheckCircle className="success-icon" />
              {successMessage}
            </div>
          )}

          <button
            type="submit"
            className="forgot-password-btn"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="btn-loader" />
                Sending Reset Link...
              </>
            ) : (
              'Send Reset Link'
            )}
          </button>
        </form>

        <div className="forgot-password-footer">
          <p>
            Remember your password?
            <Link href="/login" className="login-link">Sign in</Link>
          </p>
          <Link href="/login" className="back-to-login">
            <ArrowLeft className="back-icon" />
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
