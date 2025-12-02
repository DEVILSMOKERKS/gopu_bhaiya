import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import './BookAppointment.css';

const BookAppointment = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    date: '',
    time: '',
    service: '',
    message: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission here
    console.log('Appointment booked:', formData);
    alert('Appointment request submitted! We will contact you soon.');
    setFormData({
      name: '',
      email: '',
      phone: '',
      date: '',
      time: '',
      service: '',
      message: ''
    });
  };

  return (
    <>
      <Helmet>
        <title>Book Appointment - Mateshwari Exports</title>
        <meta name="description" content="Book an appointment with Mateshwari Exports to discuss your spiritual and artistic needs." />
      </Helmet>
      
      <div className="book-appointment-page">
        <div className="book-appointment-header">
          <h1 className="book-appointment-title h2style">Book Appointment</h1>
          <p className="book-appointment-subtitle">
            Schedule a visit to our showroom or request a consultation for your custom requirements
          </p>
        </div>

        <div className="book-appointment-container">
          <div className="book-appointment-content">
            <div className="appointment-form-section">
              <h2 className="appointment-form-title">Schedule Your Visit</h2>
              <form onSubmit={handleSubmit} className="appointment-form">
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="name">Full Name *</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      placeholder="Enter your full name"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="email">Email Address *</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      placeholder="Enter your email"
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="phone">Phone Number *</label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      placeholder="Enter your phone number"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="service">Service Interested In *</label>
                    <select
                      id="service"
                      name="service"
                      value={formData.service}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Select a service</option>
                      <option value="custom-temple">Custom Temple Design</option>
                      <option value="pooja-room">Pooja Room Design</option>
                      <option value="marble-idols">Marble Idols</option>
                      <option value="consultation">General Consultation</option>
                      <option value="bulk-order">Bulk Order</option>
                    </select>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="date">Preferred Date *</label>
                    <input
                      type="date"
                      id="date"
                      name="date"
                      value={formData.date}
                      onChange={handleChange}
                      required
                      min={new Date().toISOString().split('T')[0]}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="time">Preferred Time *</label>
                    <input
                      type="time"
                      id="time"
                      name="time"
                      value={formData.time}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="message">Additional Message</label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows="5"
                    placeholder="Tell us about your requirements..."
                  ></textarea>
                </div>

                <button type="submit" className="appointment-submit-btn">
                  Book Appointment
                </button>
              </form>
            </div>

            <div className="appointment-info-section">
              <h2 className="appointment-info-title">Why Book an Appointment?</h2>
              <div className="appointment-benefits">
                <div className="benefit-item">
                  <div className="benefit-icon">📅</div>
                  <h3>Personalized Consultation</h3>
                  <p>Get expert advice tailored to your specific needs and preferences</p>
                </div>
                <div className="benefit-item">
                  <div className="benefit-icon">🏛️</div>
                  <h3>Showroom Visit</h3>
                  <p>Experience our craftsmanship up close and see our extensive collection</p>
                </div>
                <div className="benefit-item">
                  <div className="benefit-icon">✏️</div>
                  <h3>Custom Design Discussion</h3>
                  <p>Discuss your vision and get professional design recommendations</p>
                </div>
                <div className="benefit-item">
                  <div className="benefit-icon">💰</div>
                  <h3>Pricing & Budget Planning</h3>
                  <p>Understand pricing options and plan your project within your budget</p>
                </div>
              </div>

              <div className="contact-info-card">
                <h3>Contact Information</h3>
                <p><strong>Phone:</strong> 7791983156 | 8824292890 | 9784503338</p>
                <p><strong>Email:</strong> Mateshvariexporter@gmail.com</p>
                <p><strong>Address:</strong> 2310, Khajane walo ka Rasta, Nehru Tailour Chouraha, Chandpole Bazar, Jaipur-302001 (Rajasthan) INDIA</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default BookAppointment;

