import React from 'react';
import './HeroSection.css';

const HeroSection = () => {
  return (
    <section className="hero-section">
      <div className="hero-container">
        <div className="hero-image-wrapper">
          <img 
            src="https://via.placeholder.com/800x600/8B4513/FFFFFF?text=Ram+Darbar" 
            alt="Shree Ram Darbar - Lord Rama, Sita, and Lakshmana"
            className="hero-image"
          />
        </div>
        <div className="hero-content">
          <h1 className="hero-title">Shree Ram Darbar</h1>
          <p className="hero-description">
            Exquisite handcrafted marble statues of Lord Rama, Sita, and Lakshmana, 
            beautifully adorned with garlands and jewelry, bringing divine grace to your home.
          </p>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;

