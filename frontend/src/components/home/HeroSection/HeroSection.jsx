'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import './HeroSection.css';

import hero1 from '../../../assets/Images/img/imag1.jpeg';
import hero2 from '../../../assets/Images/img/imag2.jpeg';
import hero11 from '../../../assets/Images/img/imag3.jpeg';
import hero12 from '../../../assets/Images/img/imag4.jpeg';

const HeroSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      id: 1,
      image: hero1,
      label: 'Sacred Craftsmanship Since 1972',
      title: 'Divine Marble',
      titleEm: 'Murtis, Carved with Devotion',
      desc: 'Each idol is hand-carved by master artisans from Rajasthan using the finest Makrana marble — bringing divine presence into your home and temple.',
      stats: [
        { num: '5000+', label: 'Murtis Crafted' },
        { num: '50+', label: 'Years Legacy' },
        { num: '28', label: 'States Delivered' },
      ],
    },
    {
      id: 2,
      image: hero2,
      label: 'Premium Temple Grade',
      title: 'Radha Krishna',
      titleEm: 'Yugal Murti, Pure Devotion',
      desc: 'Exquisitely painted, adorned with real gold leaf and precious stones — museum-quality sacred art for the most discerning devotees.',
      stats: [
        { num: '200+', label: 'Temple Clients' },
        { num: '100%', label: 'Handmade' },
        { num: '4.9★', label: 'Customer Rating' },
      ],
    },
    {
      id: 3,
      image: hero11,
      label: 'Customise Your Murti',
      title: 'Your Vision,',
      titleEm: 'Our Artisans, Divine Result',
      desc: 'From concept sketch to consecrated idol — we create bespoke murtis to your exact specifications for homes, temples, and institutions.',
      stats: [
        { num: '15–45', label: 'Days Delivery' },
        { num: 'Free', label: 'Consultation' },
        { num: 'Lifetime', label: 'Guarantee' },
      ],
    },
    {
      id: 4,
      image: hero12,
      label: 'Handcrafted Excellence',
      title: 'Sacred Art,',
      titleEm: 'Timeless Beauty',
      desc: 'Browse our curated collection of marble murtis, pooja sets, and temple solutions — all handcrafted with devotion in Jaipur, Rajasthan.',
      stats: [
        { num: '500+', label: 'Products' },
        { num: 'Pan India', label: 'Shipping' },
        { num: '25%', label: 'Off Selected' },
      ],
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [slides.length]);

  const goToSlide = (index) => setCurrentSlide(index);
  const goToPrevious = () => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  const goToNext = () => setCurrentSlide((prev) => (prev + 1) % slides.length);

  const slide = slides[currentSlide];

  return (
    <section className="hero-slider-section" aria-label="Featured collections carousel">
      <div className="hero-slider-desktop">
        <div className="hero-slider-images">
          <Image
            src={slide.image}
            alt={slide.title}
            fill
            priority
            className="hero-statues-image"
            style={{ objectFit: 'cover' }}
            placeholder="blur"
          />
          <div className="hero-video-overlay"></div>

          <div className="hero-content-overlay">
            <div className="hero-text-block">
              <div className="hero-label">
                <span>{slide.label}</span>
              </div>
              <h1 className="hero-title-new">
                {slide.title} <em>{slide.titleEm}</em>
              </h1>
              <p className="hero-desc-new">{slide.desc}</p>
              <div className="hero-btns">
                <Link href="/products" className="hero-btn-primary">EXPLORE COLLECTION</Link>
                <Link href="/contact-us" className="hero-btn-outline">CUSTOM ORDER</Link>
              </div>
              <div className="hero-stats-row">
                {slide.stats.map((s, i) => (
                  <div key={i} className="hero-stat">
                    <div className="hero-stat-num">{s.num}</div>
                    <div className="hero-stat-label">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <button
        type="button"
        className="hero-slider-nav hero-slider-prev"
        onClick={goToPrevious}
        aria-label="Previous slide"
      >
        <FaChevronLeft aria-hidden="true" />
      </button>
      <button
        type="button"
        className="hero-slider-nav hero-slider-next"
        onClick={goToNext}
        aria-label="Next slide"
      >
        <FaChevronRight aria-hidden="true" />
      </button>

      <div className="hero-slider-dots" role="tablist" aria-label="Hero slide navigation">
        {slides.map((s, index) => (
          <button
            key={s.id}
            type="button"
            role="tab"
            aria-selected={index === currentSlide}
            aria-label={`Go to slide ${index + 1}`}
            className={`hero-slider-dot ${index === currentSlide ? 'active' : ''}`}
            onClick={() => goToSlide(index)}
          />
        ))}
      </div>
    </section>
  );
};

export default HeroSection;
