'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import './ManufacturingProcess.css';
import manufacturingImage1 from '../../../assets/Images/manufacture/img1.jpeg';
import manufacturingImage2 from '../../../assets/Images/manufacture/img2.jpeg';
import manufacturingImage3 from '../../../assets/Images/manufacture/img3.jpeg';
import manufacturingImage4 from '../../../assets/Images/manufacture/img4.jpeg';
import manufacturingImage5 from '../../../assets/Images/banner/manufacturingImage1.jpg';
import Image from 'next/image';

// ── Add your 2 new images here ────────────────────────────────────────────────
// import manufacturingImage6 from '../../../assets/Images/manufacture/img6.jpeg';
// import manufacturingImage7 from '../../../assets/Images/manufacture/img7.jpeg';
// Replace the src values in the last two SLIDES entries below.
// ─────────────────────────────────────────────────────────────────────────────

const SLIDES = [
  { src: manufacturingImage1, alt: 'Craftsman carving statue' },
  { src: manufacturingImage2, alt: 'Partially carved statue' },
  { src: manufacturingImage3, alt: 'Craftsman working on marble' },
  { src: manufacturingImage4, alt: 'Marble carving process' },
  { src: manufacturingImage5, alt: 'Detailed carving work' },
  { src: manufacturingImage2, alt: 'Workshop view of murti in progress' },
  { src: manufacturingImage4, alt: 'Marble carving craftsmanship' },
  { src: manufacturingImage1, alt: 'Fine detailing on marble murti' },   // ← swap src
  { src: manufacturingImage3, alt: 'Master artisan at work' },           // ← swap src
];

/* ── SVG decorative pieces ──────────────────────────────────────────────── */

const LotusSVG = () => (
  <svg width="48" height="28" viewBox="0 0 48 28" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M24 26 C24 26 14 20 10 12 C14 14 19 16 24 16 C29 16 34 14 38 12 C34 20 24 26 24 26Z"
      fill="#C9A84C" opacity="0.7"/>
    <path d="M24 22 C24 22 17 17 15 10 C18 12 21 14 24 14 C27 14 30 12 33 10 C31 17 24 22 24 22Z"
      fill="#C9A84C" opacity="0.55"/>
    <path d="M24 18 C24 18 20 14 20 8 C21.5 10 23 12 24 12 C25 12 26.5 10 28 8 C28 14 24 18 24 18Z"
      fill="#E8C96A" opacity="0.85"/>
    <circle cx="24" cy="7" r="2.2" fill="#C9A84C" opacity="0.9"/>
    {/* left petals */}
    <path d="M8 16 C6 10 10 4 14 6 C12 8 10 12 12 16Z" fill="#C9A84C" opacity="0.4"/>
    <path d="M3 20 C2 13 7 7 10 10 C8 12 6 16 8 20Z" fill="#C9A84C" opacity="0.28"/>
    {/* right petals */}
    <path d="M40 16 C42 10 38 4 34 6 C36 8 38 12 36 16Z" fill="#C9A84C" opacity="0.4"/>
    <path d="M45 20 C46 13 41 7 38 10 C40 12 42 16 40 20Z" fill="#C9A84C" opacity="0.28"/>
  </svg>
);

const DiamondSVG = ({ size = 10 }) => (
  <svg width={size} height={size} viewBox="0 0 10 10">
    <rect x="2" y="2" width="6" height="6" transform="rotate(45 5 5)"
      fill="#C9A84C" opacity="0.85"/>
  </svg>
);

const OrnamentCenterSVG = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
    {/* outer ring */}
    <circle cx="16" cy="16" r="14" stroke="#C9A84C" strokeWidth="0.8" opacity="0.55"/>
    {/* inner ring */}
    <circle cx="16" cy="16" r="9" stroke="#C9A84C" strokeWidth="0.6" opacity="0.45"/>
    {/* 8 spokes */}
    {[0,45,90,135,180,225,270,315].map(a => (
      <line key={a}
        x1={16 + 9*Math.cos(a*Math.PI/180)}
        y1={16 + 9*Math.sin(a*Math.PI/180)}
        x2={16 + 14*Math.cos(a*Math.PI/180)}
        y2={16 + 14*Math.sin(a*Math.PI/180)}
        stroke="#C9A84C" strokeWidth="0.7" opacity="0.5"/>
    ))}
    {/* center dot */}
    <circle cx="16" cy="16" r="2.5" fill="#C9A84C" opacity="0.8"/>
    {/* 4 petals */}
    {[0,90,180,270].map(a => (
      <ellipse key={a}
        cx={16 + 5.5*Math.cos(a*Math.PI/180)}
        cy={16 + 5.5*Math.sin(a*Math.PI/180)}
        rx="2.2" ry="1.1"
        transform={`rotate(${a} ${16 + 5.5*Math.cos(a*Math.PI/180)} ${16 + 5.5*Math.sin(a*Math.PI/180)})`}
        fill="#C9A84C" opacity="0.38"/>
    ))}
  </svg>
);

const CornerKalashSVG = ({ flip = false }) => (
  <svg
    width="36" height="44" viewBox="0 0 36 44" fill="none"
    style={flip ? { transform: 'scaleX(-1)' } : {}}
  >
    {/* pot body */}
    <path d="M10 44 C10 44 6 36 8 28 L28 28 C30 36 26 44 26 44Z"
      fill="#C9A84C" opacity="0.35"/>
    {/* neck */}
    <rect x="12" y="22" width="12" height="7" rx="1" fill="#C9A84C" opacity="0.45"/>
    {/* rim */}
    <rect x="10" y="20" width="16" height="3" rx="1.5" fill="#C9A84C" opacity="0.55"/>
    {/* leaves */}
    <path d="M14 20 C12 14 15 8 18 10 C15 12 14 16 16 20Z" fill="#A07828" opacity="0.45"/>
    <path d="M22 20 C24 14 21 8 18 10 C21 12 22 16 20 20Z" fill="#A07828" opacity="0.45"/>
    <path d="M18 20 C16 13 18 6 18 6 C18 6 20 13 18 20Z" fill="#C9A84C" opacity="0.6"/>
    {/* coconut top */}
    <circle cx="18" cy="5" r="4" fill="#C9A84C" opacity="0.55"/>
    {/* base lines */}
    <line x1="9" y1="42" x2="27" y2="42" stroke="#C9A84C" strokeWidth="0.8" opacity="0.4"/>
  </svg>
);

/* ── Side column decorative content ─────────────────────────────────────── */
const SideColumnContent = () => (
  <div className="mp-side-motif">
    <DiamondSVG size={10} />
    <div className="mp-side-dot-stack">
      <div className="mp-side-dot" style={{ width:5, height:5, opacity:0.5 }} />
      <div className="mp-side-dot" style={{ width:7, height:7, opacity:0.7 }} />
      <div className="mp-side-dot" style={{ width:5, height:5, opacity:0.5 }} />
    </div>
    <OrnamentCenterSVG />
    <div className="mp-side-dot-stack">
      <div className="mp-side-dot" style={{ width:5, height:5, opacity:0.5 }} />
      <div className="mp-side-dot" style={{ width:7, height:7, opacity:0.7 }} />
      <div className="mp-side-dot" style={{ width:5, height:5, opacity:0.5 }} />
    </div>
    <DiamondSVG size={10} />
  </div>
);

/* ── Ornament band row ───────────────────────────────────────────────────── */
const OrnamentRow = () => (
  <div className="mp-ornament-row">
    <CornerKalashSVG />
    <div className="mp-ornament-line" />
    <DiamondSVG size={8} />
    <div style={{ margin: '0 10px' }}><OrnamentCenterSVG /></div>
    <DiamondSVG size={8} />
    <div className="mp-ornament-line" />
    <CornerKalashSVG flip />
  </div>
);

/* ────────────────────────────────────────────────────────────────────────── */

const ManufacturingProcess = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection]     = useState('next');
  const touchStartX = useRef(0);
  const touchEndX   = useRef(0);

  const goPrev = useCallback(() => {
    setDirection('prev');
    setActiveIndex(i => (i === 0 ? SLIDES.length - 1 : i - 1));
  }, []);

  const goNext = useCallback(() => {
    setDirection('next');
    setActiveIndex(i => (i === SLIDES.length - 1 ? 0 : i + 1));
  }, []);

  useEffect(() => {
    const t = setInterval(goNext, 5000);
    return () => clearInterval(t);
  }, [goNext]);

  const onTouchStart = e => { touchStartX.current = e.targetTouches[0].clientX; };
  const onTouchEnd   = e => {
    touchEndX.current = e.changedTouches[0].clientX;
    const diff = touchStartX.current - touchEndX.current;
    if (Math.abs(diff) > 50) { diff > 0 ? goNext() : goPrev(); }
  };

  const goToSlide = useCallback((index) => {
    setDirection(index > activeIndex ? 'next' : 'prev');
    setActiveIndex(index);
  }, [activeIndex]);

  const getSlidePosition = (index) => {
    const n = SLIDES.length;
    let offset = ((index - activeIndex + n) % n);
    if (offset > n / 2) offset -= n;
    if (offset ===  0) return 'center';
    if (offset === -1) return 'near-left';
    if (offset ===  1) return 'near-right';
    if (offset === -2) return 'far-left';
    if (offset ===  2) return 'far-right';
    if (offset === -3) return 'far-far-left';
    if (offset ===  3) return 'far-far-right';
    return 'hidden';
  };

  const orderedSlides = SLIDES
    .map((slide, index) => ({ slide, index, position: getSlidePosition(index) }))
    .filter(({ position }) => position !== 'hidden')
    .sort((a, b) => {
      const order = {
        'far-far-left': 0, 'far-left': 1, 'near-left': 2,
        center: 3,
        'near-right': 4, 'far-right': 5, 'far-far-right': 6,
      };
      return order[a.position] - order[b.position];
    });

  return (
    <section className="manufacturing-process manufacturing-process--blueprint">

      {/* ── TOP DARK BAND ── */}
      <div className="mp-band--top">
        <OrnamentRow />
        <p className="mp-mantra-strip">
          ॐ &nbsp;·&nbsp; Crafted by Sacred Hands &nbsp;·&nbsp; Since Generations &nbsp;·&nbsp; ॐ
        </p>
      </div>

      {/* ── MAIN CONTAINER ── */}
      <div className="manufacturing-process-container manufacturing-process-container--blueprint">

        {/* Title */}
        <div className="mp-title-block">
          <div className="mp-lotus-icon"><LotusSVG /></div>
          <h2 className="manufacturing-process-title manufacturing-process-title--blueprint">
            Manufacturing in Motion
          </h2>
          <p className="mp-title-sub">The Sacred Art of Marble Murti Craftsmanship</p>
          <div className="mp-title-rule">
            <div className="mp-title-rule-line" />
            <div className="mp-title-rule-diamond" />
            <div className="mp-title-rule-line mp-title-rule-line--right" />
          </div>
          <p className="mp-mobile-hint">Swipe to explore each stage of our workshop journey.</p>
        </div>

        {/* Carousel frame */}
        <div className="manufacturing-process-carousel-frame">

          {/* LEFT COLUMN */}
          <div className="mp-side-column mp-side-column--left">
            <div className="mp-side-line" />
            <button
              type="button"
              className="manufacturing-process-arrow manufacturing-process-arrow--left"
              onClick={goPrev}
              aria-label="Previous slide"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>
            <SideColumnContent />
          </div>

          {/* STAGE */}
          <div className="mp-stage-wrap">
            <div
              className={`manufacturing-process-stage manufacturing-process-stage--direction-${direction}`}
              onTouchStart={onTouchStart}
              onTouchEnd={onTouchEnd}
            >
              {orderedSlides.map(({ slide, index, position }) => (
                <div
                  key={index}
                  className={`manufacturing-process-panel manufacturing-process-panel--${position}`}
                >
                  <div className="manufacturing-process-panel-inner">
                    <div className="manufacturing-process-panel-image">
                      <Image
                        src={slide.src}
                        alt={slide.alt}
                        fill
                        sizes="(max-width: 680px) 78vw, (max-width: 968px) 50vw, 520px"
                        style={{ objectFit: 'cover' }}
                        priority={position === 'center'}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT COLUMN */}
          <div className="mp-side-column mp-side-column--right">
            <div className="mp-side-line" />
            <button
              type="button"
              className="manufacturing-process-arrow manufacturing-process-arrow--right"
              onClick={goNext}
              aria-label="Next slide"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
            <SideColumnContent />
          </div>

        </div>{/* /carousel-frame */}

        {/* Pagination */}
        <div className="manufacturing-process-pagination manufacturing-process-pagination--blueprint">
          {SLIDES.map((_, index) => (
            <button
              key={index}
              type="button"
              className={`manufacturing-process-dot manufacturing-process-dot--blueprint${activeIndex === index ? ' active' : ''}`}
              onClick={() => goToSlide(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
        <p className="mp-slide-counter">
          {String(activeIndex + 1).padStart(2, '0')} / {String(SLIDES.length).padStart(2, '0')}
        </p>

      </div>{/* /container */}

      {/* ── BOTTOM DARK BAND ── */}
      <div className="mp-band--bottom">
        <p className="mp-mantra-strip">
          शिल्प &nbsp;·&nbsp; Shilp &nbsp;·&nbsp; Craftsmanship &nbsp;·&nbsp; Devotion &nbsp;·&nbsp; शिल्प
        </p>
        <OrnamentRow />
      </div>

    </section>
  );
};

export default ManufacturingProcess;
