'use client';

import React, { useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import './OurCreations.css';
import marbleIdols from '../assets/Images/banner/marbleMandir.jpg';
import templeDesigns from "../assets/Images/banner/mandir.jpg";
import stoneImage from "../assets/Images/banner/manufacturingImage1.jpg"


const OurCreations = () => {
  useEffect(() => {
    document.title = 'Our Creations - Marble Idols, Temple Designs & Custom Pooja Rooms';

    const metaDescriptionContent = 'Explore handcrafted marble idols, temple designs, pooja room concepts, stone carvings, and custom devotional creations by Welcome To Mateshwari Moorti Bhanda.';
    let metaDescription = document.querySelector('meta[name="description"]');

    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.setAttribute('name', 'description');
      document.head.appendChild(metaDescription);
    }

    metaDescription.setAttribute('content', metaDescriptionContent);
  }, []);

  const creations = [
    {
      id: 1,
      title: 'Marble Idols',
      image: marbleIdols,
      description: 'Exquisitely crafted marble idols with intricate details and divine beauty.',
      link: '/shop?category=marble-idols'
    },
    {
      id: 2,
      title: 'Temple Designs',
      image: templeDesigns,
      description: 'Custom temple designs blending traditional artistry with modern architecture.',
      link: '/shop?category=temple'
    },
    {
      id: 3,
      title: 'Pooja Room',
      image: templeDesigns,
      description: 'Beautifully designed pooja rooms for every home and budget.',
      link: '/shop?category=pooja-room'
    },
    {
      id: 4,
      title: 'Stone Carvings',
      image: stoneImage,
      description: 'Hand-carved stone sculptures showcasing ancient craftsmanship.',
      link: '/shop?category=stone-carvings'
    },
    {
      id: 5,
      title: 'Religious Artifacts',
      image: marbleIdols,
      description: 'Sacred religious artifacts and decorative pieces for spiritual spaces.',
      link: '/shop?category=artifacts'
    },
    {
      id: 6,
      title: 'Custom Designs',
      image: templeDesigns,
      description: 'Bespoke creations tailored to your specific requirements and vision.',
      link: '/contact-us'
    }
  ];

  return (
    <main className="our-creations-page">
      <section className="creations-header">
        <p className="creations-eyebrow">Sacred Artistry</p>
        <h1 className="creations-title">Handcrafted Marble Idols, Temple Designs and Custom Creations</h1>
        <p className="creations-subtitle">
          Explore signature marble idols, temple concepts, pooja room ideas, and custom devotional work created with patience, detail, and traditional artistry.
        </p>
      </section>

      <div className="creations-container">
        <section className="creations-grid-section" aria-labelledby="creations-grid-heading">
          <h2 id="creations-grid-heading" className="sr-only">Browse our creation categories</h2>
          <div className="creations-grid">
            {creations.map(creation => (
              <Link key={creation.id} href={creation.link} className="creation-card" aria-label={`Explore ${creation.title}`}>
                <div className="creation-image-wrapper">
                  <Image src={creation.image} alt={creation.title} className="creation-image" fill style={{ objectFit: 'cover' }} />
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
        </section>

        <section className="creations-cta" aria-labelledby="custom-creations-title">
          <h2 id="custom-creations-title" className="cta-title">Interested in Custom Creations?</h2>
          <p className="cta-text">We would love to create a piece that reflects your space, your devotion, and your vision.</p>
          <Link href="/book-appointment" className="cta-button">
            Book a Consultation
          </Link>
        </section>
      </div>
    </main>
  );
};

export default OurCreations;





