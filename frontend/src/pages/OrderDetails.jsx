'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import './OrderDetails.css';

const API_URL = process.env.NEXT_PUBLIC_API_URL

const OrderDetails = ({ orderId }) => {
  const router = useRouter();
  const [order, setOrder] = useState(null);
  const [items, setItems] = useState([]);
  const [tracking, setTracking] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showReturnModal, setShowReturnModal] = useState(false);
  const [returnReason, setReturnReason] = useState('');

  useEffect(() => {
    fetchOrderDetails();
  }, [orderId]);

  const fetchOrderDetails = async () => {
    try {
      setLoading(true);
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

      if (!token) {
        router.push('/login');
        return;
      }

      const response = await axios.get(`${API_URL}/orders/order/${orderId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        setOrder(response.data.data.order);
        setItems(response.data.data.items);
        setTracking(response.data.data.tracking);
      }
    } catch (error) {
      console.error('Error fetching order details:', error);
      setError('Failed to load order details');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = async () => {
    if (!window.confirm('Are you sure you want to cancel this order?')) {
      return;
    }

    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      const response = await axios.post(`${API_URL}/orders/cancel/${orderId}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        alert('Order cancelled successfully');
        fetchOrderDetails();
      }
    } catch (error) {
      console.error('Error cancelling order:', error);
      alert('Failed to cancel order');
    }
  };

  const handleReturnOrder = async () => {
    if (!returnReason.trim()) {
      alert('Please provide a reason for return');
      return;
    }

    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      const response = await axios.post(`${API_URL}/orders/return/${orderId}`, {
        reason: returnReason
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        alert('Return request submitted successfully');
        setShowReturnModal(false);
        setReturnReason('');
        fetchOrderDetails();
      }
    } catch (error) {
      console.error('Error returning order:', error);
      alert('Failed to submit return request');
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

  const formatAddress = (address) => {
    if (typeof address === 'string') {
      address = JSON.parse(address);
    }
    return `${address.address}, ${address.city}, ${address.postalCode}`;
  };

  const handleBackToOrders = () => {
    if (typeof window !== 'undefined') {
      const lastOrdersPath = sessionStorage.getItem('last_orders_path');
      if (lastOrdersPath && lastOrdersPath.startsWith('/orders')) {
        router.push(lastOrdersPath);
        return;
      }
    }
    router.push('/orders');
  };

  if (loading) {
    return (
      <div className="order-details-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading order details...</p>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="order-details-container">
        <div className="error-message">
          <p>{error || 'Order not found'}</p>
          <button onClick={handleBackToOrders}>Back to Orders</button>
        </div>
      </div>
    );
  }

  return (
    <div className="order-details-container">
      {/* Header */}
      <div className="order-details-header">
        <button className="back-btn" onClick={handleBackToOrders}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          Back to Orders
        </button>
        <h1>Order #{order.order_number}</h1>
        <div className="order-status-header">
          <span
            className="status-badge"
            style={{ backgroundColor: getStatusColor(order.order_status) }}
          >
            {getStatusText(order.order_status)}
          </span>
        </div>
      </div>

      <div className="order-details-content">
        {/* Order Summary */}
        <div className="order-summary-section">
          <h2>Order Summary</h2>
          <div className="summary-grid">
            <div className="summary-item">
              <span className="label">Order Date:</span>
              <span className="value">{formatDate(order.created_at)}</span>
            </div>
            <div className="summary-item">
              <span className="label">Payment Method:</span>
              <span className="value">{order.payment_method}</span>
            </div>
            <div className="summary-item">
              <span className="label">Payment Status:</span>
              <span className={`value payment-status ${order.payment_status}`}>
                {order.payment_status === 'paid' ? 'Paid' : 'Pending'}
              </span>
            </div>
            {order.tracking_number && (
              <div className="summary-item">
                <span className="label">Tracking Number:</span>
                <span className="value">{order.tracking_number}</span>
              </div>
            )}

          </div>
        </div>

        {/* Order Items */}
        <div className="order-items-section">
          <h2>Order Items ({items.length})</h2>
          <div className="items-list">
            {items.map((item, index) => (
              <div key={index} className="item-card">
                <div className="item-image">
                  <Image
                    src={item.product_image ? `${API_URL.replace('/api', '')}${item.product_image}` : '/src/assets/img/Bestseller1.jpg'}
                    alt={item.product_name}
                    width={100}
                    height={100}
                    style={{ objectFit: 'cover' }}
                    onError={(e) => {
                      e.target.src = '/src/assets/img/Bestseller1.jpg';
                    }}
                  />
                </div>
                <div className="item-details">
                  <h3>{item.product_name}</h3>
                  <p className="item-variants">
                    {item.color_name && <span>Color: {item.color_name}</span>}
                    {item.size && <span>Size: {item.size}</span>}
                  </p>
                  <p className="item-price">Quantity: {item.quantity}</p>
                  <p className="item-total">Total: ₹{item.total_price}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Price Breakdown */}
        <div className="price-breakdown-section">
          <h2>Price Breakdown</h2>
          <div className="price-details">


            {order.cod_fee > 0 && (
              <div className="price-row">
                <span>COD Fee:</span>
                <span>₹{order.cod_fee}</span>
              </div>
            )}
            {order.discount_amount > 0 && (
              <div className="price-row discount">
                <span>Discount:</span>
                <span>-₹{order.discount_amount}</span>
              </div>
            )}
            <div className="price-row total">
              <span>Total:</span>
              <span>₹{order.final_amount}</span>
            </div>
          </div>
        </div>

        {/* Addresses */}
        <div className="addresses-section">
          <div className="address-card">
            <h3>Shipping Address</h3>
            <p>{formatAddress(order.shipping_address)}</p>
          </div>
          <div className="address-card">
            <h3>Billing Address</h3>
            <p>{formatAddress(order.billing_address)}</p>
          </div>
        </div>

        {/* Order Tracking */}
        <div className="tracking-section">
          <h2>Order Tracking</h2>
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

        {/* Order Actions */}
        <div className="order-actions-section">
          <h2>Order Actions</h2>
          <div className="actions-grid">
            {order.order_status === 'pending' && (
              <button className="action-btn cancel" onClick={handleCancelOrder}>
                Cancel Order
              </button>
            )}
            {order.order_status === 'delivered' && (
              <button className="action-btn return" onClick={() => setShowReturnModal(true)}>
                Return Order
              </button>
            )}
            <button className="action-btn secondary" onClick={() => window.print()}>
              Print Invoice
            </button>
          </div>
        </div>
      </div>

      {/* Return Modal */}
      {showReturnModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Return Order</h3>
            <p>Please provide a reason for returning this order:</p>
            <textarea
              value={returnReason}
              onChange={(e) => setReturnReason(e.target.value)}
              placeholder="Enter your reason for return..."
              rows="4"
            />
            <div className="modal-actions">
              <button onClick={() => setShowReturnModal(false)}>Cancel</button>
              <button onClick={handleReturnOrder}>Submit Return</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderDetails;
