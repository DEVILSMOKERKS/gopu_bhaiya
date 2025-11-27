import React from 'react';
import './DreamTempleSteps.css';

const DreamTempleSteps = () => {
  const steps = [
    {
      number: 1,
      icon: '💼',
      title: 'Initial Consultation',
      description: 'Discuss your vision and requirements with our expert team'
    },
    {
      number: 2,
      icon: '📐',
      title: 'Design Approval',
      description: 'Review and approve custom designs tailored to your needs'
    },
    {
      number: 3,
      icon: '🤝',
      title: 'Manufacturing',
      description: 'Skilled artisans handcraft your temple with precision'
    },
    {
      number: 4,
      icon: '🏗️',
      title: 'Installation',
      description: 'Professional installation at your preferred location'
    },
    {
      number: 5,
      icon: '✨',
      title: 'Delivery',
      description: 'Complete your dream temple ready for worship'
    }
  ];

  return (
    <section className="dream-temple-steps">
      <div className="container">
        <h2 className="section-title">Your Dream Temple in 5 steps</h2>
        <div className="steps-grid">
          {steps.map((step) => (
            <div key={step.number} className="step-card">
              <div className="step-icon">{step.icon}</div>
              <div className="step-number">{step.number}</div>
              <h3 className="step-title">{step.title}</h3>
              <p className="step-description">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default DreamTempleSteps;

