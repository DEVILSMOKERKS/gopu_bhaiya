import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import './OurServices.css';

const OurServices = () => {
  const services = [
    {
      id: 1,
      title: 'Custom Temple Design',
      icon: '🏛️',
      description: 'Complete temple design services from concept to execution, tailored to your space and requirements.',
      features: ['Design consultation', '3D visualization', 'Material selection', 'Installation support']
    },
    {
      id: 2,
      title: 'Pooja Room Design',
      icon: '🕉️',
      description: 'Beautiful pooja room designs for homes of all sizes, blending tradition with modern aesthetics.',
      features: ['Space planning', 'Custom storage', 'Lighting design', 'Complete installation']
    },
    {
      id: 3,
      title: 'Marble Idol Crafting',
      icon: '🎨',
      description: 'Handcrafted marble idols created by skilled artisans using traditional techniques and premium materials.',
      features: ['Custom designs', 'Multiple sizes', 'Premium marble', 'Fine detailing']
    },
    {
      id: 4,
      title: 'Bulk Orders',
      icon: '📦',
      description: 'Specialized services for bulk orders with competitive pricing and flexible delivery options.',
      features: ['Volume discounts', 'Custom specifications', 'Quality assurance', 'Timely delivery']
    },
    {
      id: 5,
      title: 'Consultation Services',
      icon: '💼',
      description: 'Expert consultation to help you make informed decisions about your spiritual space requirements.',
      features: ['Design advice', 'Budget planning', 'Material guidance', 'Project management']
    },
    {
      id: 6,
      title: 'Maintenance & Care',
      icon: '🔧',
      description: 'Comprehensive maintenance services to keep your spiritual spaces looking beautiful for years.',
      features: ['Cleaning services', 'Restoration', 'Repair work', 'Care guidance']
    }
  ];

  return (
    <>
      <Helmet>
        <title>Our Services - Mateshwari Exports</title>
        <meta name="description" content="Comprehensive services for temple design, pooja rooms, marble idols, and more." />
      </Helmet>

      <div className="our-services-page">
        <div className="services-header">
          <h1 className="services-title h2style">Our Services</h1>
          <p className="services-subtitle">
            Comprehensive solutions for all your spiritual and artistic needs
          </p>
        </div>

        <div className="services-container">
          <div className="services-grid">
            {services.map(service => (
              <div key={service.id} className="service-card">
                <div className="service-icon">{service.icon}</div>
                <h3 className="service-card-title">{service.title}</h3>
                <p className="service-description">{service.description}</p>
                <ul className="service-features">
                  {service.features.map((feature, index) => (
                    <li key={index}>{feature}</li>
                  ))}
                </ul>
                <Link to="/book-appointment" className="service-cta-btn">
                  Learn More
                </Link>
              </div>
            ))}
          </div>

          <div className="services-cta-section">
            <div className="cta-content">
              <h2 className="cta-heading">Ready to Start Your Project?</h2>
              <p className="cta-description">
                Contact us today to discuss your requirements and get a personalized quote
              </p>
              <div className="cta-buttons">
                <Link to="/book-appointment" className="cta-primary-btn">
                  Book Appointment
                </Link>
                <Link to="/contact-us" className="cta-secondary-btn">
                  Contact Us
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default OurServices;



