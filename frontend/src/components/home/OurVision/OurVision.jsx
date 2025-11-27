import React from 'react';
import './OurVision.css';

const OurVision = () => {
  return (
    <section className="our-vision">
      <div className="container">
        <h2 className="section-title">Our Vision</h2>
        <div className="vision-content">
          <div className="vision-text">
            <p>
              Our vision is to preserve and promote the rich cultural heritage of India 
              through exquisite handcrafted marble idols and temple structures. We strive 
              to bring the divine grace of traditional Indian craftsmanship to homes and 
              temples worldwide, ensuring that every piece tells a story of devotion, 
              artistry, and timeless beauty.
            </p>
            <p>
              With a commitment to quality, authenticity, and customer satisfaction, 
              we aim to be the trusted partner for all your spiritual and cultural needs, 
              connecting hearts with the divine through our masterfully crafted creations.
            </p>
          </div>
          <div className="vision-images">
            <div className="vision-image-grid">
              <div className="vision-image-item">
                <img 
                  src="https://via.placeholder.com/300x300/8B4513/FFFFFF?text=Idol+1" 
                  alt="Saraswati Idol"
                />
              </div>
              <div className="vision-image-item">
                <img 
                  src="https://via.placeholder.com/300x300/8B4513/FFFFFF?text=Idol+2" 
                  alt="Temple Setup"
                />
              </div>
              <div className="vision-image-item">
                <img 
                  src="https://via.placeholder.com/300x300/8B4513/FFFFFF?text=Idol+3" 
                  alt="Deity Statue"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OurVision;

