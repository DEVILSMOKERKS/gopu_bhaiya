import React from 'react';
import './who.css';
// import whoBannner from '../../assets/img/who-banner.png'

const Who = () => {
  return (
    <div className="who-container">
      <div className="who-content">
        {/* Left Section - Text Content */}
        <div className="who-text-section">
          <h2 className="who-title">Who We Are</h2>
          <h3 className="who-subtitle">Celebrating Tradition With A Modern Touch</h3>
          <p className="who-description">
            At SAANZ, we believe every woman deserves to feel graceful, confident, and connected to her roots.
            Our collection of kurtis blends timeless Indian craftsmanship with contemporary designs, offering
            styles that are perfect for every occasion — from casual elegance to festive celebrations.
          </p>
          <p className="who-description">
            Each piece is thoughtfully made using quality fabrics, intricate detailing, and vibrant colors
            that reflect the beauty of our rich culture. With us, it's not just fashion — it's a celebration
            of tradition, comfort, and individuality.
          </p>
          <a href="https://saanz.in/About-us" className="who-cta-button" target="_blank" rel="noopener noreferrer">
            View More
          </a>
        </div>

        {/* Right Section - Framed Image */}
        <div className="who-image-section">
          <div className="who-image-frame">
            <img
              src={"https://ik.imagekit.io/adsrc2244/saanz/main-page/who-banner%202.png?updatedAt=1761544773496"}
              className="who-main-image"
            />

          </div>
        </div>
      </div>
    </div>
  );
};

export default Who;
