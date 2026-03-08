'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import './ConnectSoonPopup.css';

const ConnectSoonPopup = ({ onClose }) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [productInterest, setProductInterest] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null); // 'success' | 'error' | null

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim() || !email.trim()) return;

    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const response = await axios.post(`${API_URL}/contact-us`, {
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        subject: "We'll Connect Soon - Get in Touch",
        message: productInterest.trim()
          ? `Product interest: ${productInterest.trim()}\n\nSubmitted via Connect Soon popup.`
          : "I'd like to connect. Please reach out to me. Submitted via Connect Soon popup.",
      });

      if (response.data?.success) {
        setSubmitStatus('success');
        localStorage.setItem('connectSoon_submitted', 'true');
        setTimeout(() => onClose(), 2500);
      } else {
        setSubmitStatus('error');
      }
    } catch (err) {
      console.error('Connect Soon submit error:', err);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDismiss = () => {
    localStorage.setItem('connectSoon_dismissed', 'true');
    onClose();
  };

  return (
    <div className="connect-soon-overlay" onClick={handleDismiss}>
      <div className="connect-soon-modal" onClick={(e) => e.stopPropagation()}>
        <button
          type="button"
          className="connect-soon-close"
          onClick={handleDismiss}
          aria-label="Close"
        >
          ×
        </button>

        <div className="connect-soon-content">
          <div className="connect-soon-header">
            <h2 className="connect-soon-title">We&apos;ll Connect Soon</h2>
            <p className="connect-soon-subtitle">
              Share your details and we&apos;ll get back to you within 24-48 hours.
            </p>
          </div>

          {submitStatus === 'success' ? (
            <div className="connect-soon-success">
              <span className="connect-soon-success-icon">✓</span>
              <p>Thank you! We&apos;ve received your details and will reach out soon.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="connect-soon-form">
              <div className="connect-soon-field">
                <label htmlFor="connect-name">Name *</label>
                <input
                  id="connect-name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                  required
                  disabled={isSubmitting}
                />
              </div>
              <div className="connect-soon-field">
                <label htmlFor="connect-phone">Phone Number *</label>
                <input
                  id="connect-phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="10-digit mobile number"
                  minLength={10}
                  maxLength={15}
                  required
                  disabled={isSubmitting}
                />
              </div>
              <div className="connect-soon-field">
                <label htmlFor="connect-email">Email *</label>
                <input
                  id="connect-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  required
                  disabled={isSubmitting}
                />
              </div>
              <div className="connect-soon-field">
                <label htmlFor="connect-product">Product Interest (Optional)</label>
                <input
                  id="connect-product"
                  type="text"
                  value={productInterest}
                  onChange={(e) => setProductInterest(e.target.value)}
                  placeholder="e.g. Marble Ganesha, Pooja Sets..."
                  disabled={isSubmitting}
                />
              </div>
              {submitStatus === 'error' && (
                <p className="connect-soon-error">
                  Something went wrong. Please try again or contact us directly.
                </p>
              )}
              <button
                type="submit"
                className="connect-soon-submit"
                disabled={isSubmitting || !name.trim() || !phone.trim() || !email.trim()}
              >
                {isSubmitting ? 'Submitting...' : 'Submit'}
              </button>
              <button
                type="button"
                className="connect-soon-skip"
                onClick={handleDismiss}
                disabled={isSubmitting}
              >
                Maybe later
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ConnectSoonPopup;
