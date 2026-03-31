'use client';

import { useState, useCallback, useEffect } from 'react';
import Image from 'next/image';
import './ManufacturerCarousel.css';
import m1 from '../../../assets/Images/manufacture/img1.jpeg';
import m2 from '../../../assets/Images/manufacture/img2.jpeg';
import m3 from '../../../assets/Images/manufacture/img3.jpeg';
import m4 from '../../../assets/Images/manufacture/img4.jpeg';
import m5 from '../../../assets/Images/banner/manufacturingImage1.jpg';
import m6 from '../../../assets/Images/banner/mandir.jpg';

const SLIDES = [
  { src: m1, alt: 'Artisan carving marble murti by hand at workshop' },
  { src: m2, alt: 'Partially carved marble deity statue in progress' },
  { src: m3, alt: 'Craftsman shaping Makrana marble with traditional tools' },
  { src: m4, alt: 'Detailed marble carving process for temple idol' },
  { src: m5, alt: 'Handcrafted marble statue finishing and polishing' },
  { src: m6, alt: 'Completed marble mandir and idol installation' },
];

const getImageSrc = (img) => (typeof img === 'object' && img?.src ? img.src : img);

const ManufacturerCarousel = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState('next');

  const goPrev = useCallback(() => {
    setDirection('prev');
    setActiveIndex((i) => (i === 0 ? SLIDES.length - 1 : i - 1));
  }, []);

  const goNext = useCallback(() => {
    setDirection('next');
    setActiveIndex((i) => (i === SLIDES.length - 1 ? 0 : i + 1));
  }, []);

  useEffect(() => {
    const t = setInterval(goNext, 5000);
    return () => clearInterval(t);
  }, [goNext]);

  const getSlidePosition = (index) => {
    const n = SLIDES.length;
    let offset = ((index - activeIndex + n) % n);
    if (offset > n / 2) offset -= n;
    if (offset === 0) return 'center';
    if (offset === -1) return 'near-left';
    if (offset === 1) return 'near-right';
    if (offset === -2) return 'far-left';
    if (offset === 2) return 'far-right';
    return 'hidden';
  };

  const orderedSlides = SLIDES.map((slide, index) => ({
    slide,
    index,
    position: getSlidePosition(index),
  }))
    .filter(({ position }) => position !== 'hidden')
    .sort((a, b) => {
      const order = { 'far-left': 0, 'near-left': 1, center: 2, 'near-right': 3, 'far-right': 4 };
      return order[a.position] - order[b.position];
    });

  return (
    <section className="manufacturer-carousel" aria-label="Manufacturer showcase carousel">
      <div className="manufacturer-carousel-container">
        <h2 className="manufacturer-carousel-title"></h2>
        <p className="manufacturer-carousel-subtitle">
          Our artisans bring divine forms to life in Makrana marble — right to left, one masterpiece at a time.
        </p>

        <div className="manufacturer-carousel-frame">
          <button
            type="button"
            className="manufacturer-carousel-arrow manufacturer-carousel-arrow--left"
            onClick={goPrev}
            aria-label="Previous slide"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>

          <div className={`manufacturer-carousel-stage manufacturer-carousel-stage--direction-${direction}`}>
            {orderedSlides.map(({ slide, index, position }) => (
              <div
                key={index}
                className={`manufacturer-carousel-panel manufacturer-carousel-panel--${position}`}
                data-position={position}
              >
                <div className="manufacturer-carousel-panel-inner">
                  <div className="manufacturer-carousel-panel-image">
                    <Image
                      src={getImageSrc(slide.src)}
                      alt={slide.alt}
                      fill
                      sizes="(max-width: 768px) 90vw, 420px"
                      loading="lazy"
                      style={{ objectFit: 'cover' }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button
            type="button"
            className="manufacturer-carousel-arrow manufacturer-carousel-arrow--right"
            onClick={goNext}
            aria-label="Next slide"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        </div>

        <div className="manufacturer-carousel-dots">
          {SLIDES.map((_, index) => (
            <button
              key={index}
              type="button"
              className={`manufacturer-carousel-dot ${activeIndex === index ? 'active' : ''}`}
              onClick={() => {
                setDirection(index > activeIndex ? 'next' : 'prev');
                setActiveIndex(index);
              }}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ManufacturerCarousel;
