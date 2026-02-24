'use client';
import { useState } from 'react';
import { HiX } from 'react-icons/hi';
import axios from 'axios';
import './expertPopup.css';

const ExpertPopup = ({ isOpen, onClose, API_URL }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    productName: '',
    quantity: 1,
  });
  const [status, setStatus] = useState({ loading: false, message: '', type: '' });

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ loading: true, message: '', type: '' });

    try {
      const response = await axios.post(`${API_URL}/expert-inquiry`, formData);
      
      setStatus({ 
        loading: false, 
        message: 'Success! Our experts will contact you soon.', 
        type: 'success' 
      });

      // Reset and close after 2 seconds
      setTimeout(() => {
        setFormData({ name: '', email: '', productName: '', quantity: 1 });
        setStatus({ loading: false, message: '', type: '' });
        onClose();
      }, 2500);

    } catch (error) {
      console.error("Submission error:", error);
      setStatus({ 
        loading: false, 
        message: error.response?.data?.message || 'Something went wrong. Please try again.', 
        type: 'error' 
      });
    }
  };

  return (
    <div className="expert-popup-overlay" onClick={onClose}>
      <div className="expert-popup-content" onClick={(e) => e.stopPropagation()}>
        <button className="expert-popup-close" onClick={onClose}><HiX /></button>
        
        <div className="expert-popup-grid">
          <div className="expert-popup-info">
            <h3>Talk to Our Export Experts</h3>
            <p>Share your requirements for bulk orders, customization, or overseas shipments. Our team will get back to you with the best options.</p>

            <ul className="expert-highlight-list">
              <li><span>✔</span> Expert guidance on product selection</li>
              <li><span>✔</span> Flexible quantities & customization</li>
              <li><span>✔</span> Fast response within 24 hours</li>
            </ul>

            <div className="expert-assurance">
              Your details are safe with us and used only to respond to your inquiry.
            </div>
          </div>

          <form onSubmit={handleSubmit} className="expert-popup-form">
            <div className="form-input-group">
              <label>Full Name</label>
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your name"
              />
            </div>

            <div className="form-input-group">
              <label>Email Address</label>
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="example@mail.com"
              />
            </div>

            <div className="form-input-group">
              <label>Product Name / Category</label>
              <input
                type="text"
                name="productName"
                required
                value={formData.productName}
                onChange={handleChange}
                placeholder="Which product are you interested in?"
              />
            </div>

            <div className="form-input-group">
              <label>Approximate Quantity</label>
              <input
                type="number"
                name="quantity"
                min="1"
                required
                value={formData.quantity}
                onChange={handleChange}
              />
            </div>
            
            <button
              type="submit"
              disabled={status.loading}
              className={`expert-form-submit ${status.loading ? 'loading' : ''}`}
            >
              {status.loading ? 'Sending your inquiry...' : 'Send Inquiry'}
            </button>

            {status.message && (
              <div className={`status-alert ${status.type}`}>
                {status.message}
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default ExpertPopup;