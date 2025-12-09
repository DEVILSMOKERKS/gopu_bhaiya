'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import './ClientDiaries.css';
// Import client images
import Collection1 from '../../../assets/img/Collection/Collection1.jpg';
import Collection2 from '../../../assets/img/Collection/Collection2.jpg';
import Collection3 from '../../../assets/img/Collection/Collection3.jpg';
import Collection4 from '../../../assets/img/Collection/Collection4.jpg';

const ClientDiaries = () => {
  const scrollRef = useRef(null);

  const clientImages = [
    { id: 1, image: Collection1, size: 'medium' },
    { id: 2, image: Collection2, size: 'large' },
    { id: 3, image: Collection3, size: 'small' },
    { id: 4, image: Collection4, size: 'medium' },
    { id: 5, image: Collection1, size: 'small' },
    { id: 6, image: Collection2, size: 'large' },
    { id: 7, image: Collection3, size: 'medium' },
    { id: 8, image: Collection4, size: 'small' },
    { id: 9, image: Collection1, size: 'large' },
    { id: 10, image: Collection2, size: 'medium' },
    { id: 11, image: Collection3, size: 'small' },
    { id: 12, image: Collection4, size: 'medium' },
    { id: 13, image: Collection1, size: 'large' }
  ];

  // Duplicate images for seamless loop
  const duplicatedImages = [...clientImages, ...clientImages];

  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;

    // Start from bottom
    const scrollHeight = scrollContainer.scrollHeight;
    const clientHeight = scrollContainer.clientHeight;
    let scrollPosition = scrollHeight - clientHeight;
    scrollContainer.scrollTop = scrollPosition;

    const scrollSpeed = 0.5;
    let animationId;

    const scroll = () => {
      const currentScrollHeight = scrollContainer.scrollHeight;
      const currentClientHeight = scrollContainer.clientHeight;
      const maxScrollTop = currentScrollHeight - currentClientHeight;

      // Scroll upward (decrease scrollPosition)
      scrollPosition -= scrollSpeed;

      // Reset to bottom when reaching the top for seamless loop
      if (scrollPosition <= 0) {
        scrollPosition = maxScrollTop;
        scrollContainer.scrollTop = maxScrollTop;
      } else {
        scrollContainer.scrollTop = scrollPosition;
      }

      animationId = requestAnimationFrame(scroll);
    };

    // Small delay to ensure container is ready
    setTimeout(() => {
      animationId = requestAnimationFrame(scroll);
    }, 100);

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, []);

  const handleShareStory = () => {
    // Handle share story button click
    console.log('Share Your Story clicked');
  };

  return (
    <section className="client-diaries">
      <div className="client-diaries-container">
        <div className="client-diaries-header">
          <h2 className="client-diaries-title">MATESHWARI EXPORTS Client Diaries</h2>
          <p className="client-diaries-subtitle">
            Share Your #MATESHWARI EXPORTSExperience And Inspire Others With Your Story!
          </p>
          <button className="client-diaries-button" onClick={handleShareStory}>
            Share Your Story
          </button>
        </div>

        <div className="client-diaries-scroll-wrapper" ref={scrollRef}>
          <div className="client-diaries-grid">
            {duplicatedImages.map((client, index) => (
              <div key={`${client.id}-${index}`} className={`client-diaries-card ${client.size}`} style={{ position: 'relative', borderRadius: '12px', overflow: 'hidden' }}>
                <Image
                  src={client.image}
                  alt={`Client ${client.id}`}
                  className="client-diaries-image"
                  fill
                  style={{ objectFit: 'cover' }}
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ClientDiaries;

