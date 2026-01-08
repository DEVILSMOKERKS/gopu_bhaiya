'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import axios from 'axios';
import './OrderManagement.css';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const OrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState({
    status: '',
    payment_status: '',
    search: ''
  });
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [analytics, setAnalytics] = useState(null);

  useEffect(() => {
    fetchOrders();
    fetchAnalytics();
  }, [currentPage, filters]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const token = typeof window !== 'undefined' ? localStorage.getItem('adminToken') : null;

      if (!token) {
        setError('Authentication required');
        return;
      }

      let url = `${API_URL}/orders/admin/all?page=${currentPage}&limit=20`;
      if (filters.status) url += `&status=${filters.status}`;
      if (filters.payment_status) url += `&payment_status=${filters.payment_status}`;
      if (filters.search) url += `&search=${filters.search}`;

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

  const fetchAnalytics = async () => {
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('adminToken') : null;
      const response = await axios.get(`${API_URL}/orders/admin/analytics`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        setAnalytics(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching analytics:', error);
    }
  };

  const fetchOrderDetails = async (orderId) => {
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('adminToken') : null;
      const response = await axios.get(`${API_URL}/orders/admin/order/${orderId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        setSelectedOrder(response.data.data);
        setShowOrderModal(true);
      }
    } catch (error) {
      console.error('Error fetching order details:', error);
      alert('Failed to load order details');
    }
  };

  const updateOrderStatus = async (orderId, status) => {
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('adminToken') : null;
      const response = await axios.put(`${API_URL}/orders/admin/update-status/${orderId}`, {
        status
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        // Refresh orders and analytics after update
        fetchOrders();
        fetchAnalytics();
        alert('Order status updated successfully');
        
        if (selectedOrder && selectedOrder.order.order_id === orderId) {
          fetchOrderDetails(orderId);
        }
      }
    } catch (error) {
      console.error('Error updating order status:', error);
      alert('Failed to update order status');
    }
  };

  const updateTrackingInfo = async (orderId, trackingNumber) => {
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('adminToken') : null;
      const response = await axios.put(`${API_URL}/orders/admin/update-tracking/${orderId}`, {
        tracking_number: trackingNumber
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        alert('Tracking information updated successfully');
        fetchOrders();
        if (selectedOrder && selectedOrder.order.order_id === orderId) {
          fetchOrderDetails(orderId);
        }
      }
    } catch (error) {
      console.error('Error updating tracking info:', error);
      alert('Failed to update tracking information');
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setCurrentPage(1);
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
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="admin-orders-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading orders...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-orders-container">
        <div className="error-message">
          <p>{error}</p>
          <button onClick={fetchOrders}>Try Again</button>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-orders-container">
      {/* Header */}
      <div className="admin-orders-header">
        <h1>Order Management</h1>
        <p>Manage and track all customer orders</p>
      </div>

      {/* Analytics Dashboard */}
      {analytics && (
        <div className="analytics-dashboard">
          <div className="analytics-card">
            <h3>Total Orders</h3>
            <div className="analytics-number">{analytics.total_orders}</div>
            <span className="analytics-period">Last 30 days</span>
          </div>
          <div className="analytics-card">
            <h3>Total Revenue</h3>
            <div className="analytics-number">₹{analytics.total_revenue?.toLocaleString() || 0}</div>
            <span className="analytics-period">Last 30 days</span>
          </div>
          <div className="analytics-card">
            <h3>Pending Orders</h3>
            <div className="analytics-number">
              {analytics.orders_by_status?.find(s => s.order_status === 'pending')?.count || 0}
            </div>
            <span className="analytics-period">Requires attention</span>
          </div>
          <div className="analytics-card">
            <h3>Processing Orders</h3>
            <div className="analytics-number">
              {analytics.orders_by_status?.find(s => s.order_status === 'processing')?.count || 0}
            </div>
            <span className="analytics-period">In progress</span>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="filters-section">
        <div className="filter-group">
          <label>Order Status:</label>
          <select
            value={filters.status}
            onChange={(e) => handleFilterChange('status', e.target.value)}
          >
            <option value="">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
            <option value="returned">Returned</option>
          </select>
        </div>

        <div className="filter-group">
          <label>Payment Status:</label>
          <select
            value={filters.payment_status}
            onChange={(e) => handleFilterChange('payment_status', e.target.value)}
          >
            <option value="">All Payments</option>
            <option value="pending">Pending</option>
            <option value="paid">Paid</option>
            <option value="failed">Failed</option>
            <option value="refunded">Refunded</option>
          </select>
        </div>

        <div className="filter-group">
          <label>Search:</label>
          <input
            type="text"
            placeholder="Order number, customer name, or email"
            value={filters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
          />
        </div>
      </div>

      {/* Orders Table */}
      <div className="orders-table-container">
        <table className="orders-table">
          <thead>
            <tr>
              <th>Order #</th>
              <th>Customer</th>
              <th>Date</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Payment</th>
              <th>Items</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.order_id}>
                <td>
                  <strong>{order.order_number}</strong>
                </td>
                <td>
                  <div className="customer-info">
                    <p className="customer-name">{order.customer_name}</p>
                    <p className="customer-email">{order.customer_email}</p>
                  </div>
                </td>
                <td>{formatDate(order.created_at)}</td>
                <td>₹{order.final_amount}</td>
                <td>
                  <span className={`status-badge status-${order.order_status}`}>
                    {getStatusText(order.order_status)}
                  </span>
                </td>
                <td>
                  <span className={`payment-status ${order.payment_status}`}>
                    {order.payment_status === 'paid' ? 'Paid' : 'Pending'}
                  </span>
                </td>
                <td>{order.total_items} items</td>
                <td>
                  <div className="action-buttons">
                    <button
                      className="view-btn"
                      onClick={() => fetchOrderDetails(order.order_id)}
                    >
                      View
                    </button>
                    <button
                      className="update-btn"
                      onClick={() => fetchOrderDetails(order.order_id)}
                    >
                      Update
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="pagination">
          <button
            onClick={() => setCurrentPage(currentPage - 1)}
            disabled={currentPage === 1}
            className="pagination-btn"
          >
            Previous
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`pagination-btn ${currentPage === page ? 'active' : ''}`}
            >
              {page}
            </button>
          ))}

          <button
            onClick={() => setCurrentPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="pagination-btn"
          >
            Next
          </button>
        </div>
      )}

      {/* Order Details Modal */}
      {showOrderModal && selectedOrder && (
        <div className="modal-overlay">
          <div className="order-modal">
            <div className="modal-header">
              <h2>Order #{selectedOrder.order.order_number}</h2>
              <button
                className="close-btn"
                onClick={() => setShowOrderModal(false)}
              >
                ×
              </button>
            </div>

            <div className="modal-content">
              {/* Order Summary */}
              <div className="order-summary-section">
                <h3>Order Summary</h3>
                <div className="summary-grid">
                  <div className="summary-item">
                    <span>Customer:</span>
                    <span>{selectedOrder.order.customer_name}</span>
                  </div>
                  <div className="summary-item">
                    <span>Email:</span>
                    <span>{selectedOrder.order.customer_email}</span>
                  </div>
                  <div className="summary-item">
                    <span>Phone:</span>
                    <span>{selectedOrder.order.customer_phone}</span>
                  </div>
                  <div className="summary-item">
                    <span>Order Date:</span>
                    <span>{formatDate(selectedOrder.order.created_at)}</span>
                  </div>
                  <div className="summary-item">
                    <span>Total Amount:</span>
                    <span>₹{selectedOrder.order.final_amount}</span>
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div className="order-items-section">
                <h3>Order Items</h3>
                <div className="items-list">
                  {selectedOrder.items.map((item, index) => (
                    <div key={index} className="item-row">
                      <div className="item-image">
                        <Image
                          src={item.product_image ? `${API_URL.replace('/api', '')}${item.product_image}` : '/src/assets/img/Bestseller1.jpg'}
                          alt={item.product_name}
                          width={80}
                          height={80}
                          style={{ objectFit: 'cover' }}
                          onError={(e) => {
                            e.target.src = '/src/assets/img/Bestseller1.jpg';
                          }}
                        />
                      </div>
                      <div className="item-info">
                        <h4>{item.product_name}</h4>
                        <p>Size: {item.size} | Color: {item.color_name}</p>
                        <p>Quantity: {item.quantity}</p>
                      </div>
                      <div className="item-price">
                        <p>Quantity: {item.quantity}</p>
                        <strong>₹{item.total_price}</strong>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order Actions */}
              <div className="order-actions-section">
                <h3>Order Actions</h3>
                <div className="actions-grid">
                  <div className="action-group">
                    <label>Update Status:</label>
                    <select
                      defaultValue={selectedOrder.order.order_status}
                      onChange={(e) => updateOrderStatus(selectedOrder.order.order_id, e.target.value)}
                    >
                      <option value="pending">Pending</option>
                      <option value="processing">Processing</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                      <option value="returned">Returned</option>
                    </select>
                  </div>

                  <div className="action-group">
                    <label>Tracking Number:</label>
                    <input
                      type="text"
                      placeholder="Enter tracking number"
                      defaultValue={selectedOrder.order.tracking_number || ''}
                      onBlur={(e) => updateTrackingInfo(
                        selectedOrder.order.order_id,
                        e.target.value
                      )}
                    />
                  </div>
                </div>
              </div>

              {/* Tracking History */}
              <div className="tracking-history-section">
                <h3>Tracking History</h3>
                <div className="tracking-timeline">
                  {selectedOrder.tracking.map((track, index) => (
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
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderManagement;
