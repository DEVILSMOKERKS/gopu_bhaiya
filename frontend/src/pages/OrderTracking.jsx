import React, { useState } from 'react';
import axios from 'axios';
import './OrderTracking.css';

const API_URL = import.meta.env.VITE_API_URL;

const OrderTracking = () => {
  const [orderNumber, setOrderNumber] = useState('');
  const [order, setOrder] = useState(null);
  const [tracking, setTracking] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleTrackOrder = async (e) => {
    e.preventDefault();
    
    if (!orderNumber.trim()) {
      setError('Please enter an order number');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await axios.get(`${API_URL}/orders/track/${orderNumber}`);

      if (response.data.success) {
        setOrder(response.data.data.order);
        setTracking(response.data.data.tracking);
      }
    } catch (error) {
      console.error('Error tracking order:', error);
      setError('Order not found or invalid order number');
      setOrder(null);
      setTracking([]);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const statusColors = {
      pending: '#f39c12',
      processing: '#3498db',
      shipped: '#9b59b6',
      delivered: '#27ae60',
      cancelled: '#e74c3c',
      returned: '#95a5a6'
    };
    return statusColors[status] || '#95a5a6';
  };

  const getStatusText = (status) => {
    const statusTexts = {
      pending: 'Pending',
      processing: 'Processing',
      shipped: 'Shipped',
      delivered: 'Delivered',
      cancelled: 'Cancelled',
      returned: 'Returned'
    };
    return statusTexts[status] || status;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="order-tracking-container">
      <div className="tracking-header">
        <div className="tracking-icon">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2L2 7l10 5 10-5-10-5z"/>
            <path d="M2 17l10 5 10-5"/>
            <path d="M2 12l10 5 10-5"/>
          </svg>
        </div>
        <h1>Track Your Order</h1>
        <p>Enter your order number to track your package</p>
      </div>

      {/* Tracking Form */}
      <div className="tracking-form-section">
        <form onSubmit={handleTrackOrder} className="tracking-form">
          <div className="form-group">
            <label htmlFor="orderNumber">Order Number</label>
            <input
              type="text"
              id="orderNumber"
              value={orderNumber}
              onChange={(e) => setOrderNumber(e.target.value)}
              placeholder="Enter your order number (e.g., SAANZ1234567890)"
              className="order-number-input"
            />
          </div>
          <button type="submit" className="track-btn" disabled={loading}>
            {loading ? 'Tracking...' : 'Track Order'}
          </button>
        </form>
      </div>

      {/* Error Message */}
      {error && (
        <div className="error-message">
          <p>{error}</p>
        </div>
      )}

      {/* Order Details */}
      {order && (
        <div className="order-details-section">
          <div className="order-summary">
            <h2>Order #{order.order_number}</h2>
            <div className="order-status">
              <span 
                className="status-badge"
                style={{ backgroundColor: getStatusColor(order.order_status) }}
              >
                {getStatusText(order.order_status)}
              </span>
            </div>
            <div className="order-info">
              <p><strong>Order Date:</strong> {formatDate(order.created_at)}</p>
              <p><strong>Total Amount:</strong> ₹{order.final_amount}</p>
              <p><strong>Payment Status:</strong> 
                <span className={`payment-status ${order.payment_status}`}>
                  {order.payment_status === 'paid' ? 'Paid' : 'Pending'}
                </span>
              </p>
              {order.tracking_number && (
                <p><strong>Tracking Number:</strong> {order.tracking_number}</p>
              )}
              
            </div>
          </div>

          {/* Tracking Timeline */}
          <div className="tracking-timeline-section">
            <h3>Order Timeline</h3>
            <div className="tracking-timeline">
              {tracking.map((track, index) => (
                <div key={index} className="tracking-item">
                  <div className="tracking-dot"></div>
                  <div className="tracking-content">
                    <h4>{getStatusText(track.status)}</h4>
                    <p>{track.description}</p>
                    <span className="tracking-date">{formatDate(track.created_at)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Delivery Status */}
          <div className="delivery-status-section">
            <h3>Delivery Status</h3>
            <div className="delivery-progress">
              {['pending', 'processing', 'shipped', 'delivered'].map((status, index) => (
                <div key={status} className="progress-step">
                  <div className={`step-icon ${order.order_status === status ? 'active' : 
                    tracking.some(t => t.status === status) ? 'completed' : ''}`}>
                    {tracking.some(t => t.status === status) ? '✓' : index + 1}
                  </div>
                  <div className="step-label">
                    <span>{getStatusText(status)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Help Section */}
      <div className="help-section">
        <h3>Need Help?</h3>
        <div className="help-content">
          <div className="help-item">
            <div className="help-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/>
                <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
                <line x1="12" y1="17" x2="12.01" y2="17"/>
              </svg>
            </div>
            <h4>Can't find your order?</h4>
            <p>Make sure you're entering the correct order number. You can find it in your order confirmation email or in your account dashboard.</p>
          </div>
          <div className="help-item">
            <div className="help-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="3"/>
                <path d="M12 1v6m0 6v6"/>
                <path d="M21 12h-6m-6 0H3"/>
              </svg>
            </div>
            <h4>Order not updating?</h4>
            <p>Tracking information is updated in real-time. If you don't see recent updates, please check back later or contact our support team.</p>
          </div>
          <div className="help-item">
            <div className="help-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
              </svg>
            </div>
            <h4>Contact Support</h4>
            <p>If you have any questions about your order, please contact our customer support team.</p>
            <button className="contact-btn">Contact Support</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderTracking;
