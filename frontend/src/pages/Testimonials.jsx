'use client';

import { useState } from 'react';
import Image from 'next/image';
import './Testimonials.css';
import { FaStar, FaQuoteLeft } from 'react-icons/fa';
import placeholderAvatar from '../assets/Images/placeholder-avatar.webp';

const Testimonials = () => {
  const [activeFilter, setActiveFilter] = useState('all');

  const testimonials = [
    {
      id: 1,
      name: 'Rajesh Kumar',
      location: 'Mumbai, Maharashtra',
      rating: 5,
      image: placeholderAvatar,
      category: 'temple',
      text: 'The custom temple design exceeded our expectations. The craftsmanship and attention to detail are outstanding. Our family is truly blessed to have such a beautiful pooja room.',
      date: '2024-01-15'
    },
    {
      id: 2,
      name: 'Priya Sharma',
      location: 'Delhi, NCR',
      rating: 5,
      image: placeholderAvatar,
      category: 'idols',
      text: 'The marble idols we purchased are absolutely stunning. The quality is exceptional and they arrived well-packaged. Highly recommend Mateshwari Exports!',
      date: '2024-02-20'
    },
    {
      id: 3,
      name: 'Vikram Singh',
      location: 'Jaipur, Rajasthan',
      rating: 5,
      image: placeholderAvatar,
      category: 'pooja-room',
      text: 'Professional service from start to finish. They helped us design our dream pooja room within our budget. The team was responsive and the final result is beautiful.',
      date: '2024-03-10'
    },
    {
      id: 4,
      name: 'Anita Patel',
      location: 'Ahmedabad, Gujarat',
      rating: 5,
      image: placeholderAvatar,
      category: 'temple',
      text: 'We ordered a custom temple and the entire process was smooth. The design team understood our vision perfectly and delivered exactly what we wanted.',
      date: '2024-03-25'
    },
    {
      id: 5,
      name: 'Suresh Reddy',
      location: 'Bangalore, Karnataka',
      rating: 5,
      image: placeholderAvatar,
      category: 'idols',
      text: 'Excellent quality marble idols at reasonable prices. The customer service is top-notch and delivery was prompt. Will definitely order again!',
      date: '2024-04-05'
    },
    {
      id: 6,
      name: 'Meera Joshi',
      location: 'Pune, Maharashtra',
      rating: 5,
      image: placeholderAvatar,
      category: 'pooja-room',
      text: 'Our pooja room looks amazing! The attention to detail in the carvings is incredible. Thank you for making our home more spiritual and beautiful.',
      date: '2024-04-18'
    }
  ];

  const categories = ['all', 'temple', 'pooja-room', 'idols'];

  const filteredTestimonials = activeFilter === 'all'
    ? testimonials
    : testimonials.filter(t => t.category === activeFilter);

  const renderStars = (rating) => {
    return [...Array(5)].map((_, index) => (
      <FaStar
        key={index}
        className={index < rating ? 'star filled' : 'star'}
      />
    ));
  };

  return (
    <div className="testimonials-page">
      <div className="testimonials-header">
        <h1 className="testimonials-title h2style">Testimonials</h1>
        <p className="testimonials-subtitle">
          Hear from our satisfied customers about their experience with Mateshwari Exports
        </p>
      </div>

      <div className="testimonials-container">
        <div className="testimonials-filters">
          {categories.map(category => (
            <button
              key={category}
              className={`filter-btn ${activeFilter === category ? 'active' : ''}`}
              onClick={() => setActiveFilter(category)}
            >
              {category === 'all' ? 'All' : category.replace('-', ' ').toUpperCase()}
            </button>
          ))}
        </div>

        <div className="testimonials-grid">
          {filteredTestimonials.map(testimonial => (
            <div key={testimonial.id} className="testimonial-card">
              <div className="testimonial-header">
                <div className="testimonial-avatar">
                  <Image src={testimonial.image} alt={testimonial.name} width={60} height={60} style={{ objectFit: 'cover' }} />
                </div>
                <div className="testimonial-info">
                  <h3 className="testimonial-name">{testimonial.name}</h3>
                  <p className="testimonial-location">{testimonial.location}</p>
                  <div className="testimonial-rating">
                    {renderStars(testimonial.rating)}
                  </div>
                </div>
              </div>
              <div className="testimonial-content">
                <FaQuoteLeft className="quote-icon" />
                <p className="testimonial-text">{testimonial.text}</p>
              </div>
              <div className="testimonial-footer">
                <span className="testimonial-date">{new Date(testimonial.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                <span className="testimonial-category">{testimonial.category.replace('-', ' ').toUpperCase()}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Testimonials;










