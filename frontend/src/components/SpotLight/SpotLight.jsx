import React from 'react';
import './SpotLight.css';
import spotlightImage from '../../assets/Images/banner/spotLight.jpg';

const SpotLight = () => {
  return (
    <section className="spotlight-section">
      <div className="spotlight-container">
        <h2 className="spotlight-title">Spotlight On</h2>
        <div className="spotlight-banner-container">
          <img 
            src={spotlightImage} 
            alt="Spotlight Collection"
            className="spotlight-banner-image"
          />
        </div>
      </div>
    </section>
  );
};

export default SpotLight;
