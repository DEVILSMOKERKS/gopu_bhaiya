import React, { useEffect, useRef, useState } from 'react';
import './TrustedClients.css';

const TrustedClients = () => {
  const scrollRef = useRef(null);
  const [isInteracting, setIsInteracting] = useState(false);
  const intervalRef = useRef(null);
  const scrollAmountRef = useRef(0);

  const clientLogos = Array.from({ length: 8 }, (_, i) => ({
    id: i + 1,
    name: `Brand ${i + 1}`
  }));

  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;

    const scrollSpeed = 1; // Adjust speed here

    const autoScroll = () => {
      // Stop scrolling when user is interacting
      if (isInteracting) return;

      scrollAmountRef.current += scrollSpeed;
      scrollContainer.scrollLeft = scrollAmountRef.current;

      // Reset scroll when reaching the end
      const maxScroll = scrollContainer.scrollWidth - scrollContainer.clientWidth;
      if (scrollAmountRef.current >= maxScroll) {
        scrollAmountRef.current = 0;
        scrollContainer.scrollLeft = 0;
      }
    };

    intervalRef.current = setInterval(autoScroll, 20);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isInteracting]);

  // Handle scroll events to pause auto-scroll when user scrolls
  const handleScroll = () => {
    const scrollContainer = scrollRef.current;
    if (scrollContainer) {
      scrollAmountRef.current = scrollContainer.scrollLeft;
      setIsInteracting(true);
      // Resume auto-scroll after 2 seconds of no interaction
      setTimeout(() => {
        setIsInteracting(false);
      }, 2000);
    }
  };

  const handleMouseEnter = () => {
    setIsInteracting(true);
  };

  const handleMouseLeave = () => {
    setIsInteracting(false);
  };

  return (
    <section className="trusted-clients">
      <div className="trusted-clients-container">
        <h2 className="trusted-clients-title">Trusted by 1000+ Clients Worldwide</h2>
        <div
          className="trusted-clients-scroll-wrapper"
          ref={scrollRef}
          onScroll={handleScroll}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <div className="trusted-clients-logos">
            {clientLogos.map((client) => (
              <div key={client.id} className="trusted-clients-logo-card">
                <span className="trusted-clients-logo-text">Brand Logo</span>
              </div>
            ))}
            {/* Duplicate for seamless loop */}
            {clientLogos.map((client) => (
              <div key={`duplicate-${client.id}`} className="trusted-clients-logo-card">
                <span className="trusted-clients-logo-text">Brand Logo</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrustedClients;

