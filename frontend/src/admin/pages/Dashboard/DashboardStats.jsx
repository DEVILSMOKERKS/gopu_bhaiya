import React from 'react';
import './adminDashboardStats.css';

const DashboardStats = ({ stats }) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatNumber = (number) => {
    return new Intl.NumberFormat('en-IN').format(number);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: '2-digit',
      day: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    });
  };

  // Mock data to match the image exactly
  const mockStats = {
    totalSales: 13998,
    totalOrders: 4,
    newCustomers: 1,
    totalRevenue: 56998
  };

  const mockRecentOrders = [
    {
      id: 24,
      customer: 'Rahul Jangir',
      products: 3,
      amount: 0,
      status: 'PROCESSING',
      date: '01/09/2025 04:08:19 PM'
    },
    {
      id: 23,
      customer: 'Rahul Jangir',
      products: 1,
      amount: 43000,
      status: 'PROCESSING',
      date: '01/09/2025 04:08:19 PM'
    },
    {
      id: 22,
      customer: 'Rahul Jangir',
      products: 0,
      amount: 6999,
      status: 'PROCESSING',
      date: '01/09/2025 04:08:19 PM'
    },
    {
      id: 21,
      customer: 'Rahul Jangir',
      products: 0,
      amount: 6999,
      status: 'PROCESSING',
      date: '01/09/2025 04:08:19 PM'
    }
  ];

  return (
    <div className="admin-dashboard-stats">
      {/* KPI Cards Section */}
      <div className="admin-stats-overview">
        <div className="admin-stat-item">
          <div className="admin-stat-header">
            <div className="admin-stat-label">Total Sales</div>
            <div className="admin-stat-icon">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="12" y1="1" x2="12" y2="23"></line>
                <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
              </svg>
            </div>
          </div>
          <div className="admin-stat-value">{formatCurrency(mockStats.totalSales)}</div>
        </div>
        
        <div className="admin-stat-item">
          <div className="admin-stat-header">
            <div className="admin-stat-label">Total Orders</div>
            <div className="admin-stat-icon">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <path d="M16 10a4 4 0 0 1-8 0"></path>
              </svg>
            </div>
          </div>
          <div className="admin-stat-value">{mockStats.totalOrders}</div>
        </div>
        
        <div className="admin-stat-item">
          <div className="admin-stat-header">
            <div className="admin-stat-label">New Customers</div>
            <div className="admin-stat-icon">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
              </svg>
            </div>
          </div>
          <div className="admin-stat-value">{mockStats.newCustomers}</div>
        </div>
        
        <div className="admin-stat-item">
          <div className="admin-stat-header">
            <div className="admin-stat-label">Total Revenue</div>
            <div className="admin-stat-icon">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 1v22"></path>
                <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
              </svg>
            </div>
          </div>
          <div className="admin-stat-value">{formatCurrency(mockStats.totalRevenue)}</div>
        </div>
      </div>

      {/* Details Section */}
      <div className="admin-stats-details">
        {/* Recent Orders */}
        <div className="admin-detail-card">
          <div className="admin-section-header">
            <h3>Recent Orders</h3>
            <button className="admin-view-all-btn">View all</button>
          </div>
          
          <div className="admin-orders-table">
            <table>
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Products</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {mockRecentOrders.map((order) => (
                  <tr key={order.id}>
                    <td>
                      <span className="admin-order-id">{order.id}</span>
                    </td>
                    <td>{order.customer}</td>
                    <td>{order.products} items</td>
                    <td>{formatCurrency(order.amount)}</td>
                    <td>
                      <span className="admin-status-badge processing">
                        {order.status}
                      </span>
                    </td>
                    <td>{order.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Product Performance */}
        <div className="admin-detail-card">
          <div className="admin-section-header">
            <h3>Product Performance</h3>
            <button className="admin-view-all-btn">View Report</button>
          </div>
          
          <div className="admin-product-performance-table">
            <table>
              <thead>
                <tr>
                  <th>Product Name</th>
                  <th>Category</th>
                  <th>Sales</th>
                  <th>Growth</th>
                  <th>Revenue</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td colSpan="5" className="admin-no-data">
                    No data available
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardStats;
