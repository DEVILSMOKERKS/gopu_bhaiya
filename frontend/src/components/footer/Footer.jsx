'use client';

import { useState } from 'react';
import Image from 'next/image';
import './footer.css';
import { FaInstagram, FaFacebook, FaYoutube, FaCheck, FaTimes, FaEnvelope, FaPhone, FaMapMarkerAlt } from 'react-icons/fa';
import Link from 'next/link';
import axios from 'axios';
import WhatsAppFloat from '../WhatsAppFloat/WhatsAppFloat';
import logo from '../../assets/Images/img/logobanner.png';


const Footer = () => {
  const [email, setEmail] = useState('');
  const [consent, setConsent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState({ show: false, type: '', message: '' });
  const [emailError, setEmailError] = useState('');

  // Get API URL from environment variable
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const showNotification = (type, message) => {
    setNotification({ show: true, type, message });
    setTimeout(() => {  
      setNotification({ show: false, type: '', message: '' });
    }, 5000);
  };

  // Email validation function (trim so spaces don't block submit)
  const validateEmail = (email) => {
    const trimmed = (email || '').trim();
    if (!trimmed) return false;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(trimmed);
  };

  // Update email on change; only clear error when value becomes valid (don't show error while typing)
  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    if (validateEmail(value)) {
      setEmailError('');
    }
  };

  // Validate on blur so we don't show "invalid" until user leaves the field
  const handleEmailBlur = () => {
    if (email && !validateEmail(email)) {
      setEmailError('Please enter a valid email address');
    } else {
      setEmailError('');
    }
  };

  // Check if form is valid (email + consent checkbox required)
  const isFormValid = () => {
    return email.trim() && validateEmail(email) && consent && !isLoading;
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
            <Link href="/" className="">
              <Image src={logo} alt="Mateshwari Moorti Bhandar" className="footer-logo-img" width={200} height={60} priority />
            </Link>
          </div>

          <div className="footer-stay-connected">
            <h3 className="footer-stay-connected-title">Stay Connected With Divinity</h3>

            <form onSubmit={handleEmailSubmit} className="footer-email-form">
              <div className="footer-email-input-wrapper">
                <input
                  type="text"
                  inputMode="email"
                  autoComplete="email"
                  className={`footer-email-input ${emailError ? 'error' : ''}`}
                  placeholder="Enter Your Email Address"
                  value={email}
                  onChange={handleEmailChange}
                  onBlur={handleEmailBlur}
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
                aria-label="Accept terms to subscribe"
              />
              <label htmlFor="footer-consent">
                By Submitting Your Email, You Agree To Receive Advertising Emails From Mateshwari Moorti Bhandar. <span className="footer-consent-required">(Check to enable Subscribe)</span>
              </label>
            </div>

            {/* <div className="footer-social-icons">
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
            </div> */}
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
            <h3 className="footer-column-title">Contact Us</h3>
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

            {/* <h3 className="footer-column-title footer-follow-title">Follow Us</h3>
            <div className="footer-social-icons footer-social-icons-right">
              <a href="https://www.instagram.com/reel/DVA2HgUknfx/?utm_source=ig_web_copy_link" target="_blank" rel="noopener noreferrer" className="footer-social-icon">
                <FaInstagram />
              </a>
              <a href="facebook.com/share/18i5K67wfR/?mibextid=wwXIfr" target="_blank" rel="noopener noreferrer" className="footer-social-icon">
                <FaFacebook />
              </a>
              <a href="https://youtube.com/@mateshwarimoortibhandar?si=aS0wJmJW-7apUe2f" target="_blank" rel="noopener noreferrer" className="footer-social-icon">
                <FaYoutube />
              </a>
            </div> */}
          </div>
        </div>
      </div>

      {/* Google Map Section */}
   <div className="footer-map-section">
  <h3 className="footer-map-title">Visit Our Store</h3>
  
  {/* Anchor tag add kiya hai jo click karne par maps open karega */}
  <a 
    href="https://www.google.com/maps?q=26.922306,75.812611" 
    target="_blank" 
    rel="noopener noreferrer"
    className="footer-map-link"
    style={{ textDecoration: 'none', display: 'block' }}
  >
    <div className="footer-map-wrapper">
      <iframe
        title="Mateshwari Moorti Bhandar Location"
        src="https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d3557.658097587841!2d75.81002777543949!3d26.9223055766418!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zMjbCsDU1JzIwLjMiTiA3NcKwNDgnNDUuNCJF!5e0!3m2!1sen!2sin!4v1710240000000!5m2!1sen!2sin"
        width="100%"
        height="300"
        style={{ 
          border: '1.5px solid #d4af37', 
          borderRadius: '12px', 
          pointerEvents: 'none' // Taaki iframe ke andar ka zoom/scroll click ko block na kare
        }}
        allowFullScreen=""
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      />
      
      {/* Ek overlay text jo user ko bataye ki click karna hai */}
      <div className="map-overlay-text">Click to View on Google Maps</div>
    </div>
  </a>
</div>

      {/* Footer Bottom - Copyright */}
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} Mateshwari Moorti Bhandar. All Rights Reserved.</p>
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
