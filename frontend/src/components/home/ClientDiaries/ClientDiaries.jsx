import React from 'react';
import './ClientDiaries.css';

const ClientDiaries = () => {
  const testimonials = [
    {
      id: 1,
      name: 'Client Name 1',
      image: 'https://via.placeholder.com/100x100/8B4513/FFFFFF?text=C1',
      quote: 'Exceptional craftsmanship and beautiful designs.'
    },
    {
      id: 2,
      name: 'Client Name 2',
      image: 'https://via.placeholder.com/100x100/8B4513/FFFFFF?text=C2',
      quote: 'Our temple looks absolutely divine!'
    },
    {
      id: 3,
      name: 'Client Name 3',
      image: 'https://via.placeholder.com/100x100/8B4513/FFFFFF?text=C3',
      quote: 'Best quality marble idols we\'ve ever seen.'
    },
    {
      id: 4,
      name: 'Client Name 4',
      image: 'https://via.placeholder.com/100x100/8B4513/FFFFFF?text=C4',
      quote: 'Professional service from start to finish.'
    },
    {
      id: 5,
      name: 'Client Name 5',
      image: 'https://via.placeholder.com/100x100/8B4513/FFFFFF?text=C5',
      quote: 'Highly recommend Mateshwari Exports!'
    },
    {
      id: 6,
      name: 'Client Name 6',
      image: 'https://via.placeholder.com/100x100/8B4513/FFFFFF?text=C6',
      quote: 'Exceeded all our expectations.'
    }
  ];

  return (
    <section className="client-diaries">
      <div className="container">
        <h2 className="section-title">MATESHWARI EXPORTS' Client Diaries</h2>
        <div className="testimonials-grid">
          {testimonials.map((testimonial) => (
            <div key={testimonial.id} className="testimonial-card">
              <div className="testimonial-image">
                <img 
                  src={testimonial.image} 
                  alt={testimonial.name}
                  className="client-image"
                />
              </div>
              <div className="testimonial-content">
                <p className="testimonial-quote">"{testimonial.quote}"</p>
                <p className="testimonial-name">- {testimonial.name}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ClientDiaries;

