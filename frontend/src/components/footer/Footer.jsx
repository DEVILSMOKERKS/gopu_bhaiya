import React, { useState } from 'react';
import './footer.css';
import footerImage from '../../assets/img/Group 910.png';
import { FaInstagram, FaFacebook, FaCheck, FaTimes } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import axios from 'axios';
import WhatsAppFloat from '../WhatsAppFloat/WhatsAppFloat';


const Footer = () => {
  const [email, setEmail] = useState('');
  const [consent, setConsent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState({ show: false, type: '', message: '' });
  const [emailError, setEmailError] = useState('');

  // Get API URL from environment variable
  const API_URL = import.meta.env.VITE_API_URL;

  const showNotification = (type, message) => {
    setNotification({ show: true, type, message });
    setTimeout(() => {
      setNotification({ show: false, type: '', message: '' });
    }, 5000);
  };

  // Email validation function
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Handle email input change with validation
  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);

    if (value && !validateEmail(value)) {
      setEmailError('Please enter a valid email address');
    } else {
      setEmailError('');
    }
  };

  // Check if form is valid
  const isFormValid = () => {
    return email && validateEmail(email) && consent && !isLoading;
  };

  const handleEmailSubmit = async (e) => {
    e.preventDefault();

    // Check if form is valid
    if (!isFormValid()) {
      if (!email) {
        showNotification('error', 'Please enter your email address.');
      } else if (!validateEmail(email)) {
        showNotification('error', 'Please enter a valid email address.');
      } else if (!consent) {
        showNotification('error', 'Please accept the terms and conditions.');
      }
      return;
    }

    setIsLoading(true);

    try {
      const response = await axios.post(`${API_URL}/newsletter/subscribe`, {
        email: email,
        consent: consent
      });

      if (response.data.success) {
        showNotification('success', 'Thank you! You have been successfully subscribed to our newsletter.');
        setEmail('');
        setConsent(false);
      } else {
        showNotification('error', response.data.message || 'Something went wrong. Please try again.');
      }
    } catch (error) {
      console.error('Newsletter subscription error:', error);
      if (error.response?.data?.message) {
        showNotification('error', error.response.data.message);
      } else if (error.response?.status === 409) {
        showNotification('error', 'This email is already subscribed to our newsletter.');
      } else {
        showNotification('error', 'Failed to subscribe. Please try again later.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <footer className="footer">

      <div className="footer-main">
        {/* Left Section - Email Subscription */}
        <div className="footer-left-section">
          <h3 className="footer-heading">Join Our Club, Get 15% Off For Your Birthday</h3>
          <div className="footer-email-section">
            <form onSubmit={handleEmailSubmit}>
              <div className="email-input-container">
                <input
                  type="email"
                  className={`email-input ${emailError ? 'error' : ''}`}
                  placeholder="Enter Your Email Address"
                  value={email}
                  onChange={handleEmailChange}
                  required
                />
                <button
                  type="submit"
                  className={`email-submit-btn ${!isFormValid() ? 'disabled' : ''}`}
                  disabled={!isFormValid()}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
              {emailError && (
                <div className="email-error-message">
                  {emailError}
                </div>
              )}
            </form>

            <div className="consent-checkbox">
              <input
                type="checkbox"
                id="consent"
                checked={consent}
                onChange={(e) => setConsent(e.target.checked)}
              />
              <label htmlFor="consent">
                By Submitting your email, you agree to receive advertising emails from Saanz.
              </label>
            </div>

            <div className="social-icons">
              <a
                href="https://www.instagram.com/saanzjaipur?igsh=MXY0eThwMzI0NDkwcQ=="
                target="_blank"
                rel="noopener noreferrer"
                className="social-icon"
              >
                <FaInstagram size={16} color="#FFFFFF" />
              </a>
              <a
                href="https://www.facebook.com/share/1EyGdAjHEf/"
                target="_blank"
                rel="noopener noreferrer"
                className="social-icon"
              >
                <FaFacebook size={16} color="#ffffff" />
              </a>
            </div>
          </div>
        </div>

        {/* Right Section - Navigation Links */}
        <div className="footer-right-section">
          {/* About Saanz Column */}
          <div className="footer-column">
            <h3 className="footer-heading">About Saanz</h3>
            <ul className="footer-links">
              <Link to="/shop">Collection</Link>
              <Link to="/privacy-policy">Privacy Policy</Link>
              <Link to="/terms-and-conditions">Terms & Condition</Link>
              <Link to="/About-us">About us</Link>

            </ul>
          </div>

          {/* Help & Support Column */}
          <div className="footer-column">
            <h3 className="footer-heading">Help & Support</h3>
            <ul className="footer-links">
              <Link to="/track-order">Track Order</Link>
              <Link to="/shipping-policy">Shipping Policy</Link>
              <Link to="/return-and-refund">Return & Refund Policy</Link>
              <Link to="/contact-us">Contact Us</Link>
            </ul>
          </div>

          {/* Contact Info Column */}
          <div className="footer-column">
            <h3 className="footer-heading">Contact Info</h3>
            <ul className="footer-links">
              <li>
                <a href="tel:+919823889134" style={{ color: "inherit", textDecoration: "none" }}>
                  +91 98238 89134
                </a>
              </li>
              <li>
                <a href="mailto:saanzjaipurofficial@gmail.com" style={{ color: "inherit", textDecoration: "none" }}>
                  saanzjaipurofficial@gmail.com
                </a>
              </li>
              <li>Jaipur, Rajasthan</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="footer-bottom-border"></div>

      {/* Footer Bottom - Copyright */}
      <div className="footer-bottom">
        <p>© 2023 Saanz. All Rights Reserved.</p>
      </div>

      {/* WhatsApp Float Component */}
      <WhatsAppFloat />

      {/* Notification Toast */}
      {notification.show && (
        <div className={`footer-notification ${notification.type}`}>
          <div className="notification-content">
            <div className="notification-icon">
              {notification.type === 'success' ? (
                <FaCheck />
              ) : (
                <FaTimes />
              )}
            </div>
            <span className="notification-message">{notification.message}</span>
            <button
              className="notification-close"
              onClick={() => setNotification({ show: false, type: '', message: '' })}
            >
              <FaTimes />
            </button>
          </div>
        </div>
      )}

      {/* <div className="footer-bottom-image" style={{
        position: 'absolute',
        top: '200px',
        width: '100%',
      }}>
        <img src={footerImage} alt="" style={{
            width: '100%',
        }} />
      </div> */}
    </footer>
  );
};

export default Footer;
