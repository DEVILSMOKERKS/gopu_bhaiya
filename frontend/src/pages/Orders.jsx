'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import './Orders.css';

const API_URL = process.env.NEXT_PUBLIC_API_URL

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedStatus, setSelectedStatus] = useState('');
  const router = useRouter();

  useEffect(() => {
    fetchOrders();
  }, [currentPage, selectedStatus]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

      if (!token) {
        router.push('/login');
        return;
      }

      let url = `${API_URL}/orders/my-orders?page=${currentPage}&limit=10`;
      if (selectedStatus) {
        url += `&status=${selectedStatus}`;
      }

      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        setOrders(response.data.data.orders);
        setTotalPages(response.data.data.pagination.total_pages);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      setError('Failed to load orders');
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
      month: 'short',
      day: 'numeric'
    });
  };

  const handleOrderClick = (orderId) => {
    router.push(`/orders/${orderId}`);
  };

  const handleStatusFilter = (status) => {
    setSelectedStatus(status);
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  if (loading) {
    return (
      <div className="user-orders-container">
        <div className="user-orders-loading-spinner">
          <div className="user-orders-spinner"></div>
          <p>Loading your orders...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="user-orders-container">
        <div className="user-orders-error-message">
          <p>{error}</p>
          <button onClick={fetchOrders}>Try Again</button>
        </div>
      </div>
    );
  }

  return (
    <div className="user-orders-container">
      <div className="user-orders-header">
        <h1>My Orders</h1>
        <p>Track your orders and view order history</p>
      </div>

      {/* Status Filter */}
      <div className="user-orders-status-filter">
        <button
          className={selectedStatus === '' ? 'active' : ''}
          onClick={() => handleStatusFilter('')}
        >
          All Orders
        </button>
        <button
          className={selectedStatus === 'pending' ? 'active' : ''}
          onClick={() => handleStatusFilter('pending')}
        >
          Pending
        </button>
        <button
          className={selectedStatus === 'processing' ? 'active' : ''}
          onClick={() => handleStatusFilter('processing')}
        >
          Processing
        </button>
        <button
          className={selectedStatus === 'shipped' ? 'active' : ''}
          onClick={() => handleStatusFilter('shipped')}
        >
          Shipped
        </button>
        <button
          className={selectedStatus === 'delivered' ? 'active' : ''}
          onClick={() => handleStatusFilter('delivered')}
        >
          Delivered
        </button>
      </div>

      {/* Orders List */}
      <div className="user-orders-list">
        {orders.length === 0 ? (
          <div className="user-orders-no-orders">
            <div className="user-orders-no-orders-icon">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <path d="M16 10a4 4 0 0 1-8 0" />
              </svg>
            </div>
            <h3>No orders found</h3>
            <p>You haven&apos;t placed any orders yet.</p>
            <button onClick={() => router.push('/shop')}>Start Shopping</button>
          </div>
        ) : (
          orders.map((order) => (
            <div key={order.order_id} className="user-orders-order-card" onClick={() => handleOrderClick(order.order_id)}>
              <div className="user-orders-order-header">
                <div className="user-orders-order-info">
                  <h3>Order #{order.order_number}</h3>
                  <p className="user-orders-order-date">{formatDate(order.created_at)}</p>
                </div>
                <div className="user-orders-order-status">
                  <span
                    className="user-orders-status-badge"
                    style={{ backgroundColor: getStatusColor(order.order_status) }}
                  >
                    {getStatusText(order.order_status)}
                  </span>
                </div>
              </div>

              <div className="user-orders-order-details">
                <div className="user-orders-order-summary">
                  <p><strong>Total Items:</strong> {order.total_items}</p>
                  <p><strong>Total Amount:</strong> ₹{order.final_amount}</p>
                  <p><strong>Payment Status:</strong>
                    <span className={`user-orders-payment-status ${order.payment_status}`}>
                      {order.payment_status === 'paid' ? 'Paid' : 'Pending'}
                    </span>
                  </p>
                </div>

                <div className="user-orders-order-actions">
                  <button className="user-orders-view-details-btn">View Details</button>
                  {order.order_status === 'pending' && (
                    <button
                      className="user-orders-cancel-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        // Handle cancel order
                      }}
                    >
                      Cancel Order
                    </button>
                  )}
                  {order.order_status === 'delivered' && (
                    <button
                      className="user-orders-return-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        // Handle return order
                      }}
                    >
                      Return Order
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="user-orders-pagination">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="user-orders-pagination-btn"
          >
            Previous
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => handlePageChange(page)}
              className={`user-orders-pagination-btn ${currentPage === page ? 'active' : ''}`}
            >
              {page}
            </button>
          ))}

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="user-orders-pagination-btn"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default Orders;
