'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import './footer.css';
import { FaInstagram, FaFacebook, FaYoutube, FaCheck, FaTimes, FaEnvelope, FaPhone, FaMapMarkerAlt } from 'react-icons/fa';
import Link from 'next/link';
import axios from 'axios';
import WhatsAppFloat from '../WhatsAppFloat/WhatsAppFloat';
import logo from '../../assets/img/logo.png';


const Footer = () => {
  const [email, setEmail] = useState('');
  const [consent, setConsent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState({ show: false, type: '', message: '' });
  const [emailError, setEmailError] = useState('');

  // Get API URL from environment variable
  const API_URL = process.env.NEXT_PUBLIC_API_URL || process.env.VITE_API_URL;

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
      {/* Background Watermark */}
      <div className="footer-watermark">MATESHWARI EXPORTS</div>

      <div className="footer-main">
        {/* Left Section - Logo and Stay Connected */}
        <div className="footer-left-section">
          <div className="footer-logo-section">
            <Link href="/" className="footer-logo-link">
              <Image src={logo} alt="Mateshwari Exports" className="footer-logo-img" width={200} height={60} priority />
            </Link>
          </div>

          <div className="footer-stay-connected">
            <h3 className="footer-stay-connected-title">Stay Connected With Divinity</h3>
            
            <form onSubmit={handleEmailSubmit} className="footer-email-form">
              <div className="footer-email-input-wrapper">
                <input
                  type="email"
                  className={`footer-email-input ${emailError ? 'error' : ''}`}
                  placeholder="Enter Your Email Address"
                  value={email}
                  onChange={handleEmailChange}
                  required
                />
                <button
                  type="submit"
                  className={`footer-email-submit-btn ${!isFormValid() ? 'disabled' : ''}`}
                  disabled={!isFormValid()}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
              {emailError && (
                <div className="footer-email-error">
                  {emailError}
                </div>
              )}
            </form>

            <div className="footer-consent-checkbox">
              <input
                type="checkbox"
                id="footer-consent"
                checked={consent}
                onChange={(e) => setConsent(e.target.checked)}
              />
              <label htmlFor="footer-consent">
                By Submitting Your Email, You Agree To Receive Advertising Emails From Mateshwari Exports.
              </label>
            </div>

            <div className="footer-social-icons">
              <a
                href="https://www.instagram.com/mateshwari_exports/"
                target="_blank"
                rel="noopener noreferrer"
                className="footer-social-icon"
              >
                <FaInstagram />
              </a>
              <a
                href="https://www.facebook.com/mateshwariexports/"
                target="_blank"
                rel="noopener noreferrer"
                className="footer-social-icon"
              >
                <FaFacebook />
              </a>
              <a
                href="https://www.youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="footer-social-icon"
              >
                <FaYoutube />
              </a>
            </div>
          </div>
        </div>

        {/* Right Section - Navigation Columns */}
        <div className="footer-right-section">
          {/* About Us Column */}
          <div className="footer-column">
            <h3 className="footer-column-title">About Us</h3>
            <ul className="footer-column-links">
              <li><Link href="/">Home</Link></li>
              <li><Link href="/about-us">About Us</Link></li>
              <li><Link href="/shop">All Product</Link></li>
              <li><Link href="/blogs">Blog</Link></li>
              <li><Link href="/contact-us">Contact Us</Link></li>
            </ul>
          </div>

          {/* Useful Links Column */}
          <div className="footer-column">
            <h3 className="footer-column-title">Useful Links</h3>
            <ul className="footer-column-links">
              <li><Link href="/privacy-policy">Privacy Policy</Link></li>
              <li><Link href="/terms-and-conditions">Terms & Condition</Link></li>
              <li><Link href="/privacy-policy">Cookies Policy</Link></li>
            </ul>
          </div>

          {/* Site Links Column */}
          <div className="footer-column">
            <h3 className="footer-column-title">Site Links</h3>
            <ul className="footer-column-links footer-contact-links">
              <li>
                <FaEnvelope className="footer-contact-icon" />
                <a href="mailto:Mateshvariexporter@gmail.com">Mateshvariexporter@gmail.com</a>
              </li>
              <li>
                <FaPhone className="footer-contact-icon" />
                <span>7791983156 | 8824292890 | 9784503338</span>
              </li>
              <li>
                <FaMapMarkerAlt className="footer-contact-icon" />
                <span>2310, Khajane walo ka Rasta, Nehru Tailour Chouraha, Chandpole Bazar, Jaipur-302001 (Rajasthan) INDIA</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Footer Bottom - Copyright */}
      <div className="footer-bottom">
        <p>© 2023 Mateshwari Exports. All Rights Reserved.</p>
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
    </footer>
  );
};

export default Footer;
