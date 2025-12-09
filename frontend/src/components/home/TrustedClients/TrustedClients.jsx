'use client';

import { useEffect, useRef } from 'react';
import './TrustedClients.css';

const TrustedClients = () => {
  const scrollRef = useRef(null);
  const animationFrameRef = useRef(null);

  const clientLogos = Array.from({ length: 8 }, (_, i) => ({
    id: i + 1,
    name: `Brand ${i + 1}`
  }));

  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;

    const scrollSpeed = 0.5; // Adjust speed here
    let scrollPosition = 0;
    let lastTimestamp = performance.now();

    const autoScroll = (timestamp) => {
      // Calculate delta time for consistent speed
      const deltaTime = timestamp - lastTimestamp;
      lastTimestamp = timestamp;

      // Normalize to ~16ms for 60fps
      const normalizedDelta = deltaTime || 16;
      const scrollIncrement = (scrollSpeed * normalizedDelta) / 16;

      scrollPosition += scrollIncrement;
      scrollContainer.scrollLeft = scrollPosition;

      // Get the width of one set of logos
      const logosContainer = scrollContainer.querySelector('.trusted-clients-logos');
      const singleSetWidth = logosContainer ? logosContainer.scrollWidth / 2 : 0;

      // Reset scroll position seamlessly when reaching the end of first set
      // This creates infinite scroll effect
      if (scrollPosition >= singleSetWidth) {
        scrollPosition = scrollPosition - singleSetWidth;
        scrollContainer.scrollLeft = scrollPosition;
      }

      animationFrameRef.current = requestAnimationFrame(autoScroll);
    };

    animationFrameRef.current = requestAnimationFrame(autoScroll);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  return (
    <section className="trusted-clients">
      <div className="trusted-clients-container">
        <h2 className="trusted-clients-title">Trusted by 1000+ Clients Worldwide</h2>
        <div
          className="trusted-clients-scroll-wrapper"
          ref={scrollRef}
        >
          <div className="trusted-clients-logos">
            {clientLogos.map((client) => (
              <div key={client.id} className="trusted-clients-logo-card">
                <span className="trusted-clients-logo-text">Brand Logo</span>
              </div>
            ))}
            {/* Duplicate for seamless infinite loop */}
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

