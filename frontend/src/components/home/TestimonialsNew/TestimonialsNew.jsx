'use client';

import { useEffect, useRef, useState } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import './TestimonialsNew.css';

const testimonials = [
  {
    avatar: 'R',
    name: 'RAMESH SHARMA',
    location: 'Jaipur, Rajasthan',
    text: 'The Ganesha murti we ordered for our new temple is beyond beautiful. The marble quality and craftsmanship are extraordinary. Jai Ganesh!',
  },
  {
    avatar: 'P',
    name: 'PRIYA AGARWAL',
    location: 'Delhi, NCR',
    text: 'Ordered a custom Radha Krishna set for our mandir. The attention to detail, from the jewellery to the peacock feather, is simply divine.',
  },
  {
    avatar: 'T',
    name: 'TEMPLE TRUST, SURAT',
    location: 'Surat, Gujarat',
    text: "We've ordered from many vendors but Mateshwari is on another level. The packaging, communication, and final product are all perfect. Highly recommended.",
  },
];

const TestimonialsNew = () => {
  const trackRef = useRef(null);
  const cardRefs = useRef([]);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const track = trackRef.current;

    if (!track) {
      return undefined;
    }

    const updateActiveCard = () => {
      const containerCenter = track.scrollLeft + track.clientWidth / 2;
      let closestIndex = 0;
      let closestDistance = Number.POSITIVE_INFINITY;

      cardRefs.current.forEach((card, index) => {
        if (!card) {
          return;
        }

        const cardCenter = card.offsetLeft + card.offsetWidth / 2;
        const distance = Math.abs(cardCenter - containerCenter);

        if (distance < closestDistance) {
          closestDistance = distance;
          closestIndex = index;
        }
      });

      setActiveIndex(closestIndex);
    };

    updateActiveCard();
    track.addEventListener('scroll', updateActiveCard, { passive: true });
    window.addEventListener('resize', updateActiveCard);

    return () => {
      track.removeEventListener('scroll', updateActiveCard);
      window.removeEventListener('resize', updateActiveCard);
    };
  }, []);

  const scrollToCard = (index) => {
    const safeIndex = (index + testimonials.length) % testimonials.length;
    const card = cardRefs.current[safeIndex];

    if (!card) {
      return;
    }

    card.scrollIntoView({
      behavior: 'smooth',
      inline: 'center',
      block: 'nearest',
    });
    setActiveIndex(safeIndex);
  };

  return (
    <section className="tn-section">
      <div className="tn-inner">
        <div className="tn-header">
          <div className="tn-badge">Customer Stories</div>
          <h2 className="tn-title">What Devotees <em>Say</em></h2>
        </div>

        <div className="tn-mobile-controls">
          <button
            type="button"
            className="tn-mobile-nav"
            onClick={() => scrollToCard(activeIndex - 1)}
            aria-label="Show previous testimonial"
          >
            <FaChevronLeft />
          </button>
          <div className="tn-mobile-status" aria-live="polite">
            <span>{String(activeIndex + 1).padStart(2, '0')}</span>
            <span>/</span>
            <span>{String(testimonials.length).padStart(2, '0')}</span>
          </div>
          <button
            type="button"
            className="tn-mobile-nav"
            onClick={() => scrollToCard(activeIndex + 1)}
            aria-label="Show next testimonial"
          >
            <FaChevronRight />
          </button>
        </div>

        <div className="tn-grid" ref={trackRef}>
          {testimonials.map((testimonial, index) => (
            <div
              className={`tn-card ${activeIndex === index ? 'is-active' : ''}`}
              key={testimonial.name}
              ref={(element) => {
                cardRefs.current[index] = element;
              }}
            >
              <div className="tn-stars">*****</div>
              <div className="tn-text">{testimonial.text}</div>
              <div className="tn-author">
                <div className="tn-avatar">{testimonial.avatar}</div>
                <div>
                  <div className="tn-name">{testimonial.name}</div>
                  <div className="tn-loc">{testimonial.location}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="tn-mobile-dots">
          {testimonials.map((testimonial, index) => (
            <button
              key={testimonial.name}
              type="button"
              className={`tn-mobile-dot ${activeIndex === index ? 'active' : ''}`}
              onClick={() => scrollToCard(index)}
              aria-label={`Show testimonial ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsNew;
