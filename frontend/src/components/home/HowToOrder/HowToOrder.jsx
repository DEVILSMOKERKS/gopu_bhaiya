'use client';

import React, { useState } from 'react';
import './HowToOrder.css';
// Import background image - using one of the existing images as placeholder
import backgroundImg from '../../../assets/Images/banner/marbleMandir.jpg';

const HowToOrder = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    city: '',
    aboutYourself: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleRadioChange = (e) => {
    setFormData(prev => ({
      ...prev,
      aboutYourself: e.target.value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission here
    console.log('Form submitted:', formData);
    // You can add API call here
  };

  return (
    <section className="how-to-order">
      <div className="how-to-order-background">
        <img 
          src={backgroundImg} 
          alt="Luxurious interior with marble temple" 
          className="how-to-order-bg-image"
        />
        <div className="how-to-order-overlay"></div>
      </div>
      
      <div className="how-to-order-container">
        <div className="how-to-order-content">
          {/* Left Side - Title */}
          <div className="how-to-order-title-section">
            <h2 className="how-to-order-title">HOW TO ORDER</h2>
          </div>

          {/* Right Side - Form */}
          <div className="how-to-order-form-section">
            <form className="how-to-order-form" onSubmit={handleSubmit}>
              {/* Progress Indicator */}
              <div className="how-to-order-progress">
                <span className="how-to-order-progress-text">1/2</span>
              </div>

              {/* Form Title */}
              <h3 className="how-to-order-form-title">Talk to Our Expert</h3>

              {/* Full Name */}
              <div className="how-to-order-form-group">
                <label htmlFor="fullName" className="how-to-order-label">
                  Full Name <span className="how-to-order-required">*</span>
                </label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  className="how-to-order-input"
                  required
                />
              </div>

              {/* Email Address */}
              <div className="how-to-order-form-group">
                <label htmlFor="email" className="how-to-order-label">
                  Email Address <span className="how-to-order-required">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="how-to-order-input"
                  required
                />
              </div>

              {/* Phone Number */}
              <div className="how-to-order-form-group">
                <label htmlFor="phone" className="how-to-order-label">
                  Phone number
                </label>
                <div className="how-to-order-phone-wrapper">
                  <div className="how-to-order-phone-prefix">
                    <span className="how-to-order-flag">🇮🇳</span>
                    <span className="how-to-order-country-code">+91</span>
                  </div>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="how-to-order-input how-to-order-phone-input"
                    placeholder=""
                  />
                </div>
              </div>

              {/* City */}
              <div className="how-to-order-form-group">
                <label htmlFor="city" className="how-to-order-label">
                  City <span className="how-to-order-required">*</span>
                </label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  className="how-to-order-input"
                  required
                />
              </div>

              {/* Tell us about yourself */}
              <div className="how-to-order-form-group">
                <label className="how-to-order-label">
                  Tell us about yourself <span className="how-to-order-required">*</span>
                </label>
                <div className="how-to-order-radio-group">
                  <div className="how-to-order-radio-option">
                    <input
                      type="radio"
                      id="homeowner"
                      name="aboutYourself"
                      value="homeowner"
                      checked={formData.aboutYourself === 'homeowner'}
                      onChange={handleRadioChange}
                      className="how-to-order-radio"
                      required
                    />
                    <label htmlFor="homeowner" className="how-to-order-radio-label">
                      I am a homeowner looking for a pooja unit or pooja room
                    </label>
                  </div>
                  <div className="how-to-order-radio-option">
                    <input
                      type="radio"
                      id="designer"
                      name="aboutYourself"
                      value="designer"
                      checked={formData.aboutYourself === 'designer'}
                      onChange={handleRadioChange}
                      className="how-to-order-radio"
                      required
                    />
                    <label htmlFor="designer" className="how-to-order-radio-label">
                      I am an interior designer/consultant seeking solutions for my client
                    </label>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <button type="submit" className="how-to-order-submit-btn">
                NEXT
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowToOrder;

