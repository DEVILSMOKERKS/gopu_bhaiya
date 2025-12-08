'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import './ExploreCollection.css';
import ExploreCollectionCarousel from './ExploreCollectionCarousel';
import exploreCollection1 from '../../assets/Images/explorecollection/explore1.png';
import exploreCollection2 from '../../assets/Images/explorecollection/explore2.png';
import exploreCollection3 from '../../assets/Images/explorecollection/explore3.png';
import exploreCollection4 from '../../assets/Images/explorecollection/explore4.png';

const ExploreCollection = () => {
  const router = useRouter();
  const [isMobile, setIsMobile] = useState(false);

  const collections = [
    {
      id: 1,
      image: exploreCollection1,
      category: "posh-palette"
    },
    {
      id: 2,
      image: exploreCollection2,
      category: "indigo-chronicals"
    },
    {
      id: 3,
      image: exploreCollection3,
      category: "jewellery"
    },
    {
      id: 4,
      image: exploreCollection4,
      category: "luxury-pret"
    }
  ];

  // Check if mobile on mount and resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleImageClick = (category) => {
    router.push(`/shop?category=${category}`);
  };

  return (
    <section className="explore-collection-section">
      <div className="explore-collection-container">
        <h2 className="explore-collection-title">EXPLORE COLLECTION</h2>

        {/* Desktop Grid Layout */}
        {!isMobile && (
          <div className="explore-collection-grid">
            {collections.map((collection) => (
              <div
                key={collection.id}
                className="explore-collection-card"
                onClick={() => handleImageClick(collection.category)}
              >
                <div className="explore-collection-image-container" style={{ position: 'relative', width: '100%', height: '100%' }}>
                  <Image
                    src={collection.image}
                    alt={`${collection.category} collection`}
                    className="explore-collection-image"
                    fill
                    style={{ objectFit: 'contain' }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Mobile Carousel Layout */}
        {isMobile && (
          <ExploreCollectionCarousel collections={collections} />
        )}
      </div>
    </section>
  );
};

export default ExploreCollection;
