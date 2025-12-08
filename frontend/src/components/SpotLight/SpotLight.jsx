import React from 'react';
import './SpotLight.css';
import spotlightImage from '../../assets/Images/banner/spotLight.jpg';
import Image from 'next/image';

const SpotLight = () => {
  return (
    <section className="spotlight-section">
      <div className="spotlight-container">
        <h2 className="spotlight-title">Spotlight On</h2>
        <div className="spotlight-banner-container" style={{ position: 'relative', width: '100%', maxWidth: '100%', margin: '0 auto', borderRadius: '12px', aspectRatio: '16 / 9' }}>
          <Image
            src={spotlightImage}
            alt="Spotlight Collection"
            className="spotlight-banner-image"
            fill
            style={{ objectFit: 'cover', borderRadius: '12px' }}
          />
        </div>
      </div>
    </section>
  );
};

export default SpotLight;
