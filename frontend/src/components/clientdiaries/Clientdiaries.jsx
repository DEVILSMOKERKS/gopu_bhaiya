import React, { useEffect, useRef } from 'react';
import Image from 'next/image';
import './clientdiaries.css';
import Collection1 from '../../assets/img/Collection/Collection1.jpg';
import Collection2 from '../../assets/img/Collection/Collection2.jpg';
import Collection3 from '../../assets/img/Collection/Collection3.jpg';
import Collection4 from '../../assets/img/Collection/Collection4.jpg';

const Clientdiaries = () => {
  const scrollRef = useRef(null);

  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;

    let scrollPosition = 0;
    let direction = 1; // 1 for down (bottom to top), -1 for up (top to bottom)
    const scrollSpeed = 0.5; // Reduced speed for smoother movement
    let animationId;

    const scroll = () => {
      const scrollHeight = scrollContainer.scrollHeight;
      const clientHeight = scrollContainer.clientHeight;
      const maxScrollTop = scrollHeight - clientHeight;

      scrollPosition += direction * scrollSpeed;

      // Smooth direction change with buffer zone
      if (scrollPosition >= maxScrollTop - 50) {
        direction = -1; // Start scrolling up (top to bottom)
      } else if (scrollPosition <= 50) {
        direction = 1; // Start scrolling down (bottom to top)
      }

      scrollContainer.scrollTop = scrollPosition;
      animationId = requestAnimationFrame(scroll);
    };

    // Start the animation
    animationId = requestAnimationFrame(scroll);

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, []);

  const clientImages = [
    {
      id: 1,
      src: Collection1,
      alt: "Client wearing traditional jewelry",
      size: "large"
    },
    {
      id: 2,
      src: Collection2,
      alt: "Beautiful bride with gold jewelry",
      size: "medium"
    },
    {
      id: 3,
      src: Collection3,
      alt: "Elegant necklace display",
      size: "small"
    },
    {
      id: 4,
      src: Collection4,
      alt: "Traditional wedding jewelry",
      size: "medium"
    },
    {
      id: 5,
      src: Collection1,
      alt: "Client testimonial photo",
      size: "large"
    },
    {
      id: 6,
      src: Collection2,
      alt: "Gold earrings showcase",
      size: "small"
    },
    {
      id: 7,
      src: Collection3,
      alt: "Happy couple with jewelry",
      size: "medium"
    },
    {
      id: 8,
      src: Collection4,
      alt: "Bridal jewelry collection",
      size: "large"
    },
    {
      id: 9,
      src: Collection1,
      alt: "Traditional gold necklace",
      size: "small"
    },
    {
      id: 10,
      src: Collection2,
      alt: "Customer with Mateshwari Moorti Bhandar idols",
      size: "medium"
    },
    {
      id: 11,
      src: Collection3,
      alt: "Elegant bride portrait",
      size: "large"
    },
    {
      id: 12,
      src: Collection4,
      alt: "Diamond jewelry showcase",
      size: "small"
    },
    {
      id: 13,
      src: Collection1,
      alt: "Client wearing traditional jewelry",
      size: "medium"
    },
    {
      id: 14,
      src: Collection2,
      alt: "Beautiful bride with gold jewelry",
      size: "large"
    },
    {
      id: 15,
      src: Collection3,
      alt: "Elegant necklace display",
      size: "small"
    },
    {
      id: 16,
      src: Collection4,
      alt: "Traditional wedding jewelry",
      size: "medium"
    },
    {
      id: 17,
      src: Collection1,
      alt: "Client testimonial photo",
      size: "large"
    },
    {
      id: 18,
      src: Collection2,
      alt: "Gold earrings showcase",
      size: "small"
    }
  ];

  return (
    <div className="clientdiaries-carousel-container">
      <div className="clientdiaries-carousel-content" ref={scrollRef}>
        <div className="clientdiaries-client-grid">
          {clientImages.map((image) => (
            <div key={image.id} className={`clientdiaries-client-image-card ${image.size}`}>
              <Image
                src={image.src}
                alt={image.alt}
                className="clientdiaries-client-image"
                loading="lazy"
              />
              <div className="clientdiaries-image-overlay"></div>
            </div>
          ))}
        </div>
      </div>

      <div className="clientdiaries-carousel-header">
        <div className="clientdiaries-carousel-title-wrapper">
          <span className="clientdiaries-carousel-title-line"></span>
          <h2 className="clientdiaries-carousel-title">MATESHWARI MOORTI BHANDAR CLIENT DIARIES</h2>
          <span className="clientdiaries-carousel-title-line"></span>
        </div>
        <p className="clientdiaries-carousel-subtitle">
          Share Your #MateshwariMoortiBhandarExperience And Inspire Others With Your Story!
        </p>
        <button className="clientdiaries-share-story-btn">Share Your Story</button>
      </div>
    </div>
  );
};

export default Clientdiaries;