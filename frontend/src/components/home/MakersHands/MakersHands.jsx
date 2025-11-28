import React from 'react';
import './MakersHands.css';
import makersHandsBg from '../../../assets/Images/banner/makers-hands-bg.jpg';
import makersHandsBgMobile from '../../../assets/Images/banner/makers-hands-bg-mobile.png';

const MakersHands = () => {
  const features = [
    {
      icon: (
        <svg width="60" height="60" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Lion icon - Made in India */}
          <path d="M12 4C10 4 8 5 7 7C6 8 5 10 5 12C5 14 6 16 7 17C8 18 9 19 11 19C13 19 14 18 15 17C16 16 17 14 17 12C17 10 16 8 15 7C14 5 12 4 12 4Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M9 8C9 8 10 9 12 9C14 9 15 8 15 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M8 12L10 14L12 12L14 14L16 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M7 15L9 17L11 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M13 15L15 17L17 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="10" cy="10" r="1" fill="currentColor" />
          <circle cx="14" cy="10" r="1" fill="currentColor" />
        </svg>
      ),
      title: "Made in India"
    },
    {
      icon: (
        <svg width="60" height="60" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Craftsman icon */}
          <circle cx="12" cy="8" r="3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M6 21V19C6 16.7909 7.79086 15 10 15H14C16.2091 15 18 16.7909 18 19V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M8 12L10 10L12 12L14 10L16 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <rect x="4" y="18" width="4" height="3" rx="1" stroke="currentColor" strokeWidth="2" />
          <rect x="16" y="18" width="4" height="3" rx="1" stroke="currentColor" strokeWidth="2" />
          <path d="M10 12L8 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <path d="M14 12L16 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      ),
      title: "Hand-crafted by experienced veterans"
    },
    {
      icon: (
        <svg width="60" height="60" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Multiple busts/statues icon */}
          <circle cx="6" cy="8" r="2.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M6 10.5V14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="12" cy="8" r="2.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M12 10.5V14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="18" cy="8" r="2.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M18 10.5V14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M3 14H9M9 14H15M15 14H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <text x="12" y="18" fontSize="8" fill="currentColor" textAnchor="middle" fontWeight="bold">+</text>
        </svg>
      ),
      title: "Crafted over 5,000,000+ products"
    },
    {
      icon: (
        <svg width="60" height="60" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Diverse figures icon */}
          <circle cx="6" cy="7" r="2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M6 9V12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M4 12H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <circle cx="12" cy="7" r="2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M12 9V12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M10 12H14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <circle cx="18" cy="7" r="2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M18 9V15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M16 12H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <path d="M6 12V16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M12 12V16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
      title: "Diversity within each statue"
    }
  ];

  const sectionStyle = {
    '--desktop-bg': makersHandsBg ? `url(${makersHandsBg})` : 'none',
    '--mobile-bg': makersHandsBgMobile ? `url(${makersHandsBgMobile})` : 'none'
  };

  return (
    <section
      className="makers-hands"
      style={sectionStyle}
    >
      <div className="makers-hands-overlay">
        <div className="makers-hands-container">
          <div className="makers-hands-features-grid">
            {features.map((feature, index) => (
              <div key={index} className="makers-hands-feature-card">
                <div className="makers-hands-feature-icon">
                  {feature.icon}
                </div>
                <h3 className="makers-hands-feature-title">{feature.title}</h3>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default MakersHands;
