'use client';

import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import './OurVision.css';
import ourVisionBgDesktop1 from '../../../assets/Images/banner/our-vision-bg-desktop1.png';
import ourVisionBgDesktop2 from '../../../assets/Images/banner/our-vision-bg-desktop2.png';
import ourVisionBgMobile from '../../../assets/Images/banner/our-vision-bg-mobile.png';
import about1 from '../../../assets/img/who-banner.png';

const OurVision = () => {
  const router = useRouter();

  const handleViewMore = () => {
    router.push('/about-us');
  };

  const sectionStyle = {
    '--desktop-bg-left': ourVisionBgDesktop1 ? `url(${ourVisionBgDesktop1})` : 'none',
    '--desktop-bg-right': ourVisionBgDesktop2 ? `url(${ourVisionBgDesktop2})` : 'none',
    '--mobile-bg': ourVisionBgMobile ? `url(${ourVisionBgMobile})` : 'none'
  };

  return (
    <section className="our-vision" style={sectionStyle}>
      <div className="our-vision-container">
        <div className="our-vision-content">
          {/* Left Section - Text Content */}
          <div className="our-vision-text-section">
            <h2 className="our-vision-title">Our Vision</h2>
            <h3 className="our-vision-subtitle">
              Bringing Your Dream Temple To Life With Welcome To Mateshwari Moorti Bhanda
            </h3>
            <p className="our-vision-description">
              At Welcome To Mateshwari Moorti Bhanda, we harmonize tradition, craftsmanship, and innovation to create timeless Pooja Room experiences. For the first time in the industry, we introduce a fully immersive virtual tour of our sacred spaces—designed to bring our artistry to your screen, wherever you are.
            </p>

            <div className="our-vision-features">
              <div className="our-vision-feature-item">
                <strong>Timeless Craftsmanship</strong> - Blending tradition with innovation to create sacred Pooja Rooms.
              </div>
              <div className="our-vision-feature-item">
                <strong>Virtual Tour Experience</strong> - Explore our designs from anywhere with an immersive tour.
              </div>
              <div className="our-vision-feature-item">
                <strong>Custom Designs</strong> - Tailored Pooja Room layouts that reflect your vision.
              </div>
              <div className="our-vision-feature-item">
                <strong>Superior Craftsmanship</strong> - Intricate detailing and premium materials used in every creation.
              </div>
              <div className="our-vision-feature-item">
                <strong>Transform Your Home</strong> - Bring a divine aura to your space with our Pooja Rooms.
              </div>
            </div>

            <button className="our-vision-cta-button" onClick={handleViewMore}>
              View More
            </button>
          </div>

          {/* Right Section - Images */}
          <div className="our-vision-image-section">
            <div className="our-vision-image-wrapper" style={{ position: 'relative', width: '100%', maxWidth: '600px', height: '450px' }}>
              {about1 ? (
                <Image
                  className="our-vision-main-image"
                  src={about1}
                  alt="Our Vision"
                  fill
                  style={{ objectFit: 'cover', filter: 'drop-shadow(0 0 3px var(--primary-color))' }}
                />
              ) : (
                <div className="our-vision-image-placeholder our-vision-main-image">
                  <span>Our Vision</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OurVision;
