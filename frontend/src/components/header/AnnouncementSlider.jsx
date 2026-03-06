'use client';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination } from 'swiper/modules';

// Import Swiper styles
// import 'swiper/css';
// import 'swiper/css/navigation';
// import 'swiper/css/pagination';
import './announcementSlider.css';  // 👈 NAYA CSS IMPORT

const AnnouncementSlider = () => {
  const announcements = [
    {
      id: 1,
      icon: '🪔',
      text: 'DIWALI OFFER',
      highlight: 'FLAT 25% OFF',
      badge: 'LIMITED TIME'
    },
    {
      id: 2,
      icon: '🚚',
      text: 'FREE SHIPPING',
      highlight: 'PAN INDIA',
      badge: 'ABOVE ₹10,000'
    },
    {
      id: 3,
      icon: '✨',
      text: 'SPECIAL OFFER',
      highlight: 'BUY 2 GET 1 FREE',
      badge: 'ON POOJA SETS'
    },
    {
      id: 4,
      icon: '🔔',
      text: 'NEW ARRIVALS',
      highlight: 'MARBLE GANESHA',
      badge: 'PREMIUM COLLECTION'
    }
  ];

  return (
    <div className="announcement-slider">
      <Swiper
        modules={[Autoplay, Navigation, Pagination]}
        spaceBetween={0}
        slidesPerView={1}
        navigation={true}
        pagination={{ clickable: true }}
        autoplay={{
          delay: 3000,
          disableOnInteraction: false,
        }}
        loop={true}
        speed={800}
      >
        {announcements.map((item) => (
          <SwiperSlide key={item.id}>
            <div className="announcement-slide-content">
              <span className="announcement-icon">{item.icon}</span>
              <span className="announcement-text">{item.text}</span>
              <span className="announcement-highlight">{item.highlight}</span>
              <span className="announcement-badge">{item.badge}</span>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default AnnouncementSlider;