'use client';

import React, { useState } from 'react';
import './PoojaRoomBudget.css';
import PricingPanel from '../PricingPanel/PricingPanel';
// Import local images
import mandirImg from '../../../assets/Images/banner/mandir.jpg';
import marbleMandirImg from '../../../assets/Images/banner/marbleMandir.jpg';
import Image from 'next/image';

const PoojaRoomBudget = () => {
  const [isPricingPanelOpen, setIsPricingPanelOpen] = useState(false);

  const poojaRooms = [
    {
      id: 1,
      size: 'Small Pooja Rooms upto 50 Sqft',
      price: 'INR 12L',
      // Traditional pooja room with white ornate carvings, warm lighting
      image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800&q=90&auto=format&fit=crop'
    },
    {
      id: 2,
      size: 'Medium Pooja Rooms upto 80 Sqft',
      price: 'INR 20L',
      // Modern white and gold pooja room with peacock motif
      image: marbleMandirImg || 'https://images.unsplash.com/photo-1600607687644-c7171b42498b?w=800&q=90&auto=format&fit=crop'
    },
    {
      id: 3,
      size: 'Large Pooja Rooms Upto 120sqft',
      price: 'INR 25.75L',
      // Grand pooja room with dark wooden doors, white altar, gold accents, chandelier
      image: mandirImg || 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=90&auto=format&fit=crop'
    },
    {
      id: 4,
      size: 'Grand Pooja Rooms 150sqft',
      price: 'INR 35L',
      // Most elaborate design with multiple arched sections, fluted columns, white and gold
      image: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=800&q=90&auto=format&fit=crop'
    }
  ];

  const handleUnderstandPricing = () => {
    setIsPricingPanelOpen(true);
    // Prevent body scroll when panel is open
    document.body.style.overflow = 'hidden';
  };

  const handleClosePricingPanel = () => {
    setIsPricingPanelOpen(false);
    // Restore body scroll
    document.body.style.overflow = 'unset';
  };

  return (
    <>
      <section className="pooja-room-budget">
        <div className="pooja-room-budget-container">
          {/* Header Section */}
          <div className="pooja-room-budget-header">
            <h2 className="pooja-room-budget-title">POOJA ROOM FOR EVERY BUDGET</h2>
            <p className="pooja-room-budget-subtitle">
              Discover the perfect pooja room for your home with our curated categories, offering timeless designs at prices that fit every budget.
            </p>
          </div>

          {/* Pooja Room Grid */}
          <div className="pooja-room-budget-grid">
            {poojaRooms.map((room) => (
              <div key={room.id} className="pooja-room-budget-card">
                <div className="pooja-room-budget-image-wrapper">
                  <Image
                    src={room.image}
                    alt={room.size}
                    className="pooja-room-budget-image"
                  />
                  {/* Price Overlay - Top Left */}
                  <div className="pooja-room-budget-price-overlay">
                    <span className="pooja-room-budget-price">Starting at {room.price}</span>
                  </div>
                  {/* Size Overlay - Bottom Left */}
                  <div className="pooja-room-budget-size-overlay">
                    <span className="pooja-room-budget-size">{room.size}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* CTA Button */}
          <div className="pooja-room-budget-cta">
            <button 
              className="pooja-room-budget-button"
              onClick={handleUnderstandPricing}
            >
              Understand Pricing
            </button>
          </div>
        </div>
      </section>

      {/* Pricing Panel */}
      <PricingPanel 
        isOpen={isPricingPanelOpen} 
        onClose={handleClosePricingPanel} 
      />
    </>
  );
};

export default PoojaRoomBudget;

