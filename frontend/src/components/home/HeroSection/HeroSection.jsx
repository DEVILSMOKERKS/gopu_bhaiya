'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import './HeroSection.css';
// Import local images
import hero1 from '../../../assets/Images/banner/hero-1.jpg';
import hero2 from '../../../assets/Images/banner/hero-1.jpg';
import hero11 from '../../../assets/Images/banner/hero-1.jpg';
import hero12 from '../../../assets/Images/banner/hero-1.jpg';
import hero13 from '../../../assets/Images/banner/hero-1.jpg';
// Video path - should be in public folder for Next.js compatibility
// If video doesn't exist, this will fail gracefully
const heroVideo = '/videos/hero-video.mp4';

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
      {/* Desktop Layout - Video Background */}
      <div className="hero-slider-desktop">
        <div className="hero-slider-images">
          {/* Video Background */}
          <video
            className="hero-video-background"
            autoPlay
            loop
            muted
            playsInline
            onError={(e) => {
              // Hide video if it fails to load, show image instead
              e.target.style.display = 'none';
            }}
          >
            <source src={heroVideo} type="video/mp4" />
          </video>
          {/* Fallback image if video fails to load */}
          <Image
            src={currentSlideData.desktopImage}
            alt={currentSlideData.title}
            className="hero-statues-image"
            width={1920}
            height={1080}
            style={{ display: 'none' }}
            onLoad={(e) => {
              // Show image if video is not available
              const video = e.target.previousElementSibling;
              if (video && video.tagName === 'VIDEO' && !video.canPlayType('video/mp4')) {
                e.target.style.display = 'block';
              }
            }}
          />
          {/* Overlay for better text visibility */}
          <div className="hero-video-overlay"></div>
          {/* Optional: Text Content Overlay */}
          <div className="hero-content-overlay">
            <p className="hero-subtitle">Your Ultimate Pooja Room Destination</p>
            <h1 className="hero-title">YOUR SPIRITUAL CONNECTION, MADE</h1>
          
          </div>
        </div>
      </div>

      {/* Mobile Layout - Video Background */}
      <div className="hero-slider-mobile">
        <div className="hero-mobile-image-wrapper">
          {/* Video Background */}
          <video
            className="hero-video-background"
            autoPlay
            loop
            muted
            playsInline
            onError={(e) => {
              e.target.style.display = 'none';
            }}
          >
            <source src={heroVideo} type="video/mp4" />
            {/* Fallback image if video fails to load */}
            <Image
              src={currentSlideData.mobileImage}
              alt={currentSlideData.title}
              className="hero-mobile-image"
              width={768}
              height={1024}
            />
          </video>
          {/* Overlay for better text visibility */}
          <div className="hero-video-overlay"></div>
          {/* Optional: Text Content Overlay */}
          <div className="hero-content-overlay">
            <p className="hero-subtitle">Your Ultimate Pooja Room Destination</p>
            <h1 className="hero-title">YOUR SPIRITUAL CONNECTION, MADE</h1>
            <h1 className="hero-title-large">SIMPLE</h1>
            <p className="hero-tagline">— TILAK STONE ARTS</p>
          </div>
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
