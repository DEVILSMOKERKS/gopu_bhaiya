import React from 'react';
import './FollowUs.css';
// Import follow images
import Follow1 from '../../../assets/Images/follow/follow1.jpg';
import Follow2 from '../../../assets/Images/follow/follow2.jpg';
import Follow3 from '../../../assets/Images/follow/follow3.jpg';
import Follow4 from '../../../assets/Images/follow/follow4.jpg';
import Follow5 from '../../../assets/Images/follow/follow5.jpg';

const FollowUs = () => {
  const followImages = [
    { id: 2, src: Follow2, alt: 'Saraswati Murti' },
    { id: 3, src: Follow3, alt: 'Ganesha Murti' },
    { id: 4, src: Follow4, alt: 'Marble Home Temple' },
    { id: 5, src: Follow5, alt: 'Marble Home Temple' }
  ];

  return (
    <section className="follow-us">
      <div className="follow-us-container">
        <h2 className="follow-us-title">Follow Us @MATESHWARI EXPORTS</h2>

        <div className="follow-us-grid">
          {/* Large left image for desktop */}
          <div className="follow-us-main-image">
            <img
              src={Follow1}
              alt="Marble Temple Design"
              className="follow-us-image"
            />
          </div>

          {/* 2x2 Grid for right side (desktop) / bottom (mobile) */}
          <div className="follow-us-grid-right">
            {followImages.map((image) => (
              <div key={image.id} className="follow-us-image-card">
                <img
                  src={image.src}
                  alt={image.alt}
                  className="follow-us-image"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FollowUs;

