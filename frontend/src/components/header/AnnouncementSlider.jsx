'use client';

import './announcementSlider.css';

const AnnouncementSlider = () => {
  const announcements = [
    'FREE SHIPPING PAN INDIA',
    '100% AUTHENTIC HANDMADE PIECES',
    'SHIPPING NATIONWIDE ABOVE ₹10,000',
    'SPECIAL OFFERS ON POOJA SETS',
    'NEW ARRIVALS • MARBLE GANESHA • PREMIUM COLLECTION',
    'FLAT 25% OFF LIMITED TIME',
  ];

  // Repeat for seamless marquee loop
  const repeatedItems = [...announcements, ...announcements];

  return (
    <div className="marquee-container">
      <div className="marquee-content">
        {repeatedItems.map((text, index) => (
          <span key={index} className="marquee-item">
            {text}
          </span>
        ))}
      </div>
    </div>
  );
};

export default AnnouncementSlider;
