import React from 'react';
import './WelcomeToTilak.css';
import fullImg from '../../../assets/Images/fullimg.webp';

const WelcomeToTilak = () => {
  return (
    <section className="welcome-tilak-section">
      <div className="welcome-tilak-container">
        <div className="welcome-tilak-image-wrapper">
          <img 
            src={fullImg} 
            alt="Welcome to the World of Tilak" 
            className="welcome-tilak-image"
          />
        </div>
      </div>
    </section>
  );
};

export default WelcomeToTilak;

