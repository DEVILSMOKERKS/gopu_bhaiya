'use client';

import { useState, useEffect } from 'react';
import { FaWhatsapp, FaPhone, FaArrowUp } from 'react-icons/fa';
import './FloatingButtons.css';

const FloatingButtons = () => {
  const [mounted, setMounted] = useState(false);
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    setMounted(true);
    const onScroll = () => setShowTop(window.scrollY > 400);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  if (!mounted) return null;

  return (
    <>
      <div className="float-btns">
        <a
          href="https://wa.me/919876543210"
          target="_blank"
          rel="noopener noreferrer"
          className="float-btn float-wa"
          title="WhatsApp"
        >
          <FaWhatsapp />
        </a>
        <a
          href="tel:+919876543210"
          className="float-btn float-call"
          title="Call Us"
        >
          <FaPhone />
        </a>
      </div>

      <button
        className={`back-to-top ${showTop ? 'visible' : ''}`}
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        aria-label="Back to top"
      >
        <FaArrowUp />
      </button>
    </>
  );
};

export default FloatingButtons;
