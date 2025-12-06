'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FcGoogle } from "react-icons/fc";
import { PiFacebookLogoFill } from "react-icons/pi";
import { Eye, EyeOff, AlertCircle, CheckCircle, Loader2 } from 'lucide-react';
import { useUser } from '../../../context/UserContext';
import { validateSigninForm, validateField } from '../../../Utils/validation.js';
import loginimage from '../../../assets/img/loginimage.jpg';
import './login.css';

const Login = () => {
    const router = useRouter();
    const { login, loading, error, clearError } = useUser();

    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const [errors, setErrors] = useState({});
    const [showPassword, setShowPassword] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [focusedField, setFocusedField] = useState('');

    // Clear errors when component mounts
    useEffect(() => {
        clearError();
    }, [clearError]);

    // Check if user is already logged in
    useEffect(() => {
        if (typeof window === 'undefined') return;

        const userData = localStorage.getItem('user');
        const token = localStorage.getItem('token');

        if (userData && token) {
            try {
                const parsedUser = JSON.parse(userData);
                // User is already logged in, redirect to profile
                router.push('/profile');
            } catch (error) {
                console.error('Error parsing user data:', error);
                // Clear invalid data
                localStorage.removeItem('user');
                localStorage.removeItem('token');
            }
        }
    }, [router]);

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

        // Real-time validation
        const validation = validateField(name, value);
        if (!validation.isValid) {
            setErrors(prev => ({
                ...prev,
                [name]: validation.message
            }));
        } else {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
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

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Clear previous messages
        setSuccessMessage('');
        clearError();

        // Validate form
        const validation = validateSigninForm(formData);
        if (!validation.isValid) {
            setErrors(validation.errors);
            return;
        }

        setIsSubmitting(true);

        try {
            const result = await login(formData);

            if (result.success) {
                setSuccessMessage('Login successful! Redirecting...');
                setTimeout(() => {
                    router.push('/');
                }, 1500);
            } else {
                // Error is already set in the user context
                console.error('Login failed:', result.message);
            }
        } catch (err) {
            console.error('Login error:', err);
        } finally {
            setIsSubmitting(false);
        }
    };

    // Handle social login
    const handleSocialLogin = async (provider) => {
        try {
            setLoading(true);
            clearError();

            if (provider === 'google') {
                // Initialize Google OAuth
                if (window.google) {
                    const client = window.google.accounts.oauth2.initCodeClient({
                        client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
                        scope: 'email profile',
                        callback: handleGoogleCallback
                    });
                    client.requestCode();
                } else {
                    setError('Google OAuth not loaded. Please refresh the page.');
                }
            } else if (provider === 'facebook') {
                setError('Facebook login is not implemented yet.');
            }
        } catch (error) {
            console.error('Social login error:', error);
            setError('Social login failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    // Handle Google OAuth callback
    const handleGoogleCallback = async (response) => {
        try {
            setLoading(true);

            // Send the authorization code to your backend
            const API_URL = process.env.NEXT_PUBLIC_API_URL
            const result = await axios.post(`${API_URL}/auth/google`, {
                code: response.code
            });

            if (result.data.success) {
                // Store user data and token
                localStorage.setItem('user', JSON.stringify(result.data.data.user));
                localStorage.setItem('token', result.data.data.token);

                setSuccess('Google login successful! Redirecting...');
                setTimeout(() => {
                    router.push('/');
                }, 1500);
            } else {
                setError(result.data.message || 'Google login failed');
            }
        } catch (error) {
            console.error('Google callback error:', error);
            setError('Google login failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    // Check if form is valid
    const isFormValid = () => {
        return formData.email && formData.password && Object.keys(errors).every(key => !errors[key]);
    };

    return (
        <div className="login-container">
            <div className="login-img">
                <img src={loginimage} alt='Beautiful login background' />
            </div>

            <div className="login-form">
                <h1>Welcome Back</h1>
                <p className="login-subtitle">Sign in to your account</p>

                {/* Success Message */}
                {successMessage && (
                    <div className="login-message success">
                        <CheckCircle size={20} />
                        <span>{successMessage}</span>
                    </div>
                )}

                {/* Error Message */}
                {error && (
                    <div className="login-message error">
                        <AlertCircle size={20} />
                        <span>{error.message}</span>
                    </div>
                )}

                <form onSubmit={handleSubmit} noValidate>
                    {/* Email Field */}
                    <div className="login-form-group">
                        <input
                            type="email"
                            name="email"
                            placeholder="Email"
                            value={formData.email}
                            onChange={handleInputChange}
                            onFocus={() => handleInputFocus('email')}
                            onBlur={() => handleInputBlur('email')}
                            className={`${errors.email ? 'error' : ''} ${focusedField === 'email' ? 'focused' : ''}`}
                            disabled={isSubmitting}
                            autoComplete="email"
                            aria-describedby={errors.email ? 'email-error' : undefined}
                        />
                        {errors.email && (
                            <span className="login-error-message" id="email-error">{errors.email}</span>
                        )}
                    </div>

                    {/* Password Field */}
                    <div className="login-form-group">
                        <div className="login-password-input">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                name="password"
                                placeholder="Password"
                                value={formData.password}
                                onChange={handleInputChange}
                                onFocus={() => handleInputFocus('password')}
                                onBlur={() => handleInputBlur('password')}
                                className={`${errors.password ? 'error' : ''} ${focusedField === 'password' ? 'focused' : ''}`}
                                disabled={isSubmitting}
                                autoComplete="current-password"
                                aria-describedby={errors.password ? 'password-error' : undefined}
                            />
                            <button
                                type="button"
                                className="login-password-toggle"
                                onClick={() => setShowPassword(!showPassword)}
                                disabled={isSubmitting}
                                aria-label={showPassword ? 'Hide password' : 'Show password'}
                            >
                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
                        {errors.password && (
                            <span className="login-error-message" id="password-error">{errors.password}</span>
                        )}
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        className="login-submit-btn"
                        disabled={!isFormValid() || isSubmitting || loading}
                        aria-describedby={!isFormValid() ? 'form-validation-error' : undefined}
                    >
                        {isSubmitting || loading ? (
                            <>
                                <Loader2 size={20} className="login-animate-spin" />
                                <span>Signing In...</span>
                            </>
                        ) : (
                            'Sign In'
                        )}
                    </button>

                    {!isFormValid() && (
                        <div id="form-validation-error" className="login-sr-only">
                            Please fill in all required fields correctly
                        </div>
                    )}
                </form>

                {/* Forgot Password Link */}
                <div className="login-forgot-password">
                    <Link href="/forgot-password">Forgot your password?</Link>
                </div>

                {/* Sign Up Link */}
                <p className='login-signup-link'>
                    Don't have an account?
                    <Link href='/signup'>Sign up</Link>
                </p>

                {/* Divider */}
                <div className="login-divider">
                    <span>or</span>
                </div>

                {/* Social Login Buttons */}
                <div className="login-social-icons">
                    <button
                        type="button"
                        className="login-social-btn google"
                        onClick={() => handleSocialLogin('google')}
                        disabled={isSubmitting || loading}
                        aria-label="Continue with Google"
                    >
                        <FcGoogle size={24} />
                        <span>Continue with Google</span>
                    </button>

                    <button
                        type="button"
                        className="login-social-btn facebook"
                        onClick={() => handleSocialLogin('facebook')}
                        disabled={isSubmitting || loading}
                        aria-label="Continue with Facebook"
                    >
                        <PiFacebookLogoFill size={24} />
                        <span>Continue with Facebook</span>
                    </button>
                </div>

                {/* Terms */}
                <p className='login-terms'>
                    By clicking Sign In, you agree to our{' '}
                    <Link href='/terms-and-conditions'>Terms of Service</Link> and{' '}
                    <Link href='/privacy-policy'>Privacy Policy</Link>
                </p>
            </div>
        </div>
    );
};

export default Login;