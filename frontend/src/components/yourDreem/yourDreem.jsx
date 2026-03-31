'use client';

import React, { useEffect, useRef, useState } from 'react';
import './HowItWorks.css';

const steps = [
  {
    number: '01',
    icon: '🪔',
    title: 'Consultation',
    desc: 'Share your vision — deity, size, material & finish. Our master artisans guide you with decades of expertise.',
  },
  {
    number: '02',
    icon: '✏️',
    title: 'Design Approval',
    desc: 'We share detailed sketches and 3D references for your personal approval before a single chisel touches stone.',
  },
  {
    number: '03',
    icon: '🪨',
    title: 'Handcrafting',
    desc: 'Master craftsmen carve, paint, and adorn your murti with complete devotion — a process taking 15–45 days.',
  },
  {
    number: '04',
    icon: '🔍',
    title: 'Quality Check',
    desc: 'Every inch is inspected with reverence before packing. You receive progress photographs throughout.',
  },
  {
    number: '05',
    icon: '🏠',
    title: 'Safe Delivery',
    desc: 'Custom crated, fully insured, and delivered to your doorstep across India — ready to be consecrated.',
  },
];

const HowItWorks = () => {
  const sectionRef = useRef(null);
  const trackRef = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="hiw-section" ref={sectionRef}>
      {/* Decorative border frame */}
      <div className="hiw-frame" />

      <div className="hiw-container">
        {/* Header */}
        <header className="hiw-header">
          <p className="hiw-eyebrow">Simple Process</p>
          <h2 className="hiw-title">
            Your Dream Temple <em>in 5 Steps</em>
          </h2>
          <p className="hiw-subtitle">
            From your vision to a consecrated murti — delivered to your home
          </p>
        </header>

        {/* Steps Track */}
        <div className={`hiw-track ${visible ? 'animated' : ''}`} ref={trackRef}>
          {/* Background connector line */}
          <div className="hiw-line" />
          {/* Animated fill line */}
          <div className="hiw-line-fill" />

          {steps.map((step, i) => (
            <div
              key={step.number}
              className={`hiw-step ${visible ? 'visible' : ''}`}
              style={{ transitionDelay: `${0.1 + i * 0.12}s` }}
            >
              {/* Circle badge */}
              <div className="hiw-circle">
                <span className="hiw-circle-icon" role="img" aria-label={step.title}>
                  {step.icon}
                </span>
                <span className="hiw-number">{step.number}</span>
              </div>

              {/* Text */}
              <div className="hiw-step-text">
                <h3 className="hiw-step-title">{step.title}</h3>
                <p className="hiw-step-desc">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Footer ornament */}
        <div className="hiw-footer">
          <span className="hiw-footer-line" />
          <span className="hiw-footer-symbol">ॐ</span>
          <span className="hiw-footer-line" />
        </div>
      </div>
    </section>
  );
};

export default ProcessSteps ;