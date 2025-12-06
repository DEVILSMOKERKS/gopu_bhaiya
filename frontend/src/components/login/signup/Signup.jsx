'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FcGoogle } from "react-icons/fc";
import { PiFacebookLogoFill } from "react-icons/pi";
import { Eye, EyeOff, AlertCircle, CheckCircle, Loader2 } from 'lucide-react';
import { useUser } from '../../../context/UserContext';
import { validateSignupForm, validateField } from '../../../Utils/validation.js';
import Signupimage from '../../../assets/img/loginimage.jpg';
import './signup.css';

const Signup = ({ onClose }) => {
    const router = useRouter();
    const { signup, loading, error, clearError } = useUser();

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });

    const [errors, setErrors] = useState({});
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [focusedField, setFocusedField] = useState('');

    // Clear errors when component mounts
    useEffect(() => {
        clearError();
    }, [clearError]);

    // Check if user is already logged in
    useEffect(() => {
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
    }, [navigate]);

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
        const validation = validateField(name, value, { password: formData.password });
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
        const validation = validateSignupForm(formData);
        if (!validation.isValid) {
            setErrors(validation.errors);
            return;
        }

        setIsSubmitting(true);

        try {
            // Prepare data for API
            const apiData = {
                name: formData.name,
                email: formData.email,
                password: formData.password
            };

            const result = await signup(apiData);

            if (result.success) {
                setSuccessMessage('Account created successfully! Redirecting...');
                setTimeout(() => {
                    if (onClose) onClose();
                    router.push('/');
                }, 1500);
            } else {
                // Error is already set in the user context
                console.error('Signup failed:', result.message);
            }
        } catch (err) {
            console.error('Signup error:', err);
        } finally {
            setIsSubmitting(false);
        }
    };

    // Handle social signup (placeholder)
    const handleSocialSignup = (provider) => {
        // Implement social signup functionality here
    };

    // Check if form is valid
    const isFormValid = () => {
        return formData.name && formData.email && formData.password && formData.confirmPassword &&
            Object.keys(errors).every(key => !errors[key]);
    };

    return (
        <div className="signup-container">
            {onClose && (
                <button
                    onClick={onClose}
                    style={{
                        position: 'absolute',
                        top: '10px',
                        right: '10px',
                        background: 'none',
                        border: 'none',
                        fontSize: '24px',
                        cursor: 'pointer',
                        color: '#666',
                        zIndex: 1001
                    }}
                    aria-label="Close signup modal"
                >
                    ×
                </button>
            )}
            <div className="signup-img">
                <img src={Signupimage} alt='Beautiful signup background' />
            </div>

            <div className="signup-form">
                <h1>Create Account</h1>
                <p className="signup-subtitle">Join us today</p>

                {/* Success Message */}
                {successMessage && (
                    <div className="signup-message success">
                        <CheckCircle size={20} />
                        <span>{successMessage}</span>
                    </div>
                )}

                {/* Error Message */}
                {error && (
                    <div className="signup-message error">
                        <AlertCircle size={20} />
                        <span>{error.message}</span>
                    </div>
                )}

                <form onSubmit={handleSubmit} noValidate>
                    {/* Name Field */}
                    <div className="signup-form-group">
                        <input
                            type="text"
                            name="name"
                            placeholder="Full Name"
                            value={formData.name}
                            onChange={handleInputChange}
                            onFocus={() => handleInputFocus('name')}
                            onBlur={() => handleInputBlur('name')}
                            className={`${errors.name ? 'error' : ''} ${focusedField === 'name' ? 'focused' : ''}`}
                            disabled={isSubmitting}
                            autoComplete="name"
                            aria-describedby={errors.name ? 'name-error' : undefined}
                        />
                        {errors.name && (
                            <span className="signup-error-message" id="name-error">{errors.name}</span>
                        )}
                    </div>

                    {/* Email Field */}
                    <div className="signup-form-group">
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
                            <span className="signup-error-message" id="email-error">{errors.email}</span>
                        )}
                    </div>

                    {/* Password Field */}
                    <div className="signup-form-group">
                        <div className="signup-password-input">
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
                                autoComplete="new-password"
                                aria-describedby={errors.password ? 'password-error' : undefined}
                            />
                            <button
                                type="button"
                                className="signup-password-toggle"
                                onClick={() => setShowPassword(!showPassword)}
                                disabled={isSubmitting}
                                aria-label={showPassword ? 'Hide password' : 'Show password'}
                            >
                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
                        {errors.password && (
                            <span className="signup-error-message" id="password-error">{errors.password}</span>
                        )}
                    </div>

                    {/* Confirm Password Field */}
                    <div className="signup-form-group">
                        <div className="signup-password-input">
                            <input
                                type={showConfirmPassword ? 'text' : 'password'}
                                name="confirmPassword"
                                placeholder="Confirm Password"
                                value={formData.confirmPassword}
                                onChange={handleInputChange}
                                onFocus={() => handleInputFocus('confirmPassword')}
                                onBlur={() => handleInputBlur('confirmPassword')}
                                className={`${errors.confirmPassword ? 'error' : ''} ${focusedField === 'confirmPassword' ? 'focused' : ''}`}
                                disabled={isSubmitting}
                                autoComplete="new-password"
                                aria-describedby={errors.confirmPassword ? 'confirm-password-error' : undefined}
                            />
                            <button
                                type="button"
                                className="signup-password-toggle"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                disabled={isSubmitting}
                                aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
                            >
                                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
                        {errors.confirmPassword && (
                            <span className="signup-error-message" id="confirm-password-error">{errors.confirmPassword}</span>
                        )}
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        className="signup-submit-btn"
                        disabled={!isFormValid() || isSubmitting || loading}
                        aria-describedby={!isFormValid() ? 'form-validation-error' : undefined}
                    >
                        {isSubmitting || loading ? (
                            <>
                                <Loader2 size={20} className="signup-animate-spin" />
                                <span>Creating Account...</span>
                            </>
                        ) : (
                            'Create Account'
                        )}
                    </button>

                    {!isFormValid() && (
                        <div id="form-validation-error" className="signup-sr-only">
                            Please fill in all required fields correctly
                        </div>
                    )}
                </form>

                {/* Sign In Link */}
                <p className='signup-login-link'>
                    Already have an account?
                    <Link href='/login'>Sign in</Link>
                </p>

                {/* Divider */}
                <div className="signup-divider">
                    <span>or</span>
                </div>

                {/* Social Signup Buttons */}
                <div className="signup-social-icons">
                    <button
                        type="button"
                        className="signup-social-btn google"
                        onClick={() => handleSocialSignup('google')}
                        disabled={isSubmitting || loading}
                        aria-label="Continue with Google"
                    >
                        <FcGoogle size={24} />
                        <span>Continue with Google</span>
                    </button>

                    <button
                        type="button"
                        className="signup-social-btn facebook"
                        onClick={() => handleSocialSignup('facebook')}
                        disabled={isSubmitting || loading}
                        aria-label="Continue with Facebook"
                    >
                        <PiFacebookLogoFill size={24} />
                        <span>Continue with Facebook</span>
                    </button>
                </div>

                {/* Terms */}
                <p className='signup-terms'>
                    By clicking Create Account, you agree to our{' '}
                    <Link href='/terms-and-conditions'>Terms of Service</Link> and{' '}
                    <Link href='/privacy-policy'>Privacy Policy</Link>
                </p>
            </div>
        </div>
    );
};

export default Signup;