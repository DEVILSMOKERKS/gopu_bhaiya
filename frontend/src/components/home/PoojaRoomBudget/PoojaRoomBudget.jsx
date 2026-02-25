'use client';

import { useState } from 'react';
import Image from 'next/image';
import './PoojaRoomBudget.css';
import PricingPanel from '../PricingPanel/PricingPanel';

// 1. Apni saari local images yahan import karein
import mandirImg from '../../../assets/Images/insta/img4.jpeg';
import marbleMandirImg from '../../../assets/Images/insta/img3.jpeg';
import ganesh from '../../../assets/Images/insta/img.jpeg';
import ganesh2 from '../../../assets/Images/insta/img5.jpeg';

// Agar aur images hain toh unhe bhi import karein, e.g.:
// import smallMandirImg from '../../../assets/Images/banner/smallMandir.jpg';

const PoojaRoomBudget = () => {
  const [isPricingPanelOpen, setIsPricingPanelOpen] = useState(false);

  // 2. Array mein seedha imported variable ka naam likhein
  const poojaRooms = [
    {
      id: 1,
      size: 'Small Pooja Rooms upto 50 Sqft',
      price: 'INR 12L',
      image: mandirImg, // Local image use ho rahi hai
    },
    {
      id: 2,
      size: 'Medium Pooja Rooms upto 80 Sqft',
      price: 'INR 20L',
      image: marbleMandirImg, 
    },
    {
      id: 3,
      size: 'Large Pooja Rooms Upto 120sqft',
      price: 'INR 25.75L',
      image: ganesh, 
    },
    {
      id: 4,
      size: 'Grand Pooja Rooms 150sqft',
      price: 'INR 35L',
      image: ganesh2, // Yahan apni 4th image ka variable daal dein
    }
  ];

  const handleUnderstandPricing = () => {
    setIsPricingPanelOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const handleClosePricingPanel = () => {
    setIsPricingPanelOpen(false);
    document.body.style.overflow = 'unset';
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

          <div className="pooja-room-budget-grid">
            {poojaRooms.map((room) => (
              <div key={room.id} className="pooja-room-budget-card">
                <div className="pooja-room-budget-image-wrapper" 
                     style={{ position: 'relative', width: '100%', paddingTop: '130%', overflow: 'hidden', background: '#f5f5f5' }}>
                  
                  {/* Next.js Image component handles local imports automatically */}
                  <Image
                    src={room.image}
                    alt={room.size}
                    className="pooja-room-budget-image"
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                    style={{ objectFit: 'cover' }}
                    placeholder="blur" // Local images ke liye blur effect auto milta hai
                  />

                  <div className="pooja-room-budget-price-overlay">
                    <span className="pooja-room-budget-price">Starting at {room.price}</span>
                  </div>
                  <div className="pooja-room-budget-size-overlay">
                    <span className="pooja-room-budget-size">{room.size}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="pooja-room-budget-cta">
            <button className="pooja-room-budget-button" onClick={handleUnderstandPricing}>
              Understand Pricing
            </button>
          </div>
        </div>
      </section>

      <PricingPanel isOpen={isPricingPanelOpen} onClose={handleClosePricingPanel} />
    </>
  );
};

export default PoojaRoomBudget;