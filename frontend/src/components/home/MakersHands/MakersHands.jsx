import React from 'react';
import './MakersHands.css';

const MakersHands = () => {
  const features = [
    {
      icon: '🇮🇳',
      title: 'Made in India',
      description: 'Proudly crafted in India with traditional techniques'
    },
    {
      icon: '👨‍🎨',
      title: 'Hand carved by experienced carvers',
      description: 'Skilled artisans with decades of experience'
    },
    {
      icon: '🎨',
      title: 'Customise 5,00,000+ products',
      description: 'Extensive range of customizable designs'
    },
    {
      icon: '🏛️',
      title: 'Diversity with rich culture',
      description: 'Celebrating India\'s rich cultural heritage'
    }
  ];

  return (
    <section className="makers-hands">
      <div className="container">
        <h2 className="section-title">Direct From The Makers' Hands</h2>
        <div className="features-grid">
          {features.map((feature, index) => (
            <div key={index} className="feature-card">
              <div className="feature-icon">{feature.icon}</div>
              <h3 className="feature-title">{feature.title}</h3>
              <p className="feature-description">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default MakersHands;

