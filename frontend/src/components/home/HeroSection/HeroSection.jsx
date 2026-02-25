'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import './HeroSection.css';

// Local images imports
import hero1 from '../../../assets/Images/img/imag1.jpeg';
import hero2 from '../../../assets/Images/img/imag2.jpeg';
import hero11 from '../../../assets/Images/img/imag3.jpeg';
import hero12 from '../../../assets/Images/img/imag4.jpeg';
// import hero13 from '../../../assets/Images/';

const HeroSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    { id: 1, title: "Shree Ram Darbar", image: hero1 },
    { id: 2, title: "Ram Lalla", image: hero2 },
    { id: 3, title: "Divine Collection", image: hero11 },
    { id: 4, title: "Handcrafted Idols", image: hero12 },
    // { id: 5, title: "Marble Statues", image: hero13 }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [slides.length]);

  const goToSlide = (index) => setCurrentSlide(index);
  const goToPrevious = () => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  const goToNext = () => setCurrentSlide((prev) => (prev + 1) % slides.length);

  const currentSlideData = slides[currentSlide];

  return (
    <section className="hero-slider-section">
      {/* Desktop & Mobile Image View */}
      <div className="hero-slider-desktop">
        <div className="hero-slider-images" style={{ position: 'relative', width: '100%', height: '100vh' }}>
          
          <Image
            src={currentSlideData.image}
            alt={currentSlideData.title}
            fill
            priority
            className="hero-statues-image"
            style={{ objectFit: 'cover' }}
            placeholder="blur"
          />

          {/* Overlay for better text visibility */}
          <div className="hero-video-overlay"></div>
          
          {/* <div className="hero-content-overlay">
            <p className="hero-subtitle">Your Ultimate Pooja Room Destination</p>
            <h1 className="hero-title">YOUR SPIRITUAL CONNECTION, MADE</h1>
            <h1 className="hero-title-large">SIMPLE</h1>
            <p className="hero-tagline">— TILAK STONE ARTS</p>
          </div> */}
        </div>
      </div>

      {/* Navigation Arrows */}
      <button className="hero-slider-nav hero-slider-prev" onClick={goToPrevious}>
        <FaChevronLeft />
      </button>
      <button className="hero-slider-nav hero-slider-next" onClick={goToNext}>
        <FaChevronRight />
      </button>

      {/* Slider Dots */}
      <div className="hero-slider-dots">
        {slides.map((slide, index) => (
          <button
            key={slide.id}
            className={`hero-slider-dot ${index === currentSlide ? 'active' : ''}`}
            onClick={() => goToSlide(index)}
          />
        ))}
      </div>
    </section>
  );
};

export default HeroSection;