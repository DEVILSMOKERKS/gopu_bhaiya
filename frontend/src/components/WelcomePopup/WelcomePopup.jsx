'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import './WelcomePopup.css';
import '../header/expertPopup.css';

const API_URL = typeof process !== 'undefined' ? process.env.NEXT_PUBLIC_API_URL : '';

/** Delay before showing the popup after the page has mounted (ms). */
const POPUP_DELAY_MS = 10_000;

export default function WelcomePopup() {
  const [visible, setVisible] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
  });
  const [status, setStatus] = useState({ loading: false, message: '', type: '' });

  useEffect(() => {
    setMounted(true);
    const t = setTimeout(() => setVisible(true), POPUP_DELAY_MS);
    return () => clearTimeout(t);
  }, []);

  const handleClose = () => {
    setVisible(false);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ loading: true, message: '', type: '' });

    try {
      const response = await axios.post(`${API_URL}/expert-inquiry`, formData);

      setStatus({
        loading: false,
        message: 'Success! Our experts will contact you soon.',
        type: 'success',
      });

      setTimeout(() => {
        setFormData({ name: '', email: '', mobile: '' });
        setStatus({ loading: false, message: '', type: '' });
        handleClose();
      }, 2500);
    } catch (error) {
      console.error('Submission error:', error);
      setStatus({
        loading: false,
        message: error.response?.data?.message || 'Something went wrong. Please try again.',
        type: 'error',
      });
    }
  };

  if (!mounted) return null;

  return (
    <div
      className={`welcome-popup-backdrop ${visible ? 'welcome-popup-backdrop--visible' : ''}`}
      role="dialog"
      aria-modal="true"
      aria-labelledby="welcome-popup-title"
    >
      <div className="welcome-popup-box welcome-popup-box--form">
        <button
          type="button"
          className="welcome-popup-close"
          onClick={handleClose}
          aria-label="Close welcome popup"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>
        <h2 id="welcome-popup-title" className="welcome-popup-title">
          Welcome to Mateshwari Moorti Bhanda
        </h2>
        <p className="welcome-popup-text">
          Discover beautifully handcrafted marble murtis and custom temple designs created by skilled artisans.
        </p>

        <form onSubmit={handleSubmit} className="welcome-popup-form">
          <div className="form-input-group">
            <label>Full Name <span className="optional-label">(optional)</span></label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your name"
            />
          </div>
          <div className="form-input-group">
            <label>Mobile Number <span className="optional-label">(optional)</span></label>
            <input
              type="tel"
              name="mobile"
              value={formData.mobile}
              onChange={handleChange}
              placeholder="+91 XXXXX XXXXX"
            />
          </div>
          <div className="form-input-group">
            <label>Email <span className="optional-label">(optional)</span></label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="example@mail.com"
            />
          </div>
          <button
            type="submit"
            disabled={status.loading}
            className={`welcome-popup-btn welcome-popup-btn--submit ${status.loading ? 'loading' : ''}`}
          >
            {status.loading ? 'Sending...' : 'Ask Our Experts'}
          </button>
          {status.message && (
            <div className={`status-alert ${status.type}`}>
              {status.message}
            </div>
          )}
        </form>
      </div>
    </div>
  );
}