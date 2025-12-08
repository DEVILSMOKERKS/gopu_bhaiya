'use client';

import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import { useRouter } from 'next/navigation';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import './ExploreCollectionCarousel.css';
import Image from 'next/image';

const ExploreCollectionCarousel = ({ collections }) => {
  const router = useRouter();

  const handleImageClick = (category) => {
    router.push(`/shop?category=${category}`);
  };

  return (
    <div className="explore-collection-carousel-wrapper">
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        spaceBetween={20}
        slidesPerView={1}
        navigation={{
          nextEl: '.explore-collection-swiper-button-next',
          prevEl: '.explore-collection-swiper-button-prev',
        }}
        pagination={{
          clickable: true,
          el: '.explore-collection-swiper-pagination',
          bulletClass: 'explore-collection-swiper-bullet',
          bulletActiveClass: 'explore-collection-swiper-bullet-active',
        }}
        autoplay={{
          delay: 3000,
          disableOnInteraction: false,
        }}
        loop={true}
        className="explore-collection-swiper"
      >
        {collections.map((collection) => (
          <SwiperSlide key={collection.id} className="explore-collection-swiper-slide">
            <div
              className="explore-collection-carousel-card"
              onClick={() => handleImageClick(collection.category)}
            >
              <div className="explore-collection-carousel-image-container">
                <Image
                  src={collection.image}
                  alt={`${collection.category} collection`}
                  className="explore-collection-carousel-image"
                />
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Custom Navigation Buttons */}
      <div className="explore-collection-swiper-button-prev explore-collection-swiper-button">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      <div className="explore-collection-swiper-button-next explore-collection-swiper-button">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>

      {/* Custom Pagination */}
      <div className="explore-collection-swiper-pagination"></div>
    </div>
  );
};

export default ExploreCollectionCarousel;
