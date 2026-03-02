import React from 'react';
import './FollowUs.css';
// Import follow images
import Follow1 from '../../../assets/Images/insta/img5.jpeg';
import Follow2 from '../../../assets/Images/insta/img4.jpeg';
import Follow3 from '../../../assets/Images/insta/img3.jpeg';
import Follow4 from '../../../assets/Images/insta/img2.jpeg';
import Follow5 from '../../../assets/Images/insta/img.jpeg';
import Image from 'next/image';

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
        <h2 className="follow-us-title">Follow Us @MATESHWARI Moorti Bhandar</h2>

        <div className="follow-us-grid">
          {/* Large left image for desktop */}
          <div className="follow-us-main-image" style={{ position: 'relative', overflow: 'hidden', aspectRatio: '1 / 1' }}>
            <Image
              src={Follow1}
              alt="Marble Temple Design"
              className="follow-us-image"
              fill
              style={{ objectFit: 'cover' }}
            />
          </div>

          {/* 2x2 Grid for right side (desktop) / bottom (mobile) */}
          <div className="follow-us-grid-right">
            {followImages.map((image) => (
              <div key={image.id} className="follow-us-image-card" style={{ position: 'relative', overflow: 'hidden', aspectRatio: '1 / 1' }}>
                <Image
                  src={image.src}
                  alt={image.alt}
                  className="follow-us-image"
                  fill
                  style={{ objectFit: 'cover' }}
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

