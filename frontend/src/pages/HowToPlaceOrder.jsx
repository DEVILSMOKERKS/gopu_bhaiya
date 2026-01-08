'use client';

import React from 'react';
import Link from 'next/link';
import { 
  Search, 
  ShoppingBag, 
  ShoppingCart, 
  CheckCircle, 
  CreditCard, 
  Mail,
  Calendar,
  MessageSquare,
  FileCheck,
  Factory,
  ShieldCheck,
  Truck
} from 'lucide-react';
import './HowToPlaceOrder.css';

const HowToPlaceOrder = () => {
  const steps = [
    {
      id: 1,
      title: 'Browse Our Collection',
      description: 'Explore our wide range of products including marble idols, temple designs, pooja rooms, and custom creations.',
      icon: Search
    },
    {
      id: 2,
      title: 'Select Your Product',
      description: 'Choose the product that matches your requirements. You can filter by category, price, or style.',
      icon: ShoppingBag
    },
    {
      id: 3,
      title: 'Add to Cart',
      description: 'Add your selected items to the cart. You can review and modify your selection before checkout.',
      icon: ShoppingCart
    },
    {
      id: 4,
      title: 'Proceed to Checkout',
      description: 'Review your order, apply any coupon codes, and proceed to checkout with your shipping details.',
      icon: CheckCircle
    },
    {
      id: 5,
      title: 'Choose Payment Method',
      description: 'Select your preferred payment method - Credit/Debit Card, Net Banking, UPI, or Cash on Delivery.',
      icon: CreditCard
    },
    {
      id: 6,
      title: 'Confirm Order',
      description: 'Review all details and confirm your order. You will receive an order confirmation email with tracking details.',
      icon: Mail
    }
  ];

  const customOrderSteps = [
    {
      id: 1,
      title: 'Book a Consultation',
      description: 'Schedule a free consultation with our design experts to discuss your custom requirements.',
      icon: Calendar
    },
    {
      id: 2,
      title: 'Design Discussion',
      description: 'Share your vision, preferences, and budget. Our team will create a customized design proposal.',
      icon: MessageSquare
    },
    {
      id: 3,
      title: 'Approval & Payment',
      description: 'Review and approve the design. Make an advance payment to start the manufacturing process.',
      icon: FileCheck
    },
    {
      id: 4,
      title: 'Production & Updates',
      description: 'We keep you updated throughout the production process with photos and progress reports.',
      icon: Factory
    },
    {
      id: 5,
      title: 'Quality Check',
      description: 'Our quality assurance team inspects every detail before final delivery.',
      icon: ShieldCheck
    },
    {
      id: 6,
      title: 'Delivery & Installation',
      description: 'We deliver and install your custom creation at your location with care and precision.',
      icon: Truck
    }
  ];

  return (
    <div className="how-to-place-order-page">
      <div className="how-to-order-header">
        <h1 className="how-to-order-title">How It Works</h1>
        <p className="how-to-order-subtitle">
          Simple steps to order our products or create custom designs
        </p>
      </div>

      <div className="how-to-order-container">
        {/* Standard Order Process */}
        <section className="order-process-section">
          <h2 className="section-title">Standard Order Process</h2>
          <p className="section-description">
            Follow these simple steps to order from our ready-made collection
          </p>

          <div className="steps-grid">
            {steps.map((step, index) => {
              const IconComponent = step.icon;
              return (
                <div key={step.id} className="step-card">
                  <div className="step-number">{index + 1}</div>
                  <div className="step-icon-wrapper">
                    <IconComponent className="step-icon" size={24} strokeWidth={1.5} />
                  </div>
                  <h3 className="step-title">{step.title}</h3>
                  <p className="step-description">{step.description}</p>
                </div>
              );
            })}
          </div>

          <div className="cta-section">
            <Link href="/shop" className="cta-button-primary">
              Start Shopping Now
            </Link>
          </div>
        </section>

        {/* Custom Order Process */}
        <section className="order-process-section custom-order-section">
          <h2 className="section-title">Custom Order Process</h2>
          <p className="section-description">
            For bespoke creations tailored to your specific requirements
          </p>

          <div className="steps-grid">
            {customOrderSteps.map((step, index) => {
              const IconComponent = step.icon;
              return (
                <div key={step.id} className="step-card">
                  <div className="step-number">{index + 1}</div>
                  <div className="step-icon-wrapper">
                    <IconComponent className="step-icon" size={24} strokeWidth={1.5} />
                  </div>
                  <h3 className="step-title">{step.title}</h3>
                  <p className="step-description">{step.description}</p>
                </div>
              );
            })}
          </div>

          <div className="cta-section">
            <Link href="/book-appointment" className="cta-button-primary">
              Book a Consultation
            </Link>
          </div>
        </section>

        {/* Additional Information */}
        <section className="additional-info-section">
          <h2 className="section-title">Need Help?</h2>
          <div className="info-cards">
            <div className="info-card">
              <h3>Contact Us</h3>
              <p>Call us at +91 77919 83156 for immediate assistance</p>
              <Link href="/contact-us" className="info-link">Contact Page →</Link>
            </div>
            <div className="info-card">
              <h3>Live Chat</h3>
              <p>Chat with our support team for quick answers</p>
              <Link href="/contact-us" className="info-link">Start Chat →</Link>
            </div>
            <div className="info-card">
              <h3>Email Support</h3>
              <p>Email us at Mateshvariexporter@gmail.com</p>
              <a href="mailto:Mateshvariexporter@gmail.com" className="info-link">Send Email →</a>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default HowToPlaceOrder;
