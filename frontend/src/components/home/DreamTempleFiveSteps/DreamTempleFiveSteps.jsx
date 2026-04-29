'use client';

import React, { useRef } from 'react';
import Link from 'next/link';
import './DreamTempleFiveSteps.css';

const STEPS = [
  { number: 1, title: "Let's Connect\nOne on One", icon: 'connect' },
  { number: 2, title: 'Explore our\nCatalog', icon: 'catalog' },
  { number: 3, title: 'Place The\nOrder', icon: 'order' },
  { number: 4, title: 'Approval', icon: 'approval' },
  { number: 5, title: 'Delivery and\nInstallation', icon: 'delivery' },
];

const ochre = '#c9a84c';
const darkGrey = '#3a3a3a';
const lightGrey = '#9a9a9a';

const StepIcon = ({ type }) => {
  const size = 68;
  const vb = '0 0 100 100';

  if (type === 'connect') {
    return (
      <svg width={size} height={size} viewBox={vb} fill="none">
        <rect x="12" y="58" width="76" height="35" rx="2" fill={darkGrey} />
        <ellipse cx="32" cy="78" rx="11" ry="8" fill={lightGrey} />
        <ellipse cx="68" cy="78" rx="11" ry="8" fill={lightGrey} />
        <rect x="27" y="48" width="10" height="32" fill={ochre} rx="1" />
        <rect x="63" y="50" width="10" height="30" fill={darkGrey} rx="1" />
        <rect x="72" y="18" width="20" height="28" rx="1" fill="#f5f0e6" stroke={darkGrey} strokeWidth="1" />
        <line x1="78" y1="22" x2="86" y2="22" stroke={darkGrey} strokeWidth="0.8" />
        <line x1="78" y1="26" x2="86" y2="26" stroke={darkGrey} strokeWidth="0.8" />
        <line x1="78" y1="30" x2="84" y2="30" stroke={darkGrey} strokeWidth="0.8" />
      </svg>
    );
  }

  if (type === 'catalog') {
    return (
      <svg width={size} height={size} viewBox={vb} fill="none">
        <rect x="18" y="60" width="64" height="8" rx="1" fill={darkGrey} />
        <rect x="22" y="50" width="14" height="22" fill={ochre} rx="1" />
        <rect x="52" y="20" width="38" height="32" rx="2" fill="#fff" stroke={darkGrey} strokeWidth="1.2" />
        <rect x="56" y="26" width="14" height="10" fill={ochre} opacity="0.3" rx="0.5" />
        <rect x="73" y="26" width="14" height="10" fill={lightGrey} opacity="0.4" rx="0.5" />
        <line x1="56" y1="40" x2="84" y2="40" stroke={lightGrey} strokeWidth="0.8" />
        <line x1="56" y1="45" x2="78" y2="45" stroke={lightGrey} strokeWidth="0.8" />
      </svg>
    );
  }

  if (type === 'order') {
    return (
      <svg width={size} height={size} viewBox={vb} fill="none">
        <rect x="8" y="52" width="84" height="42" rx="2" fill={lightGrey} />
        <rect x="14" y="58" width="72" height="28" fill="#fff" stroke={darkGrey} strokeWidth="1" />
        <line x1="20" y1="65" x2="80" y2="65" stroke={lightGrey} strokeWidth="0.8" />
        <line x1="20" y1="72" x2="80" y2="72" stroke={lightGrey} strokeWidth="0.8" />
        <line x1="20" y1="79" x2="65" y2="79" stroke={lightGrey} strokeWidth="0.8" />
        <ellipse cx="28" cy="42" rx="9" ry="6" fill={darkGrey} />
        <ellipse cx="72" cy="42" rx="9" ry="6" fill={darkGrey} />
        <rect x="24" y="24" width="8" height="20" fill={ochre} rx="1" />
        <rect x="68" y="24" width="8" height="20" fill={darkGrey} rx="1" />
      </svg>
    );
  }

  if (type === 'approval') {
    return (
      <svg width={size} height={size} viewBox={vb} fill="none">
        <rect x="12" y="58" width="76" height="35" rx="2" fill={darkGrey} />
        <rect x="22" y="48" width="14" height="24" fill={ochre} rx="1" />
        <ellipse cx="52" cy="75" rx="14" ry="8" fill={lightGrey} />
        <rect x="45" y="48" width="14" height="28" fill={ochre} rx="1" />
        <rect x="62" y="32" width="32" height="22" rx="1" fill="#fff" stroke={darkGrey} strokeWidth="1" />
        <path d="M70 42 L74 46 L86 32" stroke={darkGrey} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      </svg>
    );
  }

  if (type === 'delivery') {
    return (
      <svg width={size} height={size} viewBox={vb} fill="none">
        <rect x="8" y="58" width="55" height="28" rx="2" fill={lightGrey} />
        <rect x="68" y="45" width="26" height="42" rx="1" fill={ochre} opacity="0.5" stroke={darkGrey} strokeWidth="1" />
        <rect x="72" y="50" width="10" height="8" rx="0.5" fill="#fff" opacity="0.9" />
        <ellipse cx="32" cy="84" rx="10" ry="6" fill={lightGrey} />
        <rect x="26" y="62" width="14" height="24" fill={ochre} rx="1" />
        <circle cx="33" cy="55" r="7" fill={lightGrey} />
      </svg>
    );
  }

  return null;
};

const DreamTempleFiveSteps = () => {
  const scrollRef = useRef(null);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);

  const onMouseDown = (e) => {
    if (window.innerWidth > 900) return;
    isDragging.current = true;
    startX.current = e.pageX - scrollRef.current.offsetLeft;
    scrollLeft.current = scrollRef.current.scrollLeft;
    scrollRef.current.style.cursor = 'grabbing';
  };

  const onMouseLeave = () => {
    isDragging.current = false;
    if (scrollRef.current && window.innerWidth <= 900) scrollRef.current.style.cursor = 'grab';
  };

  const onMouseUp = () => {
    isDragging.current = false;
    if (scrollRef.current && window.innerWidth <= 900) scrollRef.current.style.cursor = 'grab';
  };

  const onMouseMove = (e) => {
    if (!isDragging.current) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    scrollRef.current.scrollLeft = scrollLeft.current - (x - startX.current) * 1.2;
  };

  return (
    <section className="dtf-section" aria-labelledby="dtf-title">
      <div className="dtf-header">
        <h2 id="dtf-title" className="dtf-heading">Your Dream Temple In 5 Steps</h2>
        <p className="dtf-tagline">
          Looking to design your Dream Temple? Here&apos;s how you can get started.
        </p>
      </div>

      <div
        className="dtf-scroll-outer"
        ref={scrollRef}
        onMouseDown={onMouseDown}
        onMouseLeave={onMouseLeave}
        onMouseUp={onMouseUp}
        onMouseMove={onMouseMove}
      >
        <div className="dtf-track">
          {STEPS.map((step) => (
            <div key={step.number} className="dtf-item">
              <div className="dtf-circle">
                <StepIcon type={step.icon} />
              </div>
              <div className="dtf-label">
                <span className="dtf-num">{step.number}</span>
                <span className="dtf-title">
                  {step.title.split('\n').map((line, i) => (
                    <React.Fragment key={i}>
                      {i > 0 && <br />}
                      {line}
                    </React.Fragment>
                  ))}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="dtf-cta">
        <Link href="/contact-us" className="dtf-btn">
          Get started — Step 1
        </Link>
      </div>
    </section>
  );
};

export default DreamTempleFiveSteps;