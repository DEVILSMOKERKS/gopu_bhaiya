import React from 'react';
import { HiX } from 'react-icons/hi';
import './PricingPanel.css';
import mandirImg from '../../../assets/Images/banner/mandir.jpg';
import marbleMandirImg from '../../../assets/Images/banner/marbleMandir.jpg';

const PricingPanel = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div className="pricing-panel-backdrop" onClick={onClose}></div>
      
      {/* Slide-in Panel */}
      <div className={`pricing-panel ${isOpen ? 'open' : ''}`}>
        {/* Close Button */}
        <button className="pricing-panel-close" onClick={onClose} aria-label="Close">
          <HiX />
        </button>

        {/* Panel Content */}
        <div className="pricing-panel-content">
          {/* Header Section */}
          <div className="pricing-panel-header">
            <h1 className="pricing-panel-main-title">
              UNDERSTANDING THE PRICING OF OUR DREAM TEMPLES & POOJA ROOMS
            </h1>
            <h2 className="pricing-panel-subtitle">
              WHERE ELEGANCE MEETS DEVOTION - A GLIMPSE INTO OUR PRICING PHILOSOPHY
            </h2>
            <p className="pricing-panel-intro">
              At Tilak Stone Arts, each temple and pooja room is a masterpiece, designed to bring peace and sanctity to your home. Our pricing reflects the custom craftsmanship, premium materials, and unparalleled artistry that go into creating a sacred space tailored exclusively for you.
            </p>
          </div>

          {/* Images Section */}
          <div className="pricing-panel-images">
            {/* Left Image - Small Pooja Room */}
            <div className="pricing-panel-image-left">
              <div className="pricing-image-wrapper">
                <img 
                  src="https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800&q=90&auto=format&fit=crop" 
                  alt="Small Pooja Room upto 50 Sqft" 
                  className="pricing-image"
                />
                {/* Price Overlay - Top Left */}
                <div className="pricing-overlay-top">
                  <span className="pricing-overlay-price">Starting at INR 12L</span>
                </div>
                {/* Size Overlay - Bottom Left */}
                <div className="pricing-overlay-bottom">
                  <span className="pricing-overlay-size">Small Pooja Rooms upto 50 Sqft</span>
                </div>
              </div>
            </div>

            {/* Right Image - Elaborate Pooja Room */}
            <div className="pricing-panel-image-right">
              <div className="pricing-image-wrapper">
                <img 
                  src={marbleMandirImg || "https://images.unsplash.com/photo-1600607687644-c7171b42498b?w=1200&q=90&auto=format&fit=crop"} 
                  alt="Elaborate Pooja Room with Peacock Motif" 
                  className="pricing-image"
                />
              </div>
            </div>
          </div>

          {/* Additional Content */}
          <div className="pricing-panel-footer">
            <h3 className="pricing-footer-title">EXPERIENCE THE FUTURE</h3>
            <p className="pricing-footer-text">
              At Tilak Stone Arts (TSA), we blend traditional craftsmanship with modern design principles to create timeless spiritual spaces that honor both your devotion and your aesthetic vision.
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default PricingPanel;



