import React from 'react';
import Image from 'next/image';
import './WelcomeToTilak.css';
import fullImg from '../../../assets/Images/fullimg.webp';

const WelcomeToTilak = () => {
  return (
    <section className="welcome-tilak-section">
      <div className="welcome-tilak-container">
        <div className="welcome-tilak-image-wrapper">
          <Image
            src={fullImg}
            alt="Welcome to the World of Tilak"
            className="welcome-tilak-image"
            fill
            style={{ objectFit: 'cover' }}
          />
        </div>
      </div>
    </section>
  );
};

export default WelcomeToTilak;










