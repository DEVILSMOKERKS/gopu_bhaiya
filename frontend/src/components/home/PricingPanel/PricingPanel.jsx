import React, { useState } from 'react';
import { HiX } from 'react-icons/hi';
import { FiChevronDown, FiChevronUp } from 'react-icons/fi';
import './PricingPanel.css';
import mandirImg from '../../../assets/Images/banner/mandir.jpg';
import marbleMandirImg from '../../../assets/Images/banner/marbleMandir.jpg';
import GirlImg from '../../../assets/Images/banner/girl.jpg';
import Image from 'next/image';

const PricingPanel = ({ isOpen, onClose }) => {
  const [openFaq, setOpenFaq] = useState(0);

  if (!isOpen) return null;

  const scopeOfWork = [
    {
      icon: '🎨',
      title: 'DESIGN & CONCEPTUALIZATION',
      description: 'Our expert designers work closely with you to create a unique design that reflects your vision and spiritual needs.'
    },
    {
      icon: '💎',
      title: 'MATERIAL SELECTION',
      description: 'We source premium marble and stones from trusted suppliers, ensuring quality and authenticity in every piece.'
    },
    {
      icon: '🛠️',
      title: 'HANDCRAFTED ARTISTRY',
      description: 'Skilled artisans bring designs to life with meticulous attention to detail and traditional craftsmanship techniques.'
    },
    {
      icon: '✨',
      title: 'CUSTOM FEATURES',
      description: 'From lighting to storage solutions, we customize every aspect to meet your specific requirements.'
    },
    {
      icon: '📦',
      title: 'PROJECT MANAGEMENT & INSTALLATION',
      description: 'Complete project oversight from start to finish, including professional installation at your location.'
    }
  ];

  const pricingFactors = [
    {
      number: 1,
      title: 'DESIGN COMPLEXITY',
      description: 'Intricate carvings, custom motifs, and architectural details significantly influence the final pricing.'
    },
    {
      number: 2,
      title: 'MATERIAL QUALITY',
      description: 'Premium marble grades, imported stones, and special finishes contribute to the overall cost.'
    },
    {
      number: 3,
      title: 'SIZE & SCALE',
      description: 'Larger spaces require more materials, extended labor time, and complex structural considerations.'
    },
    {
      number: 4,
      title: 'CUSTOMIZATION',
      description: 'Personalized features, unique designs, and special requirements add to the project value.'
    },
    {
      number: 5,
      title: 'LOCATION & LOGISTICS',
      description: 'Delivery distance, installation complexity, and site accessibility factors into pricing.'
    }
  ];

  const whyChoose = [
    {
      icon: '🏆',
      title: 'UNMATCHED CRAFTSMANSHIP',
      description: 'Generations of expertise combined with modern techniques ensure exceptional quality in every project.'
    },
    {
      icon: '👤',
      title: 'PERSONALIZED EXPERIENCE',
      description: 'Dedicated project managers guide you through every step, ensuring your vision becomes reality.'
    },
    {
      icon: '🌍',
      title: 'GLOBAL EXPERTISE',
      description: 'We serve clients worldwide, bringing traditional Indian artistry to homes across the globe.'
    }
  ];

  const pricingTiers = [
    {
      tier: 'ELEGANT ESSENTIALS',
      price: '₹2-5 LAKH',
      description: 'Perfect for compact spaces with a focus on simplicity and functionality.'
    },
    {
      tier: 'SIGNATURE DESIGNS',
      price: '₹12-50 LAKH',
      description: 'Mid-sized temples featuring moderate detailing and premium materials.'
    },
    {
      tier: 'BESPOKE MASTERPIECES',
      price: '₹50 LAKH+',
      description: 'Grandeur redefined with intricate carvings, premium embellishments, and custom features.'
    }
  ];

  const processSteps = [
    {
      icon: '📅',
      step: 1,
      title: 'BOOK A CONSULTATION',
      description: 'Schedule a meeting with our design experts to discuss your vision and requirements.'
    },
    {
      icon: '📋',
      step: 2,
      title: 'RECEIVE A CUSTOMIZED QUOTATION',
      description: 'Get a detailed quote tailored to your specific design, materials, and customization needs.'
    },
    {
      icon: '✨',
      step: 3,
      title: 'EXPERIENCE THE DIVINE TRANSFORMATION',
      description: 'Watch your dream temple come to life through our meticulous craftsmanship and installation.'
    }
  ];

  const faqs = [
    {
      question: 'Can I choose the materials for my temple?',
      answer: 'Yes, we offer a wide range of premium stones and finishes for you to choose from.'
    },
    {
      question: 'Do you deliver and install internationally?',
      answer: 'Yes, we have experience delivering and installing our temples worldwide. We handle all logistics and customs requirements.'
    },
    {
      question: 'Can I get a budget-friendly option?',
      answer: 'Absolutely! We offer various pricing tiers starting from ₹2 lakh, ensuring there\'s an option for every budget.'
    }
  ];

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <>
      {/* Backdrop */}
      <div className="pricing-panel-backdrop" onClick={onClose}></div>

      {/* Slide-in Panel */}
      <div className={`pricing-panel ${isOpen ? 'open' : ''}`}>
        {/* Panel Content */}
        <div className="pricing-panel-content">
          {/* Close Button */}
          <button className="pricing-panel-close" onClick={onClose} aria-label="Close">
            <HiX />
          </button>

          {/* Header Section */}
          <div className="pricing-panel-header">
            <h1 className="pricing-panel-main-title">
              UNDERSTANDING THE PRICING OF OUR DREAM TEMPLES & POOJA ROOMS
            </h1>
          </div>

          {/* Hero Image Section */}
          <div className="pricing-hero-image-section">
            <div className="pricing-hero-image-wrapper">
              <Image
                src={marbleMandirImg || "https://images.unsplash.com/photo-1600607687644-c7171b42498b?w=1200&q=90&auto=format&fit=crop"}
                alt="Pooja Room"
                className="pricing-hero-image"
                width={1200}
                height={600}
                style={{ width: '100%', height: 'auto' }}
              />
              {/* Left Overlay */}
              <div className="pricing-hero-overlay pricing-hero-overlay-left">
                <div className="pricing-hero-overlay-price">Starting at INR 12L</div>
                <div className="pricing-hero-overlay-size">Upto 50 Sqft</div>
              </div>
              {/* Right Overlay */}
              <div className="pricing-hero-overlay pricing-hero-overlay-right">
                <div className="pricing-hero-overlay-price">Starting at INR 50L+</div>
                <div className="pricing-hero-overlay-size">500+ Sqft</div>
              </div>
            </div>
          </div>

          {/* Philosophy Section */}
          <div className="pricing-philosophy-section">
            <h2 className="pricing-section-title">
              WHERE ELEGANCE MEETS DEVOTION - A GLIMPSE INTO OUR PRICING PHILOSOPHY
            </h2>
            <p className="pricing-philosophy-text">
              At Tilak Stone Arts, each temple and pooja room is a masterpiece, designed to bring peace and sanctity to your home. Our pricing reflects the custom craftsmanship, premium materials, and unparalleled artistry that go into creating a sacred space tailored exclusively for you.
            </p>
            <p className="pricing-philosophy-text">
              We believe in transparent pricing that reflects the true value of handcrafted artistry. Every rupee invested goes towards creating a timeless piece that honors both your devotion and your aesthetic vision.
            </p>
          </div>

          {/* Scope of Work Section */}
          <div className="pricing-scope-section">
            <h2 className="pricing-section-title">OUR SCOPE OF WORK</h2>
            <p className="pricing-section-intro">
              Each project involves a seamless blend of artistry, design, and execution, including
            </p>
            <div className="pricing-cards-grid">
              {scopeOfWork.map((item, index) => (
                <div key={index} className="pricing-scope-card">
                  <div className="pricing-card-icon">{item.icon}</div>
                  <h3 className="pricing-card-title">{item.title}</h3>
                  <p className="pricing-card-description">{item.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Pricing Factors Section */}
          <div className="pricing-factors-section">
            <h2 className="pricing-section-title">FACTORS INFLUENCING PRICING</h2>
            <p className="pricing-section-intro">
              Our pricing is influenced by several key factors that ensure quality and customization
            </p>
            <div className="pricing-factors-grid">
              {pricingFactors.map((factor, index) => (
                <div key={index} className="pricing-factor-card">
                  <div className="pricing-factor-number">{factor.number}</div>
                  <h3 className="pricing-card-title">{factor.title}</h3>
                  <p className="pricing-card-description">{factor.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Why Choose Section */}
          <div className="pricing-why-choose-section">
            <h2 className="pricing-section-title">WHY CHOOSE TILAK STONE ARTS?</h2>
            <p className="pricing-section-intro">
              We stand apart through our commitment to excellence and customer satisfaction
            </p>
            <div className="pricing-why-choose-grid">
              {whyChoose.map((item, index) => (
                <div key={index} className="pricing-why-card">
                  <div className="pricing-card-icon pricing-card-icon-gold">{item.icon}</div>
                  <h3 className="pricing-card-title">{item.title}</h3>
                  <p className="pricing-card-description">{item.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Pricing Tiers Section */}
          <div className="pricing-tiers-section">
            <h2 className="pricing-section-title">PRICING TIERS</h2>
            <ul className="pricing-tiers-list">
              {pricingTiers.map((tier, index) => (
                <li key={index} className="pricing-tier-item">
                  <strong>{tier.tier} ({tier.price}):</strong> {tier.description}
                </li>
              ))}
            </ul>
          </div>

          {/* Process Flow Section */}
          <div className="pricing-process-section">
            <div className="pricing-process-steps">
              {processSteps.map((step, index) => (
                <div key={index} className="pricing-process-step">
                  {index < processSteps.length - 1 && <div className="pricing-process-arrow">→</div>}
                  <div className="pricing-process-step-content">
                    <div className="pricing-process-icon">{step.icon}</div>
                    <h3 className="pricing-process-title">{step.title}</h3>
                    <p className="pricing-process-description">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* FAQ Section */}
          <div className="pricing-faq-section">
            <h2 className="pricing-section-title">FREQUENTLY ASKED QUESTIONS (FAQS)</h2>
            <div className="pricing-faq-list">
              {faqs.map((faq, index) => (
                <div key={index} className="pricing-faq-item">
                  <button
                    className="pricing-faq-question"
                    onClick={() => toggleFaq(index)}
                  >
                    <span>{faq.question}</span>
                    {openFaq === index ? <FiChevronUp /> : <FiChevronDown />}
                  </button>
                  {openFaq === index && (
                    <div className="pricing-faq-answer">
                      <p>{faq.answer}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Call to Action Section */}
          <div className="pricing-cta-section">
            <div className="pricing-cta-content">
              <div className="pricing-cta-text">
                <h2 className="pricing-cta-title">READY TO BRING YOUR DREAM TEMPLE TO LIFE?</h2>
                <p className="pricing-cta-description">
                  Contact us today to begin your journey toward a sacred and elegant space that reflects your devotion.
                </p>
                <button className="pricing-cta-button" onClick={() => window.location.href = '/contact-us'}>
                  Start Now
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PricingPanel;







