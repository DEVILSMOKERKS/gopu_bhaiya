'use client';

import { useState, useRef, useEffect } from 'react';
import './ManufacturingProcess.css';
// Import manufacturing process images
import manufacturingImage1 from '../../../assets/Images/manufacture/img1.jpeg';
import manufacturingImage2 from '../../../assets/Images/manufacture/img2.jpeg';
import manufacturingImage3 from '../../../assets/Images/manufacture/img3.jpeg';
import manufacturingImage4 from '../../../assets/Images/manufacture/img4.jpeg';
import manufacturingImage5 from '../../../assets/Images/banner/manufacturingImage1.jpg';
import Image from 'next/image';

const ManufacturingProcess = () => {
  const processImages = [
    { src: manufacturingImage1, alt: 'Craftsman carving statue' },
    { src: manufacturingImage2, alt: 'Partially carved statue' },
    { src: manufacturingImage3, alt: 'Craftsman working on marble' },
    { src: manufacturingImage4, alt: 'Marble carving process' },
    { src: manufacturingImage5, alt: 'Detailed carving work' }
  ];

  const [desktopCurrentPage, setDesktopCurrentPage] = useState(0);
  const [mobileCurrentPage, setMobileCurrentPage] = useState(0);
  const desktopScrollRef = useRef(null);

  // Desktop: show all images with horizontal scroll
  const desktopItemsPerPage = 4;
  const desktopTotalPages = Math.ceil(processImages.length / desktopItemsPerPage);
  const desktopImages = processImages;

  // Mobile: show 2 images per page
  const mobileItemsPerPage = 2;
  const mobileTotalPages = Math.ceil(processImages.length / mobileItemsPerPage);
  const mobileStartIndex = mobileCurrentPage * mobileItemsPerPage;
  const mobileEndIndex = mobileStartIndex + mobileItemsPerPage;
  const mobileImages = processImages.slice(mobileStartIndex, mobileEndIndex);

  // Update current page based on scroll position
  useEffect(() => {
    const handleScroll = () => {
      if (desktopScrollRef.current) {
        const cardWidth = desktopScrollRef.current.querySelector('.manufacturing-process-card')?.offsetWidth || 0;
        const gap = 20;
        const cardsPerPage = 4;
        const pageWidth = (cardWidth + gap) * cardsPerPage;
        const scrollLeft = desktopScrollRef.current.scrollLeft;
        const currentPage = Math.round(scrollLeft / pageWidth);
        setDesktopCurrentPage(Math.min(currentPage, desktopTotalPages - 1));
      }
    };

    const scrollContainer = desktopScrollRef.current;
    if (scrollContainer) {
      scrollContainer.addEventListener('scroll', handleScroll);
      return () => scrollContainer.removeEventListener('scroll', handleScroll);
    }
  }, [desktopTotalPages]);


  const handleDesktopDotClick = (index) => {
    if (desktopScrollRef.current) {
      const cardWidth = desktopScrollRef.current.querySelector('.manufacturing-process-card')?.offsetWidth || 0;
      const gap = 20;
      const scrollAmount = (cardWidth + gap) * desktopItemsPerPage * index;
      desktopScrollRef.current.scrollTo({ left: scrollAmount, behavior: 'smooth' });
      setDesktopCurrentPage(index);
    }
  };

  const handleMobileDotClick = (index) => {
    setMobileCurrentPage(index);
  };

  return (
    <section className="manufacturing-process">
      <div className="manufacturing-process-container">
        <h2 className="manufacturing-process-title">Manufactures In Motion</h2>

        {/* Desktop Grid - Horizontal scroll with all images */}
        <div
          className="manufacturing-process-grid-desktop"
          ref={desktopScrollRef}
        >
          {desktopImages.map((image, index) => (
            <div key={index} className="manufacturing-process-card" style={{ position: 'relative', borderRadius: '12px', overflow: 'hidden', background: '#ffffff', transition: 'transform var(--transition-normal)' }}>
              <Image
                src={image.src}
                alt={image.alt}
                className="manufacturing-process-image"
                fill
                style={{ objectFit: 'cover', display: 'block', borderRadius: '12px' }}
              />
            </div>
          ))}
        </div>

        {/* Mobile Grid - 2 images */}
        <div className="manufacturing-process-grid-mobile">
          {mobileImages.map((image, index) => (
            <div key={mobileStartIndex + index} className="manufacturing-process-card">
              <Image
                src={image.src}
                alt={image.alt}
                className="manufacturing-process-image"
              />
            </div>
          ))}
        </div>

        {/* Desktop Pagination Dots */}
        {desktopTotalPages > 1 && (
          <div className="manufacturing-process-pagination manufacturing-process-pagination-desktop">
            {Array.from({ length: desktopTotalPages }).map((_, index) => (
              <button
                key={index}
                className={`manufacturing-process-dot ${desktopCurrentPage === index ? 'active' : ''}`}
                onClick={() => handleDesktopDotClick(index)}
                aria-label={`Go to page ${index + 1}`}
              />
            ))}
          </div>
        )}

        {/* Mobile Pagination Dots */}
        {/* {mobileTotalPages > 1 && (
          // <div className="manufacturing-process-pagination manufacturing-process-pagination-mobile">
          //   {Array.from({ length: mobileTotalPages }).map((_, index) => (
          //     <button
          //       key={index}
          //       className={`manufacturing-process-dot ${mobileCurrentPage === index ? 'active' : ''}`}
          //       onClick={() => handleMobileDotClick(index)}
          //       aria-label={`Go to page ${index + 1}`}
          //     />
          //   ))}
          // </div>
        )} */}
      </div>
    </section>
  );
};

export default ManufacturingProcess;

