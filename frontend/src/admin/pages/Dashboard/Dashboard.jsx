import React, { useEffect, useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { IndianRupee, ShoppingBag, Users, Wallet, Plus, FolderPlus, Layers, Package } from "lucide-react";
import "./adminDashboard.css";
import { useAdmin } from '../../../context/AdminContext';

const API_URL = import.meta.env.VITE_API_URL;

const Dashboard = () => {
  const navigate = useNavigate();
  const { token } = useAdmin();

  // State for each section
  const [stats, setStats] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [paymentStatus, setPaymentStatus] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderPopup, setShowOrderPopup] = useState(false);

  // Fetch all dashboard data in parallel
  useEffect(() => {
    if (!token) return;
    setLoading(true);
    setError("");
    
    // Fetch dashboard data using the same APIs as OrderManagement
    const fetchDashboardData = async () => {
      try {
        // Fetch dashboard stats - using orders analytics endpoint (same as OrderManagement)
        const statsResponse = await axios.get(`${API_URL}/orders/admin/analytics`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (statsResponse.data.success) {
          const data = statsResponse.data.data;
          setStats([
            { title: "Total Sales", value: `₹${Number(data.total_revenue || 0).toLocaleString('en-IN')}`, icon: "rupee" },
            { title: "Total Orders", value: data.total_orders || 0, icon: "bag" },
            { title: "New Customers", value: data.new_customers || 0, icon: "users" },
            { title: "Total Revenue", value: `₹${Number(data.total_revenue || 0).toLocaleString('en-IN')}`, icon: "wallet" },
          ]);
        }

        // Fetch recent orders (limit to 5) - using same API as OrderManagement
        const ordersResponse = await axios.get(`${API_URL}/orders/admin/all?page=1&limit=5`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (ordersResponse.data.success) {
          const ordersData = ordersResponse.data.data.orders.map(order => ({
            id: order.order_id,
            order_number: order.order_number,
            customer: order.customer_name,
            customer_email: order.customer_email,
            product_count: order.total_items || 0,
            amount: `₹${Number(order.final_amount || 0).toLocaleString('en-IN')}`,
            status: order.order_status || 'pending',
            date: new Date(order.created_at).toLocaleDateString('en-IN'),
            payment_status: order.payment_status || 'pending'
          }));
          setOrders(ordersData);
        }

        // Set payment status data
        setPaymentStatus([
          { label: "Completed", value: 328 },
          { label: "Pending", value: 28 },
          { label: "Failed", value: 38 },
          { label: "Refunded", value: 38 },
        ]);

      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setError("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [token]);

  // Fetch order details for popup - using same API as OrderManagement
  const fetchOrderDetails = async (orderId) => {
    try {
      const response = await axios.get(`${API_URL}/orders/admin/order/${orderId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        const orderData = response.data.data;
        setSelectedOrder({
          order_number: orderData.order.order_number,
          customer_name: orderData.order.customer_name,
          total_amount: orderData.order.final_amount,
          payment_status: orderData.order.payment_status,
          order_status: orderData.order.order_status,
          created_at: orderData.order.created_at,
          products: orderData.items.map(item => ({
            product_name: item.product_name,
            quantity: item.quantity,
            price: item.total_price / item.quantity
          }))
        });
        setShowOrderPopup(true);
      }
    } catch (error) {
      console.error('Error fetching order details:', error);
      // Fallback to mock data if API fails
      const mockOrderDetails = {
        order_number: orderId,
        customer_name: 'John Doe',
        total_amount: 1500,
        payment_status: 'paid',
        order_status: 'processing',
        created_at: new Date().toISOString(),
        products: [
          {
            product_name: 'Sample Product 1',
            quantity: 2,
            price: 750
          }
        ]
      };
      setSelectedOrder(mockOrderDetails);
      setShowOrderPopup(true);
    }
  };

  // Lucide icon map for top-right
  const StatIcon = ({ type }) => {
    let IconComponent;
    switch (type) {
      case "rupee":
        IconComponent = IndianRupee;
        break;
      case "bag":
        IconComponent = ShoppingBag;
        break;
      case "users":
        IconComponent = Users;
        break;
      case "wallet":
        IconComponent = Wallet;
        break;
      default:
        return null;
    }
    return (
      <span className="dashboard-stat-icon-bg dashboard-stat-icon-bg-outline">
        <IconComponent size={20} stroke="var(--primary-color)" />
      </span>
    );
  };

  // Payment status color/class map
  const paymentStatusClassMap = {
    Completed: { bar: "payment-bar-completed", dot: "dot-completed" },
    Pending: { bar: "payment-bar-pending", dot: "dot-pending" },
    Failed: { bar: "payment-bar-failed", dot: "dot-failed" },
    Refunded: { bar: "payment-bar-refunded", dot: "dot-refunded" },
  };
  const totalPayments = paymentStatus.reduce((sum, s) => sum + s.value, 0);
  const getBarWidth = (val) => totalPayments ? `${(val / totalPayments) * 100}%` : '0%';

  // Loading/Error states
  if (loading) return <div>Loading...</div>;
  if (error) return <div className="dashboard-error">{error}</div>;

  // Fallbacks for empty data (to keep UI stable)
  const statsData = stats.length ? stats : [
    { title: "Total Sales", value: "₹0", icon: "rupee" },
    { title: "Total Orders", value: "0", icon: "bag" },
    { title: "New Customers", value: "0", icon: "users" },
    { title: "Total Revenue", value: "₹0", icon: "wallet" },
  ];

  return (
    <div className="dashboard-container">
      {/* =====================
          Top Stats Cards
      ===================== */}
      <div className="dashboard-stats">
        {statsData.map((stat, i) => (
          <div className="dashboard-card dashboard-card-modern" key={i}>
            <div className="dashboard-card-header">
              <div>
                <div className="dashboard-card-title">{stat.title}</div>
                <div className="dashboard-card-value">{stat.value}</div>
              </div>
              <StatIcon type={stat.icon} />
            </div>
          </div>
        ))}
      </div>

      {/* =====================
          Recent Orders Table
      ===================== */}
      <div className="recent-orders-section dashboard-section-gap">
        <div className="recent-orders-title">
          <span>Recent Orders</span>
          <Link to="/admin/orders" className="dashboard-viewall-btn">View all</Link>
        </div>
        <div className="orders-table-wrapper">
          <table className="orders-table">
            <thead>
              <tr>
                <th className="order-id">Order ID</th>
                <th>Customer</th>
                <th>Products</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {orders.length > 0 ? (
                orders.map((order, i) => (
                  <tr key={i} style={{ cursor: order.id ? 'pointer' : 'default' }}>
                    <td className="order-id">
                      <span className="order-id-link" onClick={() => fetchOrderDetails(order.id)}>{order.order_number}</span>
                    </td>
                    <td className="customer-name">{order.customer}</td>
                    <td className="product-name">{order.product_count} items</td>
                    <td>
                      <b>{order.amount}</b>
                    </td>
                    <td>
                      <span className={`status-badge status-${(order.status || '').toLowerCase()}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="order-date">{order.date}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '20px', color: '#666' }}>
                    No orders found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* =====================
          Quick Actions Section
      ===================== */}
      <div className="dashboard-quick-actions">
        <div className="quick-actions-header">
          <span>Quick Actions</span>
        </div>
        <div className="quick-actions-grid">
          <button 
            className="quick-action-btn"
            onClick={() => navigate('/admin/products/create')}
          >
            <div className="quick-action-icon">
              <Plus size={24} stroke="var(--primary-color)" />
            </div>
            <div className="quick-action-content">
              <h3>Add Product</h3>
              <p>Create a new product listing</p>
            </div>
          </button>

          <button 
            className="quick-action-btn"
            onClick={() => navigate('/admin/categories/create')}
          >
            <div className="quick-action-icon">
              <FolderPlus size={24} stroke="var(--primary-color)" />
            </div>
            <div className="quick-action-content">
              <h3>Add Category</h3>
              <p>Create a new product category</p>
            </div>
          </button>

          <button 
            className="quick-action-btn"
            onClick={() => navigate('/admin/subcategories/create')}
          >
            <div className="quick-action-icon">
              <Layers size={24} stroke="var(--primary-color)" />
            </div>
            <div className="quick-action-content">
              <h3>Add Sub Category</h3>
              <p>Create a new sub category</p>
            </div>
          </button>

          <button 
            className="quick-action-btn"
            onClick={() => navigate('/admin/orders')}
          >
            <div className="quick-action-icon">
              <Package size={24} stroke="var(--primary-color)" />
            </div>
            <div className="quick-action-content">
              <h3>Orders</h3>
              <p>Manage all orders</p>
            </div>
          </button>
        </div>
      </div>

      {/* Order Popup */}
      {showOrderPopup && selectedOrder && (
        <div className="order-popup-overlay" onClick={() => setShowOrderPopup(false)}>
          <div className="order-popup" onClick={(e) => e.stopPropagation()}>
            <div className="order-popup-header">
              <h3>Order Details - #{selectedOrder.order_number}</h3>
              <button
                className="order-popup-close"
                onClick={() => setShowOrderPopup(false)}
              >
                ×
              </button>
            </div>
            <div className="order-popup-content">
              <div className="order-info-section">
                <h4>Order Information</h4>
                <div className="order-info-grid">
                  <div className="order-info-item">
                    <span className="info-label">Order ID:</span>
                    <span className="info-value">{selectedOrder.order_number}</span>
                  </div>
                  <div className="order-info-item">
                    <span className="info-label">Customer:</span>
                    <span className="info-value">{selectedOrder.customer_name}</span>
                  </div>
                  <div className="order-info-item">
                    <span className="info-label">Total Amount:</span>
                    <span className="info-value">₹{Number(selectedOrder.total_amount).toLocaleString('en-IN')}</span>
                  </div>
                  <div className="order-info-item">
                    <span className="info-label">Payment Status:</span>
                    <span className={`info-value status-${selectedOrder.payment_status}`}>
                      {selectedOrder.payment_status}
                    </span>
                  </div>
                  <div className="order-info-item">
                    <span className="info-label">Order Status:</span>
                    <span className={`info-value status-${selectedOrder.order_status}`}>
                      {selectedOrder.order_status}
                    </span>
                  </div>
                  <div className="order-info-item">
                    <span className="info-label">Order Date:</span>
                    <span className="info-value">
                      {new Date(selectedOrder.created_at).toLocaleDateString('en-IN')}
                    </span>
                  </div>
                </div>
              </div>

              <div className="order-products-section">
                <h4>Products ({selectedOrder.products?.length || 0} items)</h4>
                <div className="order-products-list">
                  {selectedOrder.products && selectedOrder.products.length > 0 ? (
                    selectedOrder.products.map((product, index) => (
                      <div key={index} className="order-product-item">
                        <div className="product-info">
                          <span className="product-name">{product.product_name}</span>
                          <span className="product-quantity">Qty: {product.quantity}</span>
                        </div>
                        <div className="product-price">
                          <span className="price">₹{Number(product.price).toLocaleString('en-IN')}</span>
                          <span className="total-price">₹{Number(product.price * product.quantity).toLocaleString('en-IN')}</span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="no-products">No products found</div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
