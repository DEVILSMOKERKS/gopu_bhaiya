import React, { useState, useEffect } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { Lock, Eye, EyeOff, CheckCircle, AlertCircle, Loader2, ArrowLeft } from 'lucide-react';
import axios from 'axios';
import loginimage from '../../../assets/img/loginimage.jpg';
import './ResetPassword.css';

const ResetPassword = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const token = searchParams.get('token');

    const [formData, setFormData] = useState({
        password: '',
        confirmPassword: ''
    });

    const [errors, setErrors] = useState({});
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [error, setError] = useState('');
    const [focusedField, setFocusedField] = useState('');

    const API_URL = import.meta.env.VITE_API_URL;

    // Check if token exists
    useEffect(() => {
        if (!token) {
            setError('Invalid or missing reset token. Please request a new password reset.');
        }
    }, [token]);

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

    const validateForm = () => {
        const newErrors = {};

        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else if (formData.password.length < 8) {
            newErrors.password = 'Password must be at least 8 characters long';
        } else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/.test(formData.password)) {
            newErrors.password = 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character';
        }

        if (!formData.confirmPassword) {
            newErrors.confirmPassword = 'Please confirm your password';
        } else if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);
        setError('');
        setSuccessMessage('');

        try {
            const response = await axios.post(`${API_URL}/auth/reset-password`, {
                token: token,
                password: formData.password
            });

            if (response.data.success) {
                setSuccessMessage('Password has been reset successfully! You can now login with your new password.');
                setTimeout(() => {
                    navigate('/login');
                }, 3000);
            } else {
                setError(response.data.message || 'Failed to reset password');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Something went wrong. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!token) {
        return (
            <div className="reset-password-container">
                <div className="reset-password-form">
                    <div className="reset-password-content">
                        <div className="reset-password-header">
                            <h2>Invalid Reset Link</h2>
                            <p>The password reset link is invalid or has expired. Please request a new password reset.</p>
                        </div>
                        <div className="reset-password-footer">
                            <Link to="/forgot-password" className="back-to-forgot">
                                <ArrowLeft className="back-icon" />
                                Request New Reset Link
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="reset-password-container">
            {/* Image Section */}
            <div className="reset-password-img">
                <img src={loginimage} alt="Reset Password" />
            </div>

            {/* Form Section */}
            <div className="reset-password-form">
                <h1>Reset Your Password</h1>
                <p className="reset-password-subtitle">Enter your new password below. Make sure it's strong and secure.</p>

                <form onSubmit={handleSubmit}>
                    <div className="reset-password-form-group">
                        <div className="input-container">
                            <Lock className="input-icon" />
                            <input
                                type={showPassword ? 'text' : 'password'}
                                id="password"
                                name="password"
                                value={formData.password}
                                onChange={handleInputChange}
                                onFocus={() => setFocusedField('password')}
                                onBlur={() => setFocusedField('')}
                                placeholder="Enter new password"
                                className={`reset-password-input ${focusedField === 'password' ? 'focused' : ''} ${errors.password ? 'error' : ''}`}
                                required
                            />
                            <button
                                type="button"
                                className="password-toggle"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? <EyeOff className="toggle-icon" /> : <Eye className="toggle-icon" />}
                            </button>
                        </div>
                        {errors.password && (
                            <div className="field-error">
                                <AlertCircle className="error-icon" />
                                {errors.password}
                            </div>
                        )}
                    </div>

                    <div className="reset-password-form-group">
                        <div className="input-container">
                            <Lock className="input-icon" />
                            <input
                                type={showConfirmPassword ? 'text' : 'password'}
                                id="confirmPassword"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleInputChange}
                                onFocus={() => setFocusedField('confirmPassword')}
                                onBlur={() => setFocusedField('')}
                                placeholder="Confirm new password"
                                className={`reset-password-input ${focusedField === 'confirmPassword' ? 'focused' : ''} ${errors.confirmPassword ? 'error' : ''}`}
                                required
                            />
                            <button
                                type="button"
                                className="password-toggle"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            >
                                {showConfirmPassword ? <EyeOff className="toggle-icon" /> : <Eye className="toggle-icon" />}
                            </button>
                        </div>
                        {errors.confirmPassword && (
                            <div className="field-error">
                                <AlertCircle className="error-icon" />
                                {errors.confirmPassword}
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
                        className="reset-password-btn"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 className="btn-loader" />
                                Resetting Password...
                            </>
                        ) : (
                            'Reset Password'
                        )}
                    </button>
                </form>

                <div className="reset-password-footer">
                    <p>
                        Remember your password?
                        <Link to="/login" className="login-link">Sign in</Link>
                    </p>
                    <Link to="/login" className="back-to-login">
                        <ArrowLeft className="back-icon" />
                        Back to Login
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default ResetPassword;
