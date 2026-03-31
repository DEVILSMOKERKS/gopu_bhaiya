'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Navigation, Autoplay } from 'swiper/modules';

// Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

import './PoojaRoomBudget.css';
import PricingPanel from '../PricingPanel/PricingPanel';

// Imports wahi hain
import mandirImg from '../../../assets/img/Collection/Collection1.jpg';
import marbleMandirImg from '../../../assets/Images/insta/img3.jpeg';
import ganesh from '../../../assets/Images/insta/img.jpeg';
import ganesh2 from '../../../assets/Images/insta/img5.jpeg';

const PoojaRoomBudget = () => {
  const [isPricingPanelOpen, setIsPricingPanelOpen] = useState(false);

  const poojaRooms = [
    { id: 1, size: 'Small Pooja Rooms upto 50 Sqft', price: 'INR 12L', image: mandirImg },
    { id: 2, size: 'Medium Pooja Rooms upto 80 Sqft', price: 'INR 20L', image: marbleMandirImg },
    { id: 3, size: 'Large Pooja Rooms Upto 120sqft', price: 'INR 25.75L', image: ganesh },
    { id: 4, size: 'Grand Pooja Rooms 150sqft', price: 'INR 35L', image: ganesh2 },
    // 3 Extra images (Inhe tu apne assets se replace kar lena)
    { id: 5, size: 'Luxury Pooja Rooms 200sqft', price: 'INR 45L', image: mandirImg },
    { id: 6, size: 'Elite Pooja Rooms 250sqft', price: 'INR 55L', image: marbleMandirImg },
    { id: 7, size: 'Premium Pooja Rooms 300sqft', price: 'INR 65L', image: ganesh },
  ];

  const handleUnderstandPricing = () => {
    setIsPricingPanelOpen(true);
    document.body.style.overflow = 'hidden';
  };

  return (
    <>
      <section className="pooja-room-budget">
        <div className="pooja-room-budget-container">
          <div className="pooja-room-budget-header">
            <h2 className="pooja-room-budget-title">POOJA ROOM FOR EVERY BUDGET</h2>
            <p className="pooja-room-budget-subtitle">
              Discover the perfect pooja room for your home with our curated categories.
            </p>
          </div>  

          <Swiper
            modules={[Pagination, Navigation, Autoplay]}
            spaceBetween={20}
            slidesPerView={1}
            navigation={true}
            pagination={{ clickable: true }}
            autoplay={{ delay: 3000, disableOnInteraction: false }}
            breakpoints={{
              640: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
              1280: { slidesPerView: 4 },
            }}
            className="pooja-room-swiper"
          >
            {poojaRooms.map((room) => (
              <SwiperSlide key={room.id}>
                <div className="pooja-room-budget-card">
                  <div className="pooja-room-budget-image-wrapper">
                    <Image
                      src={room.image}
                      alt={room.size}
                      className="pooja-room-budget-image"
                      fill
                      sizes="(max-width: 768px) 100vw, 25vw"
                      style={{ objectFit: 'cover' }}
                      placeholder="blur"
                    />
                    <div className="pooja-room-budget-price-overlay">
                      <span className="pooja-room-budget-price">Starting at {room.price}</span>
                    </div>
                    <div className="pooja-room-budget-size-overlay">
                      <span className="pooja-room-budget-size">{room.size}</span>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          <div className="pooja-room-budget-cta">
            <button className="pooja-room-budget-button" onClick={handleUnderstandPricing}>
              Understand Pricing
            </button>
          </div>
        </div>
      </section>
      <PricingPanel isOpen={isPricingPanelOpen} onClose={() => {
        setIsPricingPanelOpen(false);
        document.body.style.overflow = 'unset';
      }} />
    </>
  );
};

export default PoojaRoomBudget;