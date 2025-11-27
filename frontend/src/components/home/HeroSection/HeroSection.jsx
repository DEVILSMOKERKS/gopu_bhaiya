import React, { useState, useEffect } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import './HeroSection.css';
// Import local images
import hero1 from '../../../assets/Images/banner/hero-1.png';
import hero2 from '../../../assets/Images/banner/hero-1.png';
import hero11 from '../../../assets/Images/banner/hero-1.png';
import hero12 from '../../../assets/Images/banner/hero-1.png';
import hero13 from '../../../assets/Images/banner/hero-1.png';

const HeroSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Slider data with local images
  const slides = [
    {
      id: 1,
      title: "Shree Ram Darbar",
      desktopImage: hero1,
      mobileImage: hero1,
    },
    {
      id: 2,
      title: "Ram Lalla",
      desktopImage: hero2,
      mobileImage: hero2,
    },
    {
      id: 3,
      title: "Divine Collection",
      desktopImage: hero11,
      mobileImage: hero11,
    },
    {
      id: 4,
      title: "Handcrafted Idols",
      desktopImage: hero12,
      mobileImage: hero12,
    },
    {
      id: 5,
      title: "Marble Statues",
      desktopImage: hero13,
      mobileImage: hero13,
    }
  ];

  // Auto-slide functionality
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(interval);
  }, [slides.length]);

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  const goToPrevious = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToNext = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const currentSlideData = slides[currentSlide];

  return (
    <section className="hero-slider-section">
      {/* Desktop Layout - Only Images */}
      <div className="hero-slider-desktop">
        <div className="hero-slider-images">
          <div className="hero-statues-wrapper">
            <img
              src={currentSlideData.desktopImage}
              alt={currentSlideData.title}
              className="hero-statues-image"
            />
          </div>
        </div>
      </div>

      {/* Mobile Layout - Only Images */}
      <div className="hero-slider-mobile">
        <div className="hero-mobile-image-wrapper">
          <img
            src={currentSlideData.mobileImage}
            alt={currentSlideData.title}
            className="hero-mobile-image"
          />
        </div>
      </div>

      {/* Navigation Arrows */}
      <button
        className="hero-slider-nav hero-slider-prev"
        onClick={goToPrevious}
        aria-label="Previous slide"
      >
        <FaChevronLeft />
      </button>
      <button
        className="hero-slider-nav hero-slider-next"
        onClick={goToNext}
        aria-label="Next slide"
      >
        <FaChevronRight />
      </button>

      {/* Slider Dots - Outside Image Container */}
      <div className="hero-slider-dots">
        {slides.map((slide, index) => (
          <button
            key={slide.id}
            className={`hero-slider-dot ${index === currentSlide ? 'active' : ''}`}
            onClick={() => goToSlide(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
};

export default HeroSection;
