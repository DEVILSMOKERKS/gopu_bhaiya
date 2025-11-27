import React from 'react';
import './FollowUs.css';

const FollowUs = () => {
  const socialImages = [
    { src: 'https://via.placeholder.com/300x300/8B4513/FFFFFF?text=Post+1', alt: 'Social Media Post 1' },
    { src: 'https://via.placeholder.com/300x300/8B4513/FFFFFF?text=Post+2', alt: 'Social Media Post 2' },
    { src: 'https://via.placeholder.com/300x300/8B4513/FFFFFF?text=Post+3', alt: 'Social Media Post 3' }
  ];

  return (
    <section className="follow-us">
      <div className="container">
        <h2 className="section-title">Follow Us @MATESHWARI EXPORTS</h2>
        <div className="social-grid">
          {socialImages.map((image, index) => (
            <div key={index} className="social-image-card">
              <img 
                src={image.src} 
                alt={image.alt}
                className="social-image"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FollowUs;

