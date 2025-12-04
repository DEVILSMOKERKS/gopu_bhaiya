'use client';

import React from 'react';
import { Helmet } from 'react-helmet-async';
import Link from 'next/link';
import './OurCreations.css';

const OurCreations = () => {
  const creations = [
    {
      id: 1,
      title: 'Marble Idols',
      image: '/placeholder-creation.jpg',
      description: 'Exquisitely crafted marble idols with intricate details and divine beauty.',
      link: '/shop?category=marble-idols'
    },
    {
      id: 2,
      title: 'Temple Designs',
      image: '/placeholder-creation.jpg',
      description: 'Custom temple designs blending traditional artistry with modern architecture.',
      link: '/shop?category=temple'
    },
    {
      id: 3,
      title: 'Pooja Room',
      image: '/placeholder-creation.jpg',
      description: 'Beautifully designed pooja rooms for every home and budget.',
      link: '/shop?category=pooja-room'
    },
    {
      id: 4,
      title: 'Stone Carvings',
      image: '/placeholder-creation.jpg',
      description: 'Hand-carved stone sculptures showcasing ancient craftsmanship.',
      link: '/shop?category=stone-carvings'
    },
    {
      id: 5,
      title: 'Religious Artifacts',
      image: '/placeholder-creation.jpg',
      description: 'Sacred religious artifacts and decorative pieces for spiritual spaces.',
      link: '/shop?category=artifacts'
    },
    {
      id: 6,
      title: 'Custom Designs',
      image: '/placeholder-creation.jpg',
      description: 'Bespoke creations tailored to your specific requirements and vision.',
      link: '/contact-us'
    }
  ];

  return (
    <>
      <Helmet>
        <title>Our Creations - Mateshwari Exports</title>
        <meta name="description" content="Explore our beautiful creations including marble idols, temple designs, and custom artworks." />
      </Helmet>

      <div className="our-creations-page">
        <div className="creations-header">
          <h1 className="creations-title h2style">Our Creations</h1>
          <p className="creations-subtitle">
            Discover our exquisite collection of handcrafted spiritual and artistic creations
          </p>
        </div>

        <div className="creations-container">
          <div className="creations-grid">
            {creations.map(creation => (
              <Link key={creation.id} to={creation.link} className="creation-card">
                <div className="creation-image-wrapper">
                  <img src={creation.image} alt={creation.title} className="creation-image" />
                  <div className="creation-overlay">
                    <span className="creation-view-text">View Collection</span>
                  </div>
                </div>
                <div className="creation-content">
                  <h3 className="creation-card-title">{creation.title}</h3>
                  <p className="creation-description">{creation.description}</p>
                </div>
              </Link>
            ))}
          </div>

          <div className="creations-cta">
            <h2 className="cta-title">Interested in Custom Creations?</h2>
            <p className="cta-text">We specialize in creating unique pieces tailored to your vision</p>
            <Link href="/book-appointment" className="cta-button">
              Book a Consultation
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default OurCreations;





