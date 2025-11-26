import React, { useState, useEffect } from 'react'
import './ComingSoon.css'
import logo from '../assets/img/logo.png'

const ComingSoon = () => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    // Set target date to September 27th, 2025 at 12:00 PM
    const targetDate = new Date('2025-09-27T12:00:00');

    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetDate.getTime() - now;

      if (distance > 0) {
        setTimeLeft({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000)
        });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="coming-soon-container">
      {/* Luxury Background */}
      <div className="luxury-background">
        <div className="gradient-overlay"></div>
        <div className="geometric-pattern"></div>
        <div className="floating-particles"></div>
      </div>
      
      {/* Main Content */}
      <div className="main-content">
        {/* Header Section */}
        <div className="header-section">
          <div className="logo-container">
            {/* <div className="logo-circle">
              <h1 className="brand-name">
                <img src={logo} alt="" />
              </h1>
            </div> */}
            <div className="brand-info">
              <h2 className="brand-title">Saanz</h2>
              <div className="brand-tagline">Premium Fashion & Lifestyle</div>
            </div>
          </div>
        </div>

        {/* Hero Section */}
        <div className="hero-section">
          <div className="hero-contentcoming">
            <h1 className="hero-title">
              <span className="title-line">Something</span>
              <span className="title-line">Extraordinary</span>
              <span className="title-line">Is Coming</span>
            </h1>
            <p className="hero-description">
              We're crafting a world of luxury, style, and innovation. 
              Get ready to experience fashion redefined.
            </p>
          </div>
        </div>

        {/* Countdown Section */}
        <div className="countdown-section">
          <div className="countdown-header">
            <h3 className="countdown-title">Launch Date</h3>
            <div className="launch-date">September 27, 2025 • 12:00 PM</div>
          </div>
          <div className="countdown-timer">
            <div className="countdown-item">
              <div className="countdown-number">{timeLeft.days}</div>
              <div className="countdown-label">Days</div>
            </div>
            <div className="countdown-separator"></div>
            <div className="countdown-item">
              <div className="countdown-number">{timeLeft.hours}</div>
              <div className="countdown-label">Hours</div>
            </div>
            <div className="countdown-separator"></div>
            <div className="countdown-item">
              <div className="countdown-number">{timeLeft.minutes}</div>
              <div className="countdown-label">Minutes</div>
            </div>
            <div className="countdown-separator"></div>
            <div className="countdown-item">
              <div className="countdown-number">{timeLeft.seconds}</div>
              <div className="countdown-label">Seconds</div>
            </div>
          </div>
        </div>

        {/* Newsletter Section */}
        <div className="newsletter-section">
          <div className="newsletter-content">
            <h3 className="newsletter-title">Join the Elite</h3>
            <p className="newsletter-description">
              Be among the first to experience luxury redefined. 
              Exclusive early access awaits.
            </p>
            <div className="newsletter-form">
              <div className="input-group">
                <input 
                  type="email" 
                  placeholder="Enter your email address" 
                  className="newsletter-input"
                  id="newsletter-email"
                />
                <button 
                  className="newsletter-button"
                  onClick={() => {
                    const email = document.getElementById('newsletter-email').value;
                    if (email && email.includes('@')) {
                      alert('Welcome to the elite! We\'ll notify you when we launch.');
                      document.getElementById('newsletter-email').value = '';
                    } else {
                      alert('Please enter a valid email address.');
                    }
                  }}
                >
                  <span>Join Now</span>
                  <i className="fas fa-arrow-right"></i>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Social Section */}
        {/* <div className="social-section">
          <div className="social-content">
            <div className="social-title">Follow Our Journey</div>
            <div className="social-links">
              <a href="#" className="social-link">
                <i className="fab fa-instagram"></i>
              </a>
              <a href="#" className="social-link">
                <i className="fab fa-facebook"></i>
              </a>
              <a href="#" className="social-link">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="#" className="social-link">
                <i className="fab fa-youtube"></i>
              </a>
            </div>
          </div>
        </div> */}
      </div>

      {/* Luxury Accents */}
      <div className="luxury-accents">
        <div className="accent-line accent-line-1"></div>
        <div className="accent-line accent-line-2"></div>
        <div className="accent-circle accent-circle-1"></div>
        <div className="accent-circle accent-circle-2"></div>
      </div>
    </div>
  )
}

export default ComingSoon
